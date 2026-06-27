import {
  Injectable,
  Inject,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";
import {
  CreateRealEstateAgentsAdvisorDto,
  UpdatePermissionsForAdvisorDto,
} from "./dto/create-real-estate-agents-advisor.dto";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import UserTypes from "src/commons/contracts/UserTypes";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import statuses from "src/commons/contracts/Statuses";
import { ChangeStatusRealEstateAgentsAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import { DeleteRealEstateAgentsAdvisorsDto } from "./dto/delete-real-estate-agents-advisors.dto";
import RealEstateAdSellerTypes from "src/commons/contracts/RealEstateAdSellerTypes";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import RealEstateAdvisorTransformer from "./Transformer";
import { CreateActiveAreaAdvisorDto } from "./dto/create-active-area-advisor.dto";
import { DeleteActiveAreaAdvisorDto } from "./dto/delete-active-area-advisor.dto";
import { GetActiveAreasAdvisorDto } from "./dto/get-active-areas-advisor.dto";
import { DeleteFilteredWordAdvisorDto } from "./dto/delete-filtered-word-advisor.dto";
import { CreateAdvisorCommentDto } from "./dto/create-advisor-comment.dto";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
import { SaveAdvisorSettingDto } from "./dto/save-advisor-settings..dto";
import { UpdateAdvisorProfileDto } from "./dto/update-profile.dto";
import SmsTemplates from "src/commons/contracts/Templates";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import ClientRoles from "src/commons/contracts/ClientRoles";
import { PublicMessage } from "src/commons/enums/messages";
import { DeleteCommentDto } from "../../real-estate-agents-comments/app/dto/update-real-estate-agents-comment.dto";

@Injectable()
export class RealEstateAgentsAdvisorsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly realEstateAdvisorTransformer: RealEstateAdvisorTransformer,
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

      if (user.roles.includes(UserTypes.advisor)) {
        return { status: 200, result: "busy", user: userTransform };
      } else if (user.roles.includes(UserTypes.estate_agent)) {
        return { status: 200, result: "estate_agent", user: userTransform };
      } else if (user.roles.includes(UserTypes.admin)) {
        return { status: 200, result: "admin", user: userTransform };
      } else if (user.roles.includes(ClientRoles.operator_estate_agent)) {
        return {
          status: 200,
          result: ClientRoles.operator_estate_agent,
          user: userTransform,
        };
      }

      return { status: 200, result: "free", user: userTransform };
    } catch (error) {
      return { status: 500 };
    }
  }

  async storeActiveArea(body: CreateActiveAreaAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst(
        { where: { id: Number(body.advisor_id) } }
      );
      if (!advisorInfo) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdvisorsActiveAreas.create({
        data: {
          title: body.title,
          advisor: {
            connect: { id: advisorInfo.id },
          },
        },
      });

      const activeAreas =
        await this.prismaService.realEstateAdvisorsActiveAreas.findMany({
          where: { advisor_id: advisorInfo.id },
          select: {
            id: true,
            title: true,
          },
          orderBy: { id: "desc" },
        });

      return { status: 201, active_areas: activeAreas };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async storeFilteredWord(body: CreateActiveAreaAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst(
        { where: { id: Number(body.advisor_id) } }
      );
      if (!advisorInfo) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdvisorsFilteredWords.create({
        data: {
          title: body.title,
          advisor: {
            connect: { id: advisorInfo.id },
          },
        },
      });

      const filteredWords =
        await this.prismaService.realEstateAdvisorsFilteredWords.findMany({
          where: { advisor_id: advisorInfo.id },
          select: {
            id: true,
            title: true,
          },
          orderBy: { id: "desc" },
        });

      return { status: 201, filtered_words: filteredWords };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async removeActiveArea(body: DeleteActiveAreaAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );

      if (!client) {
        return { status: 403 };
      }

      await this.prismaService.realEstateAdvisorsActiveAreas.delete({
        where: {
          id: Number(body.active_area_id),
        },
      });

      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async removeFilteredWord(body: DeleteFilteredWordAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );

      if (!client) {
        return { status: 403 };
      }

      await this.prismaService.realEstateAdvisorsFilteredWords.delete({
        where: {
          id: Number(body.item_id),
        },
      });

      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async getActiveAreas(query: GetActiveAreasAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(query.client_id)
      );

      if (!client) {
        return { status: 403 };
      }

      const adviserInfo =
        await this.prismaService.realEstateAdvisors.findUnique({
          where: { id: Number(query.advisor_id) },
        });
      if (!adviserInfo) {
        return { status: 400 };
      }

      const result =
        await this.prismaService.realEstateAdvisorsActiveAreas.findMany({
          where: { advisor_id: Number(query.advisor_id) },
          orderBy: { id: "desc" },
        });

      return { status: 200, result };
    } catch (error) {
      return { status: 500 };
    }
  }

  async getFilteredWords(query: GetActiveAreasAdvisorDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(query.client_id)
      );

      if (!client) {
        return { status: 403 };
      }

      const adviserInfo =
        await this.prismaService.realEstateAdvisors.findUnique({
          where: { id: Number(query.advisor_id) },
        });
      if (!adviserInfo) {
        return { status: 400 };
      }

      const result =
        await this.prismaService.realEstateAdvisorsFilteredWords.findMany({
          where: { advisor_id: Number(query.advisor_id) },
          orderBy: { id: "desc" },
        });

      return { status: 200, result };
    } catch (error) {
      return { status: 500 };
    }
  }

  async create(body: CreateRealEstateAgentsAdvisorDto) {
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

      if (user.roles.includes(UserTypes.advisor)) {
        return { status: 200, result: "busy" };
      } else if (user.roles.includes(UserTypes.estate_agent)) {
        return { status: 200, result: "estate_agent" };
      }

      const validateAdvisor =
        await this.prismaService.realEstateAdvisors.findFirst({
          where: { client_id: Number(user.id) },
        });

      if (!validateAdvisor) {
        const advisor = await this.prismaService.realEstateAdvisors.create({
          data: {
            phone: body.phone,
            real_estate_agent: { connect: { id: Number(body.agent_id) } },
            client: { connect: { id: user.id } },
            permissions: body.permissions,
          },
          select: { id: true },
        });

        await this.clientService.addRole(Number(user.id), UserTypes.advisor);

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

        return { status: 201, result: "created", advisor };
      }
      return { status: 200, result: "busy" };
    } catch (error) {
      return { status: 500 };
    }
  }

  async updatePermissions(body: UpdatePermissionsForAdvisorDto) {
    const validateAdvisor =
      await this.prismaService.realEstateAdvisors.findFirst({
        where: { id: body.advisor_id },
      });

    if (!validateAdvisor) {
      throw new BadRequestException("خطا. کارشناس موردنظر یافت نشد.");
    }
    await this.prismaService.realEstateAdvisors.update({
      where: { id: Number(body.advisor_id) },
      data: {
        permissions: body.permissions,
      },
    });
    return { statusCode: 200, message: PublicMessage.OkResponse };
  }

  async findAll(query: GetRealEstateAgentsAdvisorsDto) {
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

      let condition: any = {};
      if (query.status === statuses.active) {
        condition = {
          where: {
            real_estate_agent_id: Number(query.agent_id),
            status: statuses.active,
          },
        };
      } else {
        condition = {
          where: {
            real_estate_agent_id: Number(query.agent_id),
          },
        };
      }

      const resourceKey = this.generateRedisKey(query);
      let advisors: any = await this.cacheManager.get(resourceKey);
      if (!advisors) {
        const result = await this.prismaService.realEstateAdvisors.findMany({
          ...condition,
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
            phone: true,
            color: true,
            permissions: true,
            validate_phone: true,
            client: {
              select: { id: true, name: true, surname: true, phone: true },
            },
            real_estate_agent: {
              select: { id: true, name: true, score: true },
            },
          },
        });

        advisors = this.realEstateAdvisorTransformer.collection(result);
        if (result.length) {
          await this.cacheManager.set(resourceKey, advisors);
        }
      }

      return {
        status: 200,
        advisors,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async changeStatus(body: ChangeStatusRealEstateAgentsAdvisorsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      const advisor = await this.prismaService.realEstateAdvisors.findFirst({
        where: { id: Number(body.advisor_id) },
      });
      if (!advisor) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdvisors.update({
        where: { id: Number(body.advisor_id) },
        data: { status: body.status },
      });
      return { status: 200 };
    } catch (error) {
      return { status: 500 };
    }
  }

  async removeAdvisor(body: DeleteRealEstateAgentsAdvisorsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(body.client_id)
      );
      if (!client) {
        return { status: 403 };
      }

      await this.removeAdvisorInRealEstate(body);

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  public async removeAdvisorInRealEstate(
    body: DeleteRealEstateAgentsAdvisorsDto
  ) {
    try {
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
        return { status: 400 };
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

      const realEstateTrackingCode = advisor.real_estate_agent.tracking_code;
      return { status: 200, realEstateTrackingCode };
    } catch (e) {
      console.log(e);
      return { status: 500 };
    }
  }

  async storeComment(body: CreateAdvisorCommentDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(Number(body.client_id))
      );
      if (!client) {
        return { status: 403 };
      }

      const advisorInfo =
        await this.prismaService.realEstateAdvisors.findUnique({
          where: { id: Number(body.advisor_id) },
        });
      if (!advisorInfo) {
        return { status: 400 };
      }

      const comment_submitted =
        await this.prismaService.realEstateAdvisorsComments.findFirst({
          where: {
            client_id: body.client_id,
            advisor_id: Number(body.advisor_id),
          },
          select: {
            id: true,
            comment: true,
            score: true,
            status: true,
            created_at: true,
            client: { select: { id: true, name: true, surname: true } },
          },
        });
      if (comment_submitted) {
        return { status: 200, result: comment_submitted };
      }

      // filtered comment
      const filteredComment = await this.filteredComment(
        body.comment,
        body.advisor_id
      );

      let is_blocked = false;

      // TODO: log
      console.log("*** store comment for Advisor: filteredComment ***");
      console.log(filteredComment);

      let result = null;
      if (filteredComment.length > 0) {
        is_blocked = true;
      }
      if (!is_blocked) {
        result = await this.prismaService.realEstateAdvisorsComments.create({
          data: {
            real_estate_advisor: { connect: { id: Number(body.advisor_id) } },
            comment: body.comment,
            score: Number(body.score),
            client: { connect: { id: Number(body.client_id) } },
          },
          select: {
            id: true,
            comment: true,
            score: true,
            status: true,
            created_at: true,
            client: { select: { id: true, name: true, surname: true } },
          },
        });
      }

      return { status: 201, result, is_blocked };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async filteredComment(
    comment: string,
    advisor_id: number
  ): Promise<string[]> {
    const words = comment.trim().split(" ");

    const filteredComment: string[] = [];
    await Promise.all(
      words.map(async (word) => {
        const validateWord =
          await this.prismaService.realEstateAdvisorsFilteredWords.findFirst({
            where: {
              title: { contains: word, mode: "insensitive", not: " " },
              advisor_id: Number(advisor_id),
            },
          });

        if (validateWord) {
          filteredComment.push(word);
        }
      })
    );
    return filteredComment;
  }

  async findComments(query: GetAdvisorCommentsDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(Number(query.client_id))
      );
      if (!client) {
        return { status: 403 };
      }

      const advisorInfo =
        await this.prismaService.realEstateAdvisors.findUnique({
          where: { id: Number(query.advisor_id) },
        });
      if (!advisorInfo) {
        return { status: 400 };
      }

      const condition = { where: {} };
      if (query.status !== statuses.all) {
        condition.where = {
          advisor_id: Number(query.advisor_id),
          status: query.status,
          NOT: {
            client_id: Number(query.client_id),
          },
        };
      } else {
        condition.where = { advisor_id: Number(query.advisor_id) };
      }

      const count = await this.prismaService.realEstateAdvisorsComments.count({
        where: condition.where,
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const comment_submitted =
        await this.prismaService.realEstateAdvisorsComments.findFirst({
          where: {
            client_id: query.client_id,
            advisor_id: Number(query.advisor_id),
          },
          select: {
            id: true,
            comment: true,
            score: true,
            created_at: true,
            status: true,
            client: { select: { id: true, name: true, surname: true } },
          },
        });

      const result =
        await this.prismaService.realEstateAdvisorsComments.findMany({
          where: condition.where,
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          orderBy: { id: "desc" },
          select: {
            id: true,
            comment: true,
            score: true,
            created_at: true,
            status: true,
            client: { select: { id: true, name: true, surname: true } },
          },
        });

      return {
        status: 200,
        result,
        statistics: {
          total_comments: count,
          total_score: advisorInfo.score,
        },
        user_comment: comment_submitted,
        comment_submitted: comment_submitted ? true : false,
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

  async deleteCommentForAdvisor(query: DeleteCommentDto) {
    const comment = await this.prismaService.realEstateAgentComments.findFirst({
      where: { id: +query.comment_id },
    });
    if (!comment) {
      throw new BadRequestException();
    }

    await this.prismaService.realEstateAdvisorsComments.deleteMany({
      where: { id: +query.comment_id, advisor_id: +query.item_id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.Deleted,
      data: {},
    };
  }

  async saveSettings(body: SaveAdvisorSettingDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(Number(body.client_id))
      );
      if (!client) {
        return { status: 403 };
      }

      const advisorInfo =
        await this.prismaService.realEstateAdvisors.findUnique({
          where: { id: Number(body.advisor_id) },
        });
      if (!advisorInfo) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdvisors.update({
        where: { id: Number(body.advisor_id) },
        data: {
          comment_visibility: body.comment_visibility,
        },
      });

      return {
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async updateProfile(body: UpdateAdvisorProfileDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(Number(body.client_id))
      );
      if (!client) {
        return { status: 403 };
      }

      const advisorInfo =
        await this.prismaService.realEstateAdvisors.findUnique({
          where: { id: Number(body.advisor_id) },
        });
      if (!advisorInfo) {
        return { status: 400 };
      }

      await this.prismaService.realEstateAdvisors.update({
        where: { id: Number(body.advisor_id) },
        data: {
          biography: body.bio,
        },
      });

      return {
        status: 200,
      };
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
    const resourceKey = `get_real_estate_agents_advisors_status_${query.status}_agentId_${query.agent_id}_clientId_${query.client_id}`;

    // TODO: log for caching ads
    console.log("* resourceKey *");
    console.log(resourceKey);
    return resourceKey;
  }
}
