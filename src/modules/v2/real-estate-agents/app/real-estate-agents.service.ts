import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateRealEstateAgentDto } from "./dto/create-real-estate-agent.dto";
import { ClientService } from "src/modules/v2/client/app/client.service";
import statuses from "src/commons/contracts/Statuses";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import UserTypes from "src/commons/contracts/UserTypes";
import RealEstateAgentsPostgresqlRepository from "../repositories/RealEstateAgentsPostgresqlRepository";
import { SearchForRealEstateAgentDto } from "./dto/search.real-estate-agents.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import UploadService from "src/modules/services/UploadService";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import { PublicMessage } from "src/commons/enums/messages";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";
import { MessengerChannelsService } from "../../messenger_channels/app/messenger-channels.service";
import RealEstateAgentsTransformer from "./Transformer";

@Injectable()
export class RealEstateAgentsService {
  private readonly uploadService: UploadService;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly realEstateAgentPostgresRepository: RealEstateAgentsPostgresqlRepository,
    private readonly clientService: ClientService,
    private readonly mailerService: MailerService,
    private readonly messengerChannelsService: MessengerChannelsService,
    private readonly realEstateAgentsTransFormer: RealEstateAgentsTransformer
  ) {
    this.uploadService = new UploadService();
  }

  async storeRequest(
    createRealEstateAgentDto: CreateRealEstateAgentDto,
    avatar: string | null,
    license: string | null
  ) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(createRealEstateAgentDto.user_id) },
      });
      if (!client) {
        return { status: 400 };
      }

      let result = await this.realEstateAgentPostgresRepository.findOne({
        client_id: Number(createRealEstateAgentDto.user_id),
      });

      if (!result) {
        const tracking_code = await this.generateTrackingCode();
        await this.clientService.addRole(
          createRealEstateAgentDto.user_id,
          UserTypes.estate_agent
        );

        result = await this.realEstateAgentPostgresRepository.create({
          client_id: Number(createRealEstateAgentDto.user_id),
          name: createRealEstateAgentDto.name,
          phone: client.phone,
          tracking_code,
          avatar,
          license,
          province_id: Number(createRealEstateAgentDto.province_id),
          city_id: Number(createRealEstateAgentDto.city_id),
        });
      } else {
        if (!avatar) {
          createRealEstateAgentDto.avatar = result.avatar;
        } else {
          createRealEstateAgentDto.avatar = avatar;
        }

        if (!license) {
          createRealEstateAgentDto.license = result.license;
        } else {
          createRealEstateAgentDto.license = license;
        }

        result = await this.realEstateAgentPostgresRepository.updateOne(
          { id: Number(result.id) },
          {
            name: createRealEstateAgentDto.name,
            avatar: createRealEstateAgentDto.avatar,
            license: createRealEstateAgentDto.license,
            province_id: Number(createRealEstateAgentDto.province_id),
            city_id: Number(createRealEstateAgentDto.city_id),
            status: statuses.pending,
            license_status: statuses.pending,
          }
        );
      }

      if (avatar) {
        await this.uploadService.moveFile(
          avatar,
          "temp/estate_agents",
          "estate-agents/avatars/"
        );
      }

      if (license) {
        await this.uploadService.moveFile(
          license,
          "temp/estate_agents",
          "estate-agents/licenses/"
        );
      }

      const response = await this.prismaService.realEstateAgents.findFirst({
        where: { id: result.id },
        select: {
          id: true,
          name: true,
          phone: true,
          validate_phone: true,
          avatar: true,
          license: true,
          license_status: true,
          status: true,
          score: true,
          published_count: true,
          number_of_ads: true,
          client_id: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          channels: { select: { id: true, key: true } },
        },
      });

      await this.sendEmailForAdmins();
      return { status: 201, response };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async generateTrackingCode(): Promise<string> {
    // const uniqueCode = randomBytes(6).toString("hex").toUpperCase();
    const uniqueCode =
      "REA_" +
      (Math.random() * (9999999999 - 1000000000) + 100000000).toFixed(0);
    const isCodeUnique = await this.prismaService.realEstateAgents.findFirst({
      where: { tracking_code: uniqueCode },
    });

    if (isCodeUnique) {
      return this.generateTrackingCode();
    }

    return uniqueCode;
  }

  async listOfRealEstateAgents(
    query: ListRealEstateAgentDto,
    clientId: number
  ) {
    const count = await this.realEstateAgentPostgresRepository.count({
      status: statuses.active,
      province_id: Number(query.province_id),
      city_id: Number(query.city_id),
    });
    const total = this.getTotalPageNumber(
      Number(count),
      Number(query.per_page)
    );

    const paginationValue = this.makePagination(
      Number(query.page),
      Number(query.per_page)
    );

    const list = await this.prismaService.realEstateAgents.findMany({
      where: {
        status: statuses.active,
        province_id: Number(query.province_id),
        city_id: Number(query.city_id),
      },
      select: {
        id: true,
        name: true,
        client_id: true,
        phone: true,
        validate_phone: true,
        avatar: true,
        license: true,
        license_status: true,
        status: true,
        score: true,
        published_count: true,
        number_of_ads: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        channels: { select: { id: true, key: true } },
      },
      orderBy: { id: "desc" },
      skip: paginationValue.offset,
      take: paginationValue.per_page,
    });

    const presentedAgents = await Promise.all(
      list.map(async (agent: any) => {
        const advisor = await this.prismaService.realEstateAdvisors.findFirst({
          where: {
            real_estate_agent_id: agent.id,
            permissions: { hasSome: "answer_calls" },
          },
          select: { client: { select: { phone: true } } },
          orderBy: { id: "desc" },
        });
        if (advisor) {
          agent.phone = advisor.client.phone;
        }

        const number_of_ads = await this.prismaService.realEstateAds.count({
          where: {
            agent_id: agent.id,
            OR: [
              { seller_type: RealEstateAdSellerTypes.real_estate_agent },
              { seller_type: RealEstateAdSellerTypes.advisor },
            ],
            status: statuses.approved,
          },
        });
        agent.number_of_ads = number_of_ads;

        const channel =
          await this.messengerChannelsService.findChannelByClientId(
            agent.client_id,
            clientId,
            "real_estate"
          );

        agent.channel = channel;
        return agent;
      })
    );

    return {
      list: presentedAgents,
      metadata: this.makeMetadata(
        Number(query.page),
        Number(query.per_page),
        Number(total)
      ),
    };
  }

  async getActiveRealEstates(query: ListRealEstateAgentDto) {
    const count = await this.realEstateAgentPostgresRepository.count({
      status: statuses.active,
      province_id: Number(query.province_id),
    });

    const { page, per_page, skip } = PaginationSolver({
      per_page: +query.per_page,
      page: +query.page,
    });

    const list = await this.prismaService.realEstateAgents.findMany({
      where: {
        status: statuses.active,
        province_id: +query.province_id,
        city_id: +query.city_id,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        validate_phone: true,
        avatar: true,
        license: true,
        license_status: true,
        status: true,
        score: true,
        published_count: true,
        number_of_ads: true,
        client_id: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        channels: { select: { id: true, key: true } },
      },
      orderBy: { published_ad_time: "desc" },
      skip,
      take: per_page,
    });

    const presentedAgents = await Promise.all(
      list.map(async (agent: any) => {
        const advisor = await this.prismaService.realEstateAdvisors.findFirst({
          where: {
            real_estate_agent_id: agent.id,
            permissions: { hasSome: "answer_calls" },
          },
          select: { client: { select: { phone: true } } },
          orderBy: { id: "desc" },
        });
        if (advisor) {
          agent.phone = advisor.client.phone;
        }

        const number_of_ads = await this.prismaService.realEstateAds.count({
          where: {
            agent_id: agent.id,
            OR: [
              { seller_type: RealEstateAdSellerTypes.real_estate_agent },
              { seller_type: RealEstateAdSellerTypes.advisor },
            ],
            status: statuses.approved,
          },
        });
        agent.number_of_ads = number_of_ads;
        return agent;
      })
    );

    const transformer =
      this.realEstateAgentsTransFormer.collection(presentedAgents);

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.OkResponse,
      data: {
        data: transformer,
        metadata: PaginationGenerator(page, per_page, count),
      },
    };
  }

  async GetRealEstateAgentInfo(agent_id: number, client_id: number) {
    const list = await this.prismaService.realEstateAgents.findMany({
      where: {
        id: Number(agent_id),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        validate_phone: true,
        avatar: true,
        license: true,
        license_status: true,
        status: true,
        score: true,
        published_count: true,
        number_of_ads: true,
        client_id: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        channels: { select: { id: true, key: true } },
      },
      orderBy: { id: "desc" },
    });

    const presentedAgents = await Promise.all(
      list.map(async (agent: any) => {
        const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
          where: {
            agent_id: agent.id,
            permissions: { hasSome: "answer_calls" },
          },
          select: { client: { select: { phone: true } } },
          orderBy: { id: "desc" },
        });
        if (admin) {
          agent.phone = admin.client.phone;
        }

        const number_of_ads = await this.prismaService.realEstateAds.count({
          where: {
            agent_id: agent.id,
            OR: [
              { seller_type: RealEstateAdSellerTypes.real_estate_agent },
              { seller_type: RealEstateAdSellerTypes.advisor },
            ],
            status: statuses.approved,
          },
        });
        agent.number_of_ads = number_of_ads;
        const channel =
          await this.messengerChannelsService.findChannelByClientId(
            agent.client_id,
            client_id,
            "real_estate"
          );

        agent.channel = channel;
        return agent;
      })
    );

    return {
      list: presentedAgents,
    };
  }

  async search(query: SearchForRealEstateAgentDto) {
    const count = await this.realEstateAgentPostgresRepository.count({
      status: statuses.active,
      name: {
        contains: query.keyword,
        mode: "insensitive",
      },
      province_id: Number(query.province_id),
      city_id: Number(query.city_id),
    });
    const total = this.getTotalPageNumber(
      Number(count),
      Number(query.per_page)
    );

    const paginationValue = this.makePagination(
      Number(query.page),
      Number(query.per_page)
    );

    const list = await this.realEstateAgentPostgresRepository.findNewItems(
      {
        status: statuses.active,
        name: {
          contains: query.keyword,
          mode: "insensitive",
        },
        province_id: Number(query.province_id),
        city_id: Number(query.city_id),
      },
      {
        id: true,
        name: true,
        avatar: true,
        license: true,
        license_status: true,
        status: true,
        score: true,
        published_count: true,
        number_of_ads: true,
        client_id: true,
        province: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        channels: { select: { id: true, key: true } },
      },
      { offset: paginationValue.offset, per_page: paginationValue.per_page }
    );

    const presentedAgents = await Promise.all(
      list.map(async (agent: any) => {
        const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
          where: {
            agent_id: agent.id,
            permissions: { hasSome: "answer_calls" },
          },
          select: { client: { select: { phone: true } } },
          orderBy: { id: "desc" },
        });
        if (admin) {
          agent.phone = admin.client.phone;
        }

        const number_of_ads = await this.prismaService.realEstateAds.count({
          where: {
            agent_id: agent.id,
            OR: [
              { seller_type: RealEstateAdSellerTypes.real_estate_agent },
              { seller_type: RealEstateAdSellerTypes.advisor },
            ],
            status: statuses.approved,
          },
        });
        agent.number_of_ads = number_of_ads;
        return agent;
      })
    );

    return {
      list: presentedAgents,
      metadata: this.makeMetadata(
        Number(query.page),
        Number(query.per_page),
        Number(total)
      ),
    };
  }

  async findOne(id: number) {
    try {
      return await this.realEstateAgentPostgresRepository.findOne({
        id: id,
      });
    } catch (error) {
      return { status: 500 };
    }
  }

  async updateScore(where: any, data: any) {
    try {
      return await this.realEstateAgentPostgresRepository.updateOne(
        where,
        data
      );
    } catch (error) {
      return { status: 500 };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} realEstateAgent`;
  }

  private async getUserPermittedAds() {
    const result = await this.prismaService.adminUserRoleCategories.findMany({
      where: {
        key: "real_estate_agents",
        assignedRoles: {
          some: {
            role: {
              isNot: {
                title: "سوپر ادمین",
              },
            },
          },
        },
      },
      select: {
        assignedRoles: {
          select: {
            role: {
              select: {
                title: true,
                userRoles: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    let usersPermitted = [];
    result.map((item) => {
      item.assignedRoles.map((role) => {
        if (role.role.title !== "سوپر ادمین") {
          role.role.userRoles.map((user) => {
            usersPermitted = [...usersPermitted, user.user];
          });
        }
      });
    });

    let emailList = [];
    usersPermitted.map((item) => {
      emailList = [...emailList, item.email];
    });
    return emailList;
  }

  public async sendEmailForAdmins() {
    // sent email for admin user permitted
    const usersPermitted = await this.getUserPermittedAds();

    await this.mailerService.sendBulk({
      body: "درخواست ثبت مشاور املاک دریافت شد. برای بررسی درخواست ها به پنل ادمین آقای ساختمان وارد شوید.",
      subject: "اطلاع رسانی - مشاوران املاک",
      to: usersPermitted,
    });
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
