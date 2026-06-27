import { Injectable } from "@nestjs/common";
import { CreatePrizeDto } from "./dto/create-mission.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { UsersService } from "src/modules/v1/users/admin/users.service";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "src/modules/v1/missions/admin/dto/change-status-mission.dto";
import UploadService from "src/modules/services/UploadService";
import statuses from "src/commons/contracts/Statuses";

@Injectable()
export class PrizesService {
  private readonly UploadService: UploadService;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService
  ) {
    this.UploadService = new UploadService();
  }

  async create(body: CreatePrizeDto) {
    try {
      const user = await this.userService.validateWithID(body.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      const prizeInfo = await this.prismaService.prizes.findFirst({
        where: { id: Number(body.item_id) },
      });
      let result;

      if (!prizeInfo) {
        result = await this.prismaService.prizes.create({
          data: {
            creator_id: body.user_id,
            title: body.title,
            description: body.description,
            point: Number(body.point),
            thumbnail: body.thumbnail,
            url: body.url,
          },
          select: {
            id: true,
            title: true,
            description: true,
            point: true,
            thumbnail: true,
            status: true,
            created_at: true,
            url: true,
            expired_at: true,
          },
        });

        await this.prismaService.prizeCoupons.createMany({
          data: body.coupons.map((item) => {
            return {
              status: statuses.active,
              coupon: item,
              prizeId: result.id,
            };
          }),
        });
      } else {
        const thumbnail = body.thumbnail ? body.thumbnail : prizeInfo.thumbnail;

        result = await this.prismaService.prizes.update({
          where: { id: Number(body.item_id) },
          data: {
            creator_id: body.user_id,
            title: body.title,
            description: body.description,
            url: body.url,
            point: Number(body.point),
            thumbnail,
          },
          select: {
            id: true,
            title: true,
            description: true,
            point: true,
            thumbnail: true,
            url: true,
            status: true,
            created_at: true,
            expired_at: true,
          },
        });
      }

      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async getPrizes(query: PaginationDto) {
    try {
      const user = await this.userService.validateWithID(query.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      const count = await this.prismaService.prizes.count();
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const prizes = await this.prismaService.prizes.findMany({
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy: { id: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          description: true,
          created_at: true,
          thumbnail: true,
          point: true,
          url: true,
          coupons: {
            select: {
              id: true,
              coupon: true,
              status: true,
            },
          },
          creator_id: true,
          expired_at: true,
        },
      });

      return {
        prizes,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async changeStatus(body: ChangeStatusMissionDto) {
    try {
      const user = await this.userService.validateWithID(body.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      await this.prismaService.prizes.update({
        where: {
          id: Number(body.item_id),
        },
        data: {
          status: body.status,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async deletePrize(body: any) {
    try {
      const user = await this.userService.validateWithID(body.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      const itemInfo = await this.prismaService.prizes.findFirst({
        where: { id: Number(body.item_id) },
      });
      if (itemInfo) {
        await this.prismaService.prizeCoupons.deleteMany({
          where: {
            prizeId: Number(body.item_id),
          },
        });

        await this.prismaService.prizes.deleteMany({
          where: {
            id: Number(body.item_id),
          },
        });

        await this.UploadService.removeFile(itemInfo.thumbnail, "prizes");
      }
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
}
