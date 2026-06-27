import { Injectable, Inject } from "@nestjs/common";
import { CreateRealEstateAgentsAdminDto } from "./dto/create-real-estate-agents-admin.dto";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v1/client/app/client.service";
import UserTypes from "src/commons/contracts/UserTypes";
import { GetRealEstateAgentsAdminsDto } from "./dto/get-real-estate-agents-admins.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { ChangeStatusRealEstateAdminsAdminsDto } from "./dto/change-status-real-estate-agents-admins.dto";
import { DeleteRealEstateAgentsAdminsDto } from "./dto/delete-real-estate-agents-admin.dto";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import RealEstateAdminTransformer from "./Transformer";
import { UpdateAdminPermissionsDto } from "./dto/update-admin-permisions";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import SmsTemplates from "src/commons/contracts/Templates";

@Injectable()
export class RealEstateAgentsAdminsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly realEstateAdminTransformer: RealEstateAdminTransformer,
    private readonly clientService: ClientService,
    private smsService: SmsService
  ) {}

  async validate(body: ValidateRealEstateAgentsAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }
      const user = await this.clientService.findOne(body.phone);

      if (!user) {
        return { status: 200, result: "not_found", user: null };
      }
      const userTransform = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
      };

      if (user.roles.includes(UserTypes.admin)) {
        return { status: 200, result: "busy", user: userTransform };
      } else if (user.roles.includes(UserTypes.estate_agent)) {
        return { status: 200, result: "estate_agent", user: userTransform };
      } else if (user.roles.includes(UserTypes.advisor)) {
        return { status: 200, result: "advisor", user: userTransform };
      } else if (user.roles.includes(UserTypes.operator_estate_agent)) {
        return {
          status: 200,
          result: UserTypes.operator_estate_agent,
          user: userTransform,
        };
      }
      return { status: 200, result: "free", user: userTransform };
    } catch (error) {
      return { status: 500 };
    }
  }

  async create(body: CreateRealEstateAgentsAdminDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }
      const user = await this.clientService.findOne(body.phone);
      if (!user) {
        return { status: 200, result: "not_found" };
      }

      const userTransform = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
      };
      console.log(body.permissions);

      if (user.roles.includes(UserTypes.advisor)) {
        return { status: 200, result: "busy", admin: userTransform };
      } else if (user.roles.includes(UserTypes.estate_agent)) {
        return { status: 200, result: "estate_agent", admin: userTransform };
      }

      const validateAdmin =
        await this.prismaService.realEstateAgentAdmins.findFirst({
          where: { client_id: Number(user.id) },
        });

      if (!validateAdmin) {
        const admin = await this.prismaService.realEstateAgentAdmins.create({
          data: {
            real_estate_agent: { connect: { id: Number(body.agent_id) } },
            client: { connect: { id: user.id } },
            color: body.color,
            permissions: body.permissions,
          },
          select: {
            id: true,
            permissions: true,
            color: true,
            client: {
              select: { id: true, name: true, surname: true, phone: true },
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

        await this.clientService.addRole(Number(user.id), UserTypes.advisor);
        const transform = this.realEstateAdminTransformer.transform(admin);

        const channelInfo =
          await this.prismaService.channelRealEstateAgent.findUnique({
            where: { id: Number(body.agent_id) },
          });

        // send verify code
        const agentInfo = await this.prismaService.realEstateAgents.findFirst({
          where: { id: Number(body.agent_id) },
        });
        await this.smsService.send({
          message: agentInfo.name,
          templateID: Number(SmsTemplates.verify_real_estate_advisor),
          recipient: body.phone,
          parameterKey: "text",
        });

        await this.prismaService.channelRealEstateMembers.deleteMany({
          where: { channel_id: Number(body.agent_id), client_id: user.id },
        });

        return { status: 201, result: "created", transform };
      }
      return { status: 200, result: "busy", admin: userTransform };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findAll(query: GetRealEstateAgentsAdminsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(query.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const agentInfo = await this.prismaService.realEstateAgents.findUnique({
        where: { id: Number(query.agent_id) },
      });
      if (!agentInfo) {
        return { status: 400 };
      }

      let transformer;
      const resourceKey = this.generateRedisKey(query);
      const admins: any = await this.cacheManager.get(resourceKey);
      if (!admins) {
        const result = await this.prismaService.realEstateAgentAdmins.findMany({
          where: { agent_id: Number(query.agent_id) },
          orderBy: { id: "desc" },
          select: {
            id: true,
            permissions: true,
            color: true,
            client: {
              select: { id: true, name: true, surname: true, phone: true },
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

        if (result.length > 0) {
          await this.cacheManager.set(resourceKey, result);
        }

        transformer = this.realEstateAdminTransformer.collection(result);
      } else {
        transformer = this.realEstateAdminTransformer.collection(admins);
      }

      return {
        status: 200,
        admins: transformer,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async changeStatus(body: ChangeStatusRealEstateAdminsAdminsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
        where: { id: Number(body.admin_id) },
      });
      if (!admin) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAgentAdmins.update({
        where: { id: Number(body.admin_id) },
        data: { status: body.status },
      });
      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async updatePermissions(body: UpdateAdminPermissionsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
        where: { id: Number(body.admin_id) },
      });
      if (!admin) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAgentAdmins.update({
        where: { id: Number(body.admin_id) },
        data: { permissions: body.permissions },
      });

      // update admin in cache DB
      const resourceKey = this.generateRedisKey({ agent_id: admin.agent_id });
      const adminsInCacheDB = (await this.cacheManager.get(resourceKey)) as any;

      if (adminsInCacheDB && adminsInCacheDB.length > 0) {
        const result = adminsInCacheDB.map((admin: any) => {
          if (admin.id === Number(body.admin_id)) {
            admin.permissions = body.permissions;
          }
          return admin;
        });

        await this.cacheManager.set(resourceKey, result);
      } else {
        const result = await this.prismaService.realEstateAgentAdmins.findMany({
          where: { agent_id: Number(body.agent_id) },
          orderBy: { id: "desc" },
          select: {
            id: true,
            permissions: true,
            color: true,
            client: {
              select: { id: true, name: true, surname: true, phone: true },
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
        await this.cacheManager.set(resourceKey, result);
      }

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async removeAdmin(body: DeleteRealEstateAgentsAdminsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
        where: {
          id: Number(body.admin_id),
          agent_id: Number(body.agent_id),
        },
        select: {
          id: true,
          client_id: true,
          agent_id: true,
        },
      });
      if (!admin) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAgentAdmins.delete({
        where: {
          id: Number(body.admin_id),
        },
      });

      // remove Admin role for client
      await this.clientService.removeRole(admin.client_id, UserTypes.admin);

      // update admin in cache DB
      const resourceKey = this.generateRedisKey({ agent_id: admin.agent_id });
      const adminsInCacheDB = (await this.cacheManager.get(resourceKey)) as any;

      if (adminsInCacheDB && adminsInCacheDB.length > 0) {
        const result = adminsInCacheDB.filter(
          (admin: any) => admin.id !== Number(body.admin_id)
        );

        if (result.length > 0) {
          await this.cacheManager.set(resourceKey, result);
        } else {
          await this.cacheManager.del(resourceKey);
        }
      }

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
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

  private generateRedisKey(query: any) {
    const resourceKey = `get_real_estate_agents_admins_agentId_${query.agent_id}`;

    // TODO: log for caching ads
    console.log("* resourceKey *");
    console.log(resourceKey);
    return resourceKey;
  }
}
