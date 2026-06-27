import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { MissionsAdminService } from "src/modules/v2/missions/admin/missions.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import statuses from "src/commons/contracts/Statuses";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { UsePrizeDto } from "./dto/use-prize.dto";

@Injectable()
export class PrizesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService,
    private readonly missionService: MissionsAdminService
  ) {}

  async getMissions(query: PaginationDto) {
    try {
      const client = await this.clientService.validateWithID(query.user_id);
      if (!client) {
        throw new ForbiddenErrorHandler();
      }
      const total_score = client.score;

      const missionList = await this.findActivateMissions();
      const missions = await this.checkMissionsForUser(
        missionList,
        query.user_id
      );

      return {
        result: {
          total_score,
          missions,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  private async checkMissionsForUser(missions: any[], client_id: number) {
    return await Promise.all(
      missions.map(async (item: any) => {
        const presentedMissions = item;

        const date = new Date();
        date.setUTCHours(0, 0, 0, 0);
        presentedMissions.usedAt = null;
        presentedMissions.is_permitted = false;

        if (item.is_limited) {
          const checkDailyMission =
            await this.prismaService.dailyMissionsLogs.findFirst({
              where: {
                clientID: Number(client_id),
                missionType: item.key,
              },
              orderBy: { usedAt: "desc" },
            });

          if (!checkDailyMission) {
            presentedMissions.usedAt = null;
          } else {
            const calculateTimeDifference = this.calculateTimeDifference(
              date,
              checkDailyMission.usedAt
            );

            if (calculateTimeDifference) {
              presentedMissions.usedAt = checkDailyMission.usedAt;
              presentedMissions.is_permitted = true;
            } else {
              presentedMissions.usedAt = checkDailyMission.usedAt;
              presentedMissions.is_permitted = false;
            }
          }
        }

        const receivedMissions =
          await this.prismaService.receiveMissions.findFirst({
            where: { client_id, mission_id: item.id },
          });

        if (!receivedMissions) {
          presentedMissions.mission_done = false;
        } else {
          presentedMissions.mission_done = true;
        }
        return presentedMissions;
      })
    );
  }

  calculateTimeDifference(loginDate: any, lastLoginDate: any) {
    const timeDifference = loginDate.getTime() - lastLoginDate.getTime();
    const twentyFourHoursInSeconds = 24 * 60 * 60; // 86400
    // const twentyFourHoursInSeconds = 60 * 1000;

    return timeDifference > twentyFourHoursInSeconds * 100;
  }

  async getPrizes(query: PaginationDto) {
    try {
      const client = await this.clientService.validateWithID(query.user_id);
      if (!client) {
        throw new ForbiddenErrorHandler();
      }
      const total_score = client.score;

      const count = await this.prismaService.prizes.count();
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const prizes = await this.findActivatePrizes(
        paginationValue.offset,
        paginationValue.per_page
      );

      return {
        result: {
          total_score,
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

  async getHistoryOfScores(query: PaginationDto) {
    try {
      const client = await this.clientService.validateWithID(query.user_id);
      if (!client) {
        throw new ForbiddenErrorHandler();
      }
      const total_score = client.score;

      const count = await this.prismaService.historyOfScores.count({
        where: { client_id: Number(query.user_id) },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const history = await this.prismaService.historyOfScores.findMany({
        where: { client_id: Number(query.user_id) },
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

  async getUserPrizes(query: PaginationDto) {
    try {
      const client = await this.clientService.validateWithID(query.user_id);
      if (!client) {
        throw new ForbiddenErrorHandler();
      }
      const total_score = client.score;

      const count = await this.prismaService.receivePrizes.count({
        where: { clientId: Number(query.user_id) },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const prizes = await this.prismaService.receivePrizes.findMany({
        where: { clientId: Number(query.user_id) },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy: { id: "desc" },
        select: {
          id: true,
          coupon: true,
          point: true,
          thumbnail: true,
          url: true,
          title: true,
          description: true,
        },
      });

      return {
        result: {
          total_score,
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

  async usePrize(body: UsePrizeDto) {
    try {
      const client = await this.clientService.validateWithID(body.client_id);
      if (!client) {
        throw new ForbiddenErrorHandler();
      }

      const validatePrize = await this.prismaService.prizes.findFirst({
        where: { id: Number(body.item_id) },
      });
      if (!validatePrize) {
        return { status: 404 };
      }

      const getValidCoupon = await this.prismaService.prizeCoupons.findFirst({
        where: {
          prizeId: Number(body.item_id),
          status: statuses.active,
        },
      });
      if (!getValidCoupon) {
        return { status: 400 };
      }

      // decrease client score
      const deCreseResult = await this.clientService.deCreaseScore(
        body.client_id,
        validatePrize.point
      );
      if (!deCreseResult) {
        return { status: 409 };
      }

      await this.prismaService.prizeCoupons.update({
        where: {
          id: getValidCoupon.id,
        },
        data: { status: statuses.used, used_at: new Date(Date.now()) },
      });

      const result = await this.prismaService.receivePrizes.create({
        data: {
          client: { connect: { id: Number(body.client_id) } },
          prizeId: Number(body.item_id),
          title: validatePrize.title,
          description: validatePrize.description,
          coupon: getValidCoupon.coupon,
          point: validatePrize.point,
          thumbnail: validatePrize.thumbnail,
          url: validatePrize.url,
          received_at: new Date(Date.now()),
        },
        select: { id: true },
      });

      // save history score
      await this.prismaService.historyOfScores.create({
        data: {
          client: { connect: { id: Number(body.client_id) } },
          title: validatePrize.title,
          score: Number(validatePrize.point),
          type: "prize",
          action: "decrease",
        },
      });

      return {
        id: result.id,
        total_score: deCreseResult,
        coupon: getValidCoupon.coupon,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async findActivateMissions() {
    try {
      return await this.prismaService.missions.findMany({
        where: { status: statuses.active },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async findActivatePrizes(offset: number, per_page: number) {
    try {
      return await this.prismaService.prizes.findMany({
        where: { status: statuses.active },
        skip: offset,
        take: per_page,
        orderBy: { id: "desc" },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
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
