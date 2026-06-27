import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientService } from "src/modules/v2/client/admin/client.service";
import statuses from "src/commons/contracts/Statuses";
import {
  ListRealEstateAgentDto,
  RealEstateAgentSort,
} from "./dto/list-real-estate-agent.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { RealEstateAgentChangeStatusDto } from "./dto/real-estate-change-change-status.dtop";
import UserTypes from "src/commons/contracts/UserTypes";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import SmsTemplates from "src/commons/contracts/Templates";
import RealEstateAgentsPostgresqlRepository from "../repositories/RealEstateAgentsPostgresqlRepository";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v2/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { ChannelRealEstateService } from "src/modules/v2/channel-real-estate/app/channel-real-estate.service";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdsPostgresqlRepository from "../../real-estate-ads/repositories/RealEstateAdsPostgresqlRepository";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import { GetTypes } from "../../client/admin/dto/client-list.dto";
import { DeleteRealEstateAgentsAdvisorsDto } from "../../real-estate-agents-advisors/app/dto/delete-real-estate-agents-advisors.dto";
import { PublicMessage } from "src/commons/enums/messages";
import { MessengerChannelsService } from "../../messenger_channels/app/messenger-channels.service";
import UploadService from "src/modules/services/UploadService";
import MessengerChannelTypes from "src/commons/contracts/MessengerChannelTypes";

@Injectable()
export class RealEstateAgentsService {
  private readonly smsService: SmsService;
  private readonly uploadService: UploadService;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly realEstateAgentPostgresRepository: RealEstateAgentsPostgresqlRepository,
    private readonly commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository,
    private readonly clientService: ClientService,
    private readonly channelRealEstateService: ChannelRealEstateService,
    private readonly realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository,
    private readonly messengerChannelsService: MessengerChannelsService
  ) {
    this.smsService = new SmsService();
    this.uploadService = new UploadService();
  }

  async listOfRealEstateAgents(query: ListRealEstateAgentDto) {
    console.log("listOfRealEstateAgents");
    console.log(query);
    try {
      let condition = {};
      if (query.type === GetTypes.search) {
        condition = {
          OR: [
            {
              name: {
                contains: query.keyword,
                mode: "insensitive",
              },
            },
            {
              client: {
                name: {
                  contains: query.keyword,
                  mode: "insensitive",
                },
              },
            },
            {
              client: {
                surname: {
                  contains: query.keyword,
                  mode: "insensitive",
                },
              },
            },
            {
              client: {
                phone: {
                  contains: query.keyword,
                  mode: "insensitive",
                },
              },
            },
          ],
        };
      }

      if (query.status === statuses.pending) {
        condition = {
          status: statuses.inactive,
          license_status: statuses.pending,
        };
      } else if (query.status === statuses.active) {
        condition = {
          status: statuses.active,
          license_status: statuses.approved,
        };
      } else if (query.status === statuses.inactive) {
        condition = {
          status: statuses.inactive,
        };
      } else if (query.status === statuses.rejected) {
        condition = {
          status: statuses.inactive,
          license_status: statuses.rejected,
        };
      } else if (query.status === statuses.approved) {
        condition = {
          status: statuses.active,
          license_status: statuses.approved,
        };
      }

      if (query.province_id) {
        condition = {
          ...condition,
          province_id: Number(query.province_id),
        };
      }

      let orderBy = {};
      if (query.sort == RealEstateAgentSort.newest) {
        orderBy = {
          created_at: "desc",
        };
      } else if (query.sort == RealEstateAgentSort.oldest) {
        orderBy = {
          created_at: "asc",
        };
      }

      console.log("condition ", condition);

      const count = await this.realEstateAgentPostgresRepository.count(
        condition
      );
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const list = await this.prismaService.realEstateAgents.findMany({
        where: { ...condition },
        select: {
          id: true,
          name: true,
          avatar: true,
          license: true,
          license_status: true,
          status: true,
          score: true,
          published_count: true,
          client_id: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
          created_at: true,
        },
        orderBy,
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      });

      return {
        status: 200,
        list,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async changeStatus(query: RealEstateAgentChangeStatusDto) {
    try {
      let status = statuses.inactive;
      let license_status = statuses.rejected;

      const estate_agent = await this.realEstateAgentPostgresRepository.findOne(
        {
          id: Number(query.item_id),
        }
      );

      const owner = await this.clientService.findOneByID(
        Number(estate_agent.client_id)
      );

      if (query.status === statuses.approved) {
        // change status: active and license_status: approved
        await this.realEstateAgentPostgresRepository.updateOne(
          { id: Number(query.item_id) },
          { status: statuses.active, license_status: statuses.approved }
        );

        status = statuses.active;
        license_status = statuses.approved;

        // add estate_agent role in clients table for owner
        if (!owner.roles.includes(UserTypes.estate_agent)) {
          await this.clientService.updateOne(
            { id: owner.id },
            { roles: { push: [UserTypes.estate_agent] } }
          );
        }

        // send sms for owner
        await this.smsService.send({
          recipient: owner.phone,
          templateID: Number(SmsTemplates.approved_estate_license),
          parameterKey: "ESTATE_AGENT_NAME",
          message: estate_agent.name,
        });

        console.log("estate_agent.avatar ", estate_agent.avatar);

        await this.createChannelForRealEstate(
          owner.id,
          estate_agent.name,
          estate_agent.avatar
        );
      } else {
        // disable real estate channel in messenger channels
        await this.messengerChannelsService.changeStatusForChannel(
          owner.id,
          statuses.inactive
        );

        // remove estate_agent role in clients table for owner
        // const client_roles = owner.roles;
        // client_roles.splice(owner.roles.indexOf(UserTypes.estate_agent), 1);
        // await this.clientService.updateOne(
        //   { id: owner.id },
        //   { roles: { set: client_roles } },
        // );

        // change status: inactive and license_status: rejected
        await this.realEstateAgentPostgresRepository.updateOne(
          { id: Number(query.item_id) },
          { status: statuses.inactive, license_status: statuses.rejected }
        );
      }

      return { status: 200, client_status: status, license_status };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async createChannelForRealEstate(
    owner_id: number,
    real_estate_name: string,
    real_estat_avatar
  ) {
    const checkExistChannel =
      await this.prismaService.messengerChannels.findFirst({
        where: {
          tag: "real_estate",
          owner_id,
        },
      });

    if (!checkExistChannel) {
      let newAvatar = null;
      if (real_estat_avatar) {
        const channelAvatar = await this.uploadService.copyFile(
          `estate-agents/avatars/${real_estat_avatar}`,
          `temp/files/`,
          real_estat_avatar
        );
        if (channelAvatar) {
          newAvatar = channelAvatar.split("/")[7];
        }
        newAvatar = "";
      }

      // create channel for real estate in messenger channels
      await this.messengerChannelsService.createChannel({
        avatar: newAvatar,
        tag: "real_estate",
        type: MessengerChannelTypes.public,
        client_id: owner_id,
        title: real_estate_name,
        description: real_estate_name,
        channel_id: null,
      });
    }

    await this.messengerChannelsService.changeStatusForChannel(
      owner_id,
      statuses.active
    );
  }

  // TODO: delete after run
  public async CreateChannelForOldRealEstates_test() {
    const realEstates = await this.prismaService.realEstateAgents.findMany();
    await Promise.all(
      realEstates.map(async (item) => {
        await this.createChannelForRealEstate(
          item.client_id,
          item.name,
          item.avatar
        );
      })
    );
  }

  async findOneByID(item_id: number) {
    return await this.prismaService.realEstateAgents.findFirst({
      where: { id: Number(item_id) },
      select: { id: true, name: true },
    });
  }

  async findAds(agent_id: number, query: PaginationDto) {
    try {
      // TODO test log
      console.log("*** RealEstateAgent Ads: Admin ***");
      console.log({ agent_id });

      const count = await this.realEstateAdsPostgresqlRepository.count({
        where: {
          agent_id: Number(agent_id),
          OR: [
            {
              seller_type: RealEstateAdSellerTypes.real_estate_agent,
            },
            {
              seller_type: RealEstateAdSellerTypes.advisor,
            },
          ],
        },
      });

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      let result = await this.realEstateAdsPostgresqlRepository.findMany({
        where: {
          agent_id: Number(agent_id),
          OR: [
            {
              seller_type: RealEstateAdSellerTypes.real_estate_agent,
            },
            {
              seller_type: RealEstateAdSellerTypes.advisor,
            },
          ],
        },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        select: {
          id: true,
          category: { select: { id: true, title: true, type: true } },
          subCategory: { select: { id: true, title: true } },
          title: true,
          status: true,
          province: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          agent_id: true,
          advisor_id: true,
          seller_type: true,
          tracking_code: true,
          sale_price: true,
          deposit_price: true,
          rent_price: true,
          number_of_rooms: true,
          max_capicity: true,
          created_at: true,
          area: true,
          media: {
            where: {
              file_type: RealEstateAdMediaType.image,
              priority: RealEstateAdMediaTypePriorities.primary,
            },
            select: {
              id: true,
              file_name: true,
              file_type: true,
              sort_number: true,
              priority: true,
            },
          },
        },
      });
      if (!result) {
        return { status: 400 };
      }

      result = await Promise.all(
        result.map(async (item: any) => {
          return await this.getAdOwnerInfo(item);
        })
      );

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findAdvisors(agent_id: number) {
    try {
      const agentInfo = await this.prismaService.realEstateAgents.findUnique({
        where: { id: Number(agent_id) },
      });
      if (!agentInfo) {
        return { status: 400 };
      }

      const advisors = await this.prismaService.realEstateAdvisors.findMany({
        where: { real_estate_agent_id: Number(agent_id) },
        orderBy: { id: "desc" },
        select: {
          id: true,
          number_of_ads: true,
          total_customers: true,
          score: true,
          biography: true,
          comment_visibility: true,
          avatar: true,
          status: true,
          permissions: true,
          phone: true,
          validate_phone: true,
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
          real_estate_agent: {
            select: { id: true, name: true, score: true },
          },
        },
      });

      return {
        status: 200,
        advisors,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findAdmins(agent_id: number) {
    try {
      const agentInfo = await this.prismaService.realEstateAgents.findUnique({
        where: { id: Number(agent_id) },
      });
      if (!agentInfo) {
        return { status: 400 };
      }

      const admins = await this.prismaService.realEstateAgentAdmins.findMany({
        where: { agent_id: Number(agent_id) },
        orderBy: { id: "desc" },
        select: {
          id: true,
          permissions: true,
          color: true,
          client: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
              status: true,
            },
          },
          real_estate_agent: {
            select: {
              id: true,
              name: true,
              avatar: true,
              number_of_ads: true,
              score: true,
              province: { select: { name: true } },
            },
          },
        },
      });

      return {
        status: 200,
        admins,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findAllComments(agent_id: number, query: PaginationDto) {
    try {
      const count = await this.commentsPostgresqlRepository.count({
        where: { agent_id: Number(agent_id) },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result = await this.commentsPostgresqlRepository.findMany({
        where: { agent_id: Number(agent_id) },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        select: {
          id: true,
          agent_id: true,
          comment: true,
          score: true,
          status: true,
          created_at: true,
          client: { select: { id: true, name: true, surname: true } },
          real_estate_agent: { select: { id: true, name: true, avatar: true } },
        },
      });

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async makeTrackingCode() {
    console.log("Make trackingCode for realEstateAgents");
    const agents = await this.prismaService.realEstateAgents.findMany({
      where: { tracking_code: null },
    });

    agents.map(async (item) => {
      const tracking_code = await this.generateTrackingCode();

      await this.prismaService.realEstateAgents.update({
        where: { id: item.id },
        data: {
          tracking_code,
        },
      });
    });

    return {
      status: 200,
    };
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

  private async getAdOwnerInfo(ad) {
    const adInfo = ad;
    adInfo.owner_info = null;

    if (ad.seller_type === RealEstateAdSellerTypes.real_estate_agent) {
      const agentInfo = await this.prismaService.realEstateAgents.findFirst({
        where: { id: ad.agent_id },
        select: { name: true, avatar: true },
      });
      adInfo.owner_info = {
        name: agentInfo.name,
        avatar: agentInfo.avatar
          ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${agentInfo.avatar}`
          : "",
      };
    } else if (ad.seller_type === RealEstateAdSellerTypes.advisor) {
      const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst(
        {
          where: { id: ad.advisor_id },
          select: {
            real_estate_agent: { select: { name: true, avatar: true } },
          },
        }
      );
      adInfo.owner_info = {
        name: advisorInfo.real_estate_agent.name,
        avatar: advisorInfo.real_estate_agent.avatar
          ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${advisorInfo.real_estate_agent.avatar}`
          : "",
      };
    }

    return adInfo;
  }

  public async removeAdvisorInRealEstate(
    body: DeleteRealEstateAgentsAdvisorsDto
  ) {
    const advisor = await this.prismaService.realEstateAdvisors.findFirst({
      where: {
        id: Number(body.advisor_id),
        real_estate_agent_id: Number(body.agent_id),
      },
      select: {
        id: true,
        client: { select: { id: true } },
        real_estate_agent: {
          select: {
            id: true,
            client: { select: { id: true } },
            tracking_code: true,
          },
        },
      },
    });
    if (!advisor) {
      throw new BadRequestException();
    }

    // delete all active area
    await this.prismaService.realEstateAdvisorsActiveAreas.deleteMany({
      where: { advisor_id: Number(body.advisor_id) },
    });

    // delete all filtered words
    await this.prismaService.realEstateAdvisorsFilteredWords.deleteMany({
      where: { advisor_id: Number(body.advisor_id) },
    });

    // delete all comments
    await this.prismaService.realEstateAdvisorsComments.deleteMany({
      where: { advisor_id: Number(body.advisor_id) },
    });

    await this.prismaService.realEstateAdvisors.delete({
      where: {
        id: Number(body.advisor_id),
      },
    });

    // remove advisor role for client
    await this.clientService.removeRole(advisor.client.id, UserTypes.advisor);

    // remove advisor_id in all ads
    await this.prismaService.realEstateAds.updateMany({
      where: {
        advisor_id: Number(body.advisor_id),
        seller_type: UserTypes.advisor,
      },
      data: {
        seller_type: RealEstateAdSellerTypes.real_estate_agent,
        advisor_id: 0,
      },
    });

    await this.prismaService.chatRealEstateHistory.updateMany({
      where: { participant_id: advisor.id },
      data: { participant_id: advisor.real_estate_agent.client.id },
    });

    return { statusCode: 200, message: PublicMessage.OkResponse };
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
