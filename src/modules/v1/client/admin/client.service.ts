import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import EventService from "src/modules/v1//webinar/provider/EventService";
import { ClientListDto, GetTypes } from "./dto/client-list.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { randomBytes } from "crypto";
import { CreateOperatorRealEstateAgentDto } from "./dto/create-operator-real-estate-agent";
import ClientRoles from "src/commons/contracts/ClientRoles";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import RealEstateAdMediaType from "src/commons/contracts/RealEstateAdMediaType";
import RealEstateAdMediaTypePriorities from "src/commons/contracts/RealEstateAdMediaTypePriorities";
import sortingTypes from "src/commons/contracts/SortingTypes";

@Injectable()
export class ClientService {
  private eventService: EventService;
  private smsService: SmsService;

  constructor(private readonly prisma: PrismaService) {
    this.eventService = new EventService();
    this.smsService = new SmsService();
  }

  async create(phone: string) {
    try {
      const client = await this.prisma.client.create({
        data: {
          phone,
          password: null,
        },
      });

      return client;
    } catch (error) {
      return false;
    }
  }

  async findAll(query: PaginationDto) {
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
            surname: {
              contains: query.keyword,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: query.keyword,
              mode: "insensitive",
            },
          },
        ],
      };
    }

    let orderBy: any = { id: "desc" };
    if (query.sort === sortingTypes.oldest) {
      orderBy = { id: "asc" };
    }
    const count = await this.prisma.client.count({ where: { ...condition } });
    const total = this.getTotalPageNumber(
      Number(count),
      Number(query.per_page)
    );

    const paginationValue = this.makePagination(
      Number(query.page),
      Number(query.per_page)
    );

    const clients = await this.prisma.client.findMany({
      where: { ...condition },
      skip: paginationValue.offset,
      take: paginationValue.per_page,
      orderBy,
    });

    return {
      clients,
      metadata: this.makeMetadata(
        Number(query.page),
        Number(query.per_page),
        Number(total)
      ),
    };
  }

  async getAllReports(body: any) {
    try {
      const user = await this.prisma.client.findUnique({
        where: { id: Number(body.client_id) },
      });
      if (!user) {
        return { status: 403 };
      }
      let conditions = {};
      if (body.type === "all") {
        conditions = {
          client_id: Number(body.client_id),
        };
      } else {
        conditions = {
          client_id: Number(body.client_id),
          type: body.type,
        };
      }
      console.log({ conditions });

      const count = await this.prisma.reportBugs.count({
        where: { ...conditions },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      const list = await this.prisma.reportBugs.findMany({
        where: { ...conditions },
        select: {
          id: true,
          content: true,
          image: true,
          voice: true,
          type: true,
          created_at: true,
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
        },
        orderBy: { id: "desc" },
        take: paginationValue.per_page,
        skip: paginationValue.offset,
      });

      return {
        status: 200,
        list,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async getUserPrizes(query: any) {
    try {
      const client = await this.prisma.client.findFirst({
        where: { id: Number(query.client_id) },
      });
      if (!client) {
        throw new ForbiddenErrorHandler();
      }
      const total_score = client.score;

      const count = await this.prisma.receivePrizes.count({
        where: { clientId: Number(query.client_id) },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const prizes = await this.prisma.receivePrizes.findMany({
        where: { clientId: Number(query.client_id) },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy: { id: "desc" },
      });

      return {
        result: {
          status: 200,
          prizes,
          metadata: this.makeMetadata(
            Number(query.page),
            Number(query.per_page),
            Number(total)
          ),
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async getHistoryOfScores(query: any) {
    try {
      const client = await this.prisma.client.findFirst({
        where: { id: Number(query.client_id) },
      });
      if (!client) {
        throw new ForbiddenErrorHandler();
      }
      const total_score = client.score;

      const count = await this.prisma.historyOfScores.count({
        where: { client_id: Number(query.client_id) },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const history = await this.prisma.historyOfScores.findMany({
        where: { client_id: Number(query.client_id) },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy: { id: "desc" },
      });

      return {
        result: {
          total_score,
          history,
          metadata: this.makeMetadata(
            Number(query.page),
            Number(query.per_page),
            Number(total)
          ),
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async findAds(body: PaginationDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: {
          id: Number(body.user_id),
        },
      });
      if (!client) {
        return { status: 403 };
      }

      // TODO test log
      console.log("*** find Client Ads: ADMIN ***");
      console.log({ body });

      const count = await this.prisma.realEstateAds.count({
        where: { client_id: Number(body.user_id) },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(Number(body.per_page))
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      let result = await this.prisma.realEstateAds.findMany({
        where: { client_id: Number(body.user_id) },
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
            orderBy: { id: "desc" },
          },
        },
      });
      if (!result) {
        return { status: 400 };
      }

      return {
        status: 200,
        result,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getPublicOperators(pagination: ClientListDto) {
    const count = await this.prisma.client.count({
      where: {
        roles: { has: ClientRoles.operator_estate_agent },
      },
    });
    const total = this.getTotalPageNumber(
      Number(count),
      Number(pagination.per_page)
    );

    const paginationValue = this.makePagination(
      Number(pagination.page),
      Number(pagination.per_page)
    );

    const clients = await this.prisma.client.findMany({
      where: {
        roles: { has: ClientRoles.operator_estate_agent },
      },
      skip: paginationValue.offset,
      take: paginationValue.per_page,
      orderBy: { id: "desc" },
    });

    return {
      clients,
      metadata: this.makeMetadata(
        Number(pagination.page),
        Number(pagination.per_page),
        Number(total)
      ),
    };
  }

  async saveNewPublicOperators(body: CreateOperatorRealEstateAgentDto) {
    try {
      let status = 201;

      let client = await this.prisma.client.findFirst({
        where: {
          id: Number(body.client_id),
        },
      });

      const clientRoles = client.roles;
      if (clientRoles.includes(ClientRoles.operator_estate_agent)) {
        status = 200;
      } else if (clientRoles.includes(ClientRoles.estate_agent)) {
        status = 400;
      }

      if (status === 400) {
        return { status: 400 };
      }
      const checkExistOperator =
        await this.prisma.operator_realEstateAgents.findFirst({
          where: {
            client_id: Number(body.client_id),
          },
        });

      if (!checkExistOperator) {
        await this.addRole(
          Number(body.client_id),
          ClientRoles.operator_estate_agent
        );

        await this.prisma.operator_realEstateAgents.create({
          data: {
            client_id: Number(body.client_id),
          },
        });
        status = 201;
      } else {
        status = 200;
        await this.removeRole(
          Number(body.client_id),
          ClientRoles.operator_estate_agent
        );

        await this.prisma.operator_realEstateAgents.deleteMany({
          where: {
            client_id: Number(body.client_id),
          },
        });
      }

      client = await this.prisma.client.findFirst({
        where: {
          id: Number(body.client_id),
        },
      });

      return {
        client,
        status,
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async deletePublicOperator(body: any) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { id: Number(body.user_id) },
      });
      if (!user) {
        return { status: 403 };
      }
      const clients = await this.prisma.client.findFirst({
        where: {
          id: Number(body.client_id),
          roles: { has: ClientRoles.operator_estate_agent },
        },
      });
      if (!clients) {
        return { status: 400 };
      }

      await this.removeRole(
        Number(body.client_id),
        ClientRoles.operator_estate_agent
      );

      await this.prisma.operator_realEstateAgents.deleteMany({
        where: { client_id: Number(body.client_id) },
      });

      return {
        clients,
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async addRole(client_id: number, role: string) {
    await this.prisma.client.update({
      where: { id: client_id },
      data: { roles: { push: [role] } },
    });
  }

  async removeRole(client_id: number, role: string) {
    const clientInfo = await this.prisma.client.findFirst({
      where: { id: Number(client_id) },
    });
    const roles: string[] = clientInfo.roles;

    if (roles.includes(role)) {
      roles.splice(roles.indexOf(role), 1);
    }

    await this.prisma.client.update({
      where: { id: client_id },
      data: { roles },
    });
  }

  async generateKeyForClients(user_id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: Number(user_id) },
    });
    if (!user) {
      return { status: 403 };
    }

    const clients = await this.prisma.client.findMany({});

    await Promise.all(
      clients.map(async (client) => {
        if (client.key === "") {
          const key = await this.generateKey();
          await this.prisma.client.update({
            where: { id: client.id },
            data: { key },
          });
        }
      })
    );
  }

  private async generateKey() {
    const key = randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateChatId = await this.prisma.client.findFirst({
      where: { key },
    });
    if (isDuplicateChatId) {
      await this.generateKey();
    }
    return key;
  }

  async findOne(phone: string) {
    return await this.prisma.client.findFirst({
      where: { phone },
    });
  }

  async findOneByID(client_id: number) {
    console.log("findOneByID");
    return await this.prisma.client.findUnique({
      where: { id: Number(client_id) },
    });
  }

  async updateToken(id: number, token: string) {
    return await this.prisma.client.update({
      where: {
        id: id,
      },
      data: {
        token: token,
      },
    });
  }

  async updateOne(where: any, updatedData: any) {
    return await this.prisma.client.update({
      where,
      data: updatedData,
    });
  }

  // send username and password for client with sms
  private generateCode(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
