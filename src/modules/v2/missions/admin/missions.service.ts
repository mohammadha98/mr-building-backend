import { Injectable } from "@nestjs/common";
import { CreateMissionDto } from "./dto/create-mission.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { UsersService } from "src/modules/v2/users/admin/users.service";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import statuses from "src/commons/contracts/Statuses";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "./dto/change-status-mission.dto";

@Injectable()
export class MissionsAdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService
  ) {}

  async create(body: CreateMissionDto) {
    try {
      const user = await this.userService.validateWithID(body.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      let is_limited = false;
      if (body.is_limited == ("true" as any)) {
        is_limited = true;
      }

      let status = 200;
      let message = "مامورت وارد شده تکراری میباشد.";
      let checkExistMission = (await this.prismaService.missions.findFirst({
        where: {
          key: body.key,
        },
      })) as any;
      if (!checkExistMission) {
        checkExistMission = await this.prismaService.missions.create({
          data: {
            creator_id: body.user_id,
            key: body.key,
            title: body.title,
            description: body.description,
            point: Number(body.point),
            is_limited,
            number_of_hours: Number(body.number_of_hours),
          },
          select: {
            id: true,
            title: true,
            description: true,
            point: true,
            status: true,
            created_at: true,
            number_of_used: true,
            is_limited: true,
            number_of_hours: true,
          },
        });
        status = 201;
        message = "ماموریت جدید با موفقیت ثبت شد.";
      } else {
        checkExistMission = await this.prismaService.missions.update({
          where: {
            id: checkExistMission.id,
          },
          data: {
            creator_id: body.user_id,
            title: body.title,
            description: body.description,
            point: Number(body.point),
            is_limited,
            number_of_hours: Number(body.number_of_hours),
          },
          select: {
            id: true,
            title: true,
            description: true,
            point: true,
            status: true,
            created_at: true,
            number_of_used: true,
            is_limited: true,
            number_of_hours: true,
          },
        });
        status = 200;
        message = "ویرایش ماموریت با موفقیت انجام شد.";
      }

      return {
        retsult: {
          status,
          message,
          data: checkExistMission,
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async updateClientMissions(user_id: number) {
    try {
      const user = await this.userService.validateWithID(Number(user_id));
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      const result = await this.prismaService.missions.findFirst({
        where: { key: "register" },
      });

      const clientList = await this.prismaService.client.findMany();
      const clientIds = clientList.map((item) => item.id);

      const receivedMissionExists =
        await this.prismaService.receiveMissions.findMany();

      const receivedMissionExistsIds = receivedMissionExists.map(
        (item) => item.client_id
      );

      const newClientIds = clientIds.filter(
        (clientId: number) => !receivedMissionExistsIds.includes(clientId)
      );

      await this.prismaService.receiveMissions.createMany({
        data: newClientIds.map((id) => {
          return {
            client_id: Number(id),
            title: result.title,
            description: result.description,
            point: result.point,
            mission_id: result.id,
            received_at: new Date(Date.now()),
          };
        }),
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async getMissions(query: PaginationDto) {
    try {
      const user = await this.userService.validateWithID(query.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      const missions = await this.prismaService.missions.findMany({
        orderBy: { id: "desc" },
      });

      return missions;
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

      const missions = await this.prismaService.missions.update({
        where: {
          id: Number(body.item_id),
        },
        data: {
          status: body.status,
        },
      });

      return missions;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async deleteMission(body: any) {
    try {
      const user = await this.userService.validateWithID(body.user_id);
      if (!user) {
        throw new ForbiddenErrorHandler();
      }

      await this.prismaService.missions.deleteMany({
        where: {
          id: Number(body.item_id),
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }

  async findActivate() {
    try {
      return await this.prismaService.missions.findMany({
        where: { status: statuses.active },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorHandler();
    }
  }
}
