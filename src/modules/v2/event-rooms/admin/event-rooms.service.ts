import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import statuses from "src/commons/contracts/Statuses";
import EventService from "src/modules/v2//webinar/provider/EventService";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import SmsTemplates from "src/commons/contracts/Templates";

@Injectable()
export class EventRoomsService {
  private readonly eventService: EventService;
  private readonly smsService: SmsService;
  constructor(private prisma: PrismaService) {
    this.eventService = new EventService();
    this.smsService = new SmsService();
  }

  // لیست وبینارها
  async findAllMyOwnWebinars(query: PaginationDto) {
    try {
      const client_info = await this.prisma.users.findUnique({
        where: { id: query.user_id },
      });
      if (!client_info) {
        return { status: 403 };
      }

      const count = await this.prisma.eventRooms.count({});

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const list = await this.prisma.eventRooms.findMany({
        take: paginationValue.per_page,
        skip: paginationValue.offset,
        orderBy: { created_at: "desc" },
      });

      return {
        status: 200,
        client_info,
        list,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  // دریافت وبینارهای ثبت شده توسط کاربر
  async findInvitedWebinars(room_id: number) {
    const users = await this.prisma.eventRoomUsers.findMany({
      where: { event_room_id: Number(room_id) },
    });
    return users;
  }

  // حذف وبینار
  // حذف وبینار از پرووایدر
  async deleteRoom(data: DeleteEventRoomDto) {
    try {
      const dashboard_user = await this.prisma.users.findUnique({
        where: { id: data.user_id },
      });
      if (!dashboard_user) {
        return { status: 403 };
      }
      const event = await this.prisma.eventRooms.findFirst({
        where: { id: Number(data.room_id) },
      });
      if (event) {
        // delete webinar in provider
        await this.eventService.deleteWebinar(event.webinar_id);

        // delte guests in webinar
        await this.prisma.guest.deleteMany({
          where: {
            webinar_id: Number(data.room_id),
          },
        });

        // delete webinar
        await this.prisma.eventRooms.delete({
          where: {
            id: Number(data.room_id),
          },
        });

        return { status: 200 };
      } else {
        return { status: 400 };
      }
    } catch (error) {
      return { status: 500 };
    }
  }

  // غیرفعال کردن وبینار
  // حذف وبینار از پرووایدر
  async webinarStatusInactived(data: DeleteEventRoomDto) {
    try {
      const event = await this.prisma.eventRooms.findFirst({
        where: { id: Number(data.room_id), owner_id: Number(data.user_id) },
      });
      if (event) {
        // delete webinar in provider db
        await this.eventService.deleteWebinar(event.webinar_id);

        // delete webinar
        await this.prisma.eventRooms.update({
          where: {
            id: Number(data.room_id),
          },
          data: { status: statuses.inactive },
        });

        return { status: 200 };
      } else {
        return { status: 403 };
      }
    } catch (error) {
      return { status: 500 };
    }
  }

  // send username and password for client with sms
  private async sendLoginInfo(
    phone: string,
    username: string,
    password: string
  ) {
    try {
      console.log("*** Send Login Info With SMS ***");
      console.log("");
      await this.smsService.send({
        recipient: phone,
        message: username + "\n" + "کلمه عبور:" + "\n" + password,
        parameterKey: "LOGININFO",
        templateID: Number(SmsTemplates.loginInfo),
      });
    } catch (error) {
      console.log("Error Send Client login webinar");
      console.log(error);
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
