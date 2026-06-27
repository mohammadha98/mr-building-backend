import { Injectable } from "@nestjs/common";
import { ChangeStatusDto } from "./dto/change-status.dto";
import statuses from "src/commons/contracts/Statuses";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import UserPrismaRepository from "src/modules/v2//users/admin/repositories/UserPrismaRepository";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { RemoveDto } from "./dto/remove.dto";
import { CreateForceUpdateDto } from "./dto/create-forceupdate.dto";
import { ClientService } from "src/modules/v2//client/app/client.service";
import InstalledVersionTypes from "src/commons/contracts/InstalledVersionTypes";
import ForceUpdateTypes from "src/commons/contracts/ForceUpdateTypes";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";

@Injectable()
export class ForceUpdateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientService,
    private readonly userPrismaRepository: UserPrismaRepository,
    private readonly fcmNotificationService: FcmNotificationService
  ) {}

  async changeStatus(body: ChangeStatusDto) {
    try {
      const user = await this.userPrismaRepository.findOneByID(
        Number(Number(body.user_id))
      );
      if (!user) {
        return { status: 403 };
      }

      const item = await this.prismaService.forceUpdate.findUnique({
        where: { id: Number(body.item_id) },
      });
      if (!item) {
        return { status: 400, message: "خطا. آیتم موردنظر موجود نمیباشد." };
      }

      await this.prismaService.forceUpdate.update({
        where: {
          id: Number(body.item_id),
        },
        data: { status: body.status },
      });

      return {
        status: 201,
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async findAll(query: PaginationDto) {
    try {
      const user = await this.userPrismaRepository.findOneByID(
        Number(Number(query.user_id))
      );
      if (!user) {
        return { status: 403 };
      }

      const count = await this.prismaService.forceUpdate.count();
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result = await this.prismaService.forceUpdate.findMany({
        orderBy: { id: "desc" },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      });

      const total_clients = await this.prismaService.client.count();

      return {
        status: 200,
        result,
        total_clients,
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

  async storeForceUpdate(body: CreateForceUpdateDto) {
    try {
      const user = await this.userPrismaRepository.findOneByID(
        Number(Number(body.user_id))
      );
      if (!user) {
        return { status: 403 };
      }

      await this.prismaService.forceUpdate.updateMany({
        where: {
          status: statuses.active,
          installed_version_type: body.installed_version_type,
        },
        data: { status: statuses.inactive },
      });

      if (body.file_apk) {
        body.indirect_link = null;
      }

      if (body.installed_version_type !== InstalledVersionTypes.direct) {
        body.file_apk = null;
      }

      const result = await this.prismaService.forceUpdate.create({
        data: {
          installed_version_type: body.installed_version_type, // direct, indirect
          version: body.version,
          required: JSON.parse(body.required as any),
          file_name: body.file_apk, // null, string
          indirect_link: body.indirect_link, // null, string
          title: "",
          content: body.content,
          items: body.items,
          status: statuses.active,
          user_id: Number(body.user_id),
        },
        select: {
          id: true,
          required: true,
          installed_version_type: true,
          version: true,
          file_name: true,
          indirect_link: true,
          total_installs: true,
          status: true,
          content: true,
          items: true,
        },
      });

      await this.fcmNotificationService.sendToTopic({
        body: JSON.stringify({ source: "force_update" }),
        title: "نسخه جدید رسید",
        key: "force_update",
        topic: "force_update",
      });

      if (!body.installed_version_type) {
        body.installed_version_type = InstalledVersionTypes.direct;
      }

      await this.clientService.activateUpdates(body.installed_version_type);
      const total_clients = await this.prismaService.client.count();
      return {
        status: 200,
        result,
        total_clients,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async remove(body: RemoveDto) {
    try {
      const user = await this.userPrismaRepository.findOneByID(
        Number(Number(body.user_id))
      );
      if (!user) {
        return { status: 403 };
      }

      const item = await this.prismaService.forceUpdate.findUnique({
        where: { id: Number(body.item_id) },
      });

      if (!item) {
        return { status: 400, message: "خطا. آیتم موردنظر موجود نمیباشد." };
      }
      const condition = this.makeUpdateCondition(item.installed_version_type);

      if (item.status === statuses.active) {
        await this.prismaService.client.updateMany({
          where: condition.where,
          data: condition.data,
        });
      }

      await this.removeFileFromStorage(
        item.file_name,
        "./../../../../public/contents/force_updates/"
      );

      await this.prismaService.forceUpdate.delete({
        where: {
          id: Number(body.item_id),
        },
      });

      return {
        status: 201,
      };
    } catch (error) {
      console.log(error);

      return { status: 500 };
    }
  }

  private makeUpdateCondition(installed_version_type: string) {
    const forceUpdateCondition = {
      direct: {
        where: { has_update_direct: true },
        data: { has_update_direct: false },
      },
      cafebazar: {
        where: { has_update_cafebazar: true },
        data: { has_update_cafebazar: false },
      },
      myket: {
        where: { has_update_myket: true },
        data: { has_update_myket: false },
      },
      google_play: {
        where: { has_update_google_play: true },
        data: { has_update_google_play: false },
      },
    };

    const condition = {
      where: {},
      data: {},
    };
    if (installed_version_type === ForceUpdateTypes.direct) {
      condition.where = forceUpdateCondition.direct.where;
      condition.data = forceUpdateCondition.direct.data;
    } else if (installed_version_type === ForceUpdateTypes.cafebazar) {
      condition.where = forceUpdateCondition.cafebazar.where;
      condition.data = forceUpdateCondition.cafebazar.data;
    } else if (installed_version_type === ForceUpdateTypes.myket) {
      condition.where = forceUpdateCondition.myket.where;
      condition.data = forceUpdateCondition.myket.data;
    } else if (installed_version_type === ForceUpdateTypes.google_play) {
      condition.where = forceUpdateCondition.google_play.where;
      condition.data = forceUpdateCondition.google_play.data;
    }

    return condition;
  }

  async removeFileFromStorage(file_name: string, destination: string) {
    try {
      if (existsSync(join(__dirname, destination, file_name))) {
        unlinkSync(join(__dirname, destination, file_name));
        return true;
      }
      return false;
    } catch (error) {
      return false;
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
