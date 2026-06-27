import { Injectable } from "@nestjs/common";
 import { CreateEventGroupDto } from "./dto/Create-event-group.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { DeleteEventGroupDto } from "./dto/delete-event-groupdto.ts";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import statuses from "src/commons/contracts/Statuses";
import EventService from "src/modules/v1//webinar/provider/EventService";
import { EventGroupPaginationDto } from "./dto/Event-group-pagination.dto";
import SmsTemplates from "src/commons/contracts/Templates";
import { PrismaService } from "../../../../../../prisma/prisma.service";

@Injectable()
export class eventGroupsService {
  private readonly eventService: EventService;
  private readonly smsService: SmsService;
  constructor(private prisma: PrismaService) {
    this.eventService = new EventService();
    this.smsService = new SmsService();
  }

  // دریافت گروههای ثبت شده توسط کاربر
  async findAllMyOwnWebinars(user_id: number) {
    return await this.prisma.eventGroups.findMany({
      where: { owner_id: user_id },
    });
  }

  // دریافت گروه های کاربر
  async findAllGroups(query: EventGroupPaginationDto) {
    const users = await this.prisma.users.findUnique({
      where: { id: Number(query.client_id) },
    });
    if (!users) {
      return { status: 403 };
    }

    const count = await this.prisma.eventGroups.count({});
    const total = this.getTotalPageNumber(
      Number(count),
      Number(query.per_page)
    );
    const paginationValue = this.makePagination(
      Number(query.page),
      Number(query.per_page)
    );

    const groups = await this.prisma.eventGroups.findMany({
      orderBy: { created_at: "desc" },
      take: Number(paginationValue.per_page),
      skip: Number(paginationValue.offset),
    });

    return {
      status: 200,
      groups,
      metadata: this.makeMetadata(
        Number(query.page),
        Number(query.per_page),
        Number(total)
      ),
    };
  }

  // دریافت گروههای ثبت شده توسط کاربر
  async findInvitedWebinars(room_id: number) {
    const users = await this.prisma.eventRoomUsers.findMany({
      where: { event_room_id: Number(room_id) },
    });
    return users;
  }

  // حذف گروه
  // حذف گروه از پرووایدر
  async deleteWebinar(data: DeleteEventGroupDto) {
    try {
      const event = await this.prisma.eventGroups.findFirst({
        where: { id: Number(data.group_id), owner_id: Number(data.user_id) },
      });
      if (event) {
        // delete webinar in provider db
        await this.eventService.deleteWebinar(event.webinar_id);

        // delete webinar
        await this.prisma.eventGroups.delete({
          where: {
            id: Number(data.group_id),
          },
        });

        return { status: 200 };
      } else {
        return { status: 403 };
      }
    } catch (error) {
      return { status: 500 };
    }
  }

  // غیرفعال کردن گروه
  // حذف گروه از پرووایدر
  async webinarStatusInactived(data: DeleteEventGroupDto) {
    try {
      const event = await this.prisma.eventGroups.findFirst({
        where: { id: Number(data.group_id), owner_id: Number(data.user_id) },
      });
      if (event) {
        // delete webinar in provider db
        await this.eventService.deleteWebinar(event.webinar_id);

        // delete webinar
        await this.prisma.eventGroups.update({
          where: {
            id: Number(data.group_id),
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

  // ثبت گروه جدید
  async store(CreateEventGroupDto: CreateEventGroupDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id: CreateEventGroupDto.user_id },
      });

      // generate slug ti webinar
      const slug = this.generateSlug();
      CreateEventGroupDto.slug = slug;

      // create new webinar in alocom
      CreateEventGroupDto.guest_access = 1;
      const eventInfo = await this.createNewWebinarInProvider(
        CreateEventGroupDto
      );

      if (eventInfo) {
        const clientInfo = await this.prisma.client.findUnique({
          where: { id: CreateEventGroupDto.user_id },
        });
        const users = {
          users: [{ userid: clientInfo.webinar_provider_id, role: "teacher" }],
        };

        // add user to webinar- role:  teacher, assistant, participant
        await this.addUserToEvent_teacherRole(eventInfo.id, users);
        // save new webinar in DB
        const event = await this.prisma.eventGroups.create({
          data: {
            owner_id: Number(CreateEventGroupDto.user_id),
            webinar_id: eventInfo.id,
            event_link: eventInfo.alocom_link,
            title: CreateEventGroupDto.title,
            tag: CreateEventGroupDto.tag,
          },
        });

        return { status: 200, event, client };
      }
      return { status: 500 };
    } catch (error) {
      console.log("*** Error Save Webinar ***");
      console.log(error);
      return { status: 500 };
    }
  }

  async createNewWebinarInProvider(CreateWebinarDto) {
    return await this.eventService.createNewEvent(CreateWebinarDto);
  }

  // add user to event whit teacher role
  async addUserToEvent_teacherRole(event_id: number, users: any) {
    return await this.eventService.addUsersToEvent(event_id, users);
  }

  private generateSlug(): string {
    return (
      new Date().getTime().toString() +
      Math.floor(Math.random() * (999999 - 111111 + 1) + 111111)
    );
  }

  public sendLoginInfoWithSMS(client: any) {
    this.smsService.send({
      recipient: client.phone,
      message: client.username + "\n" + "کلمه عبور:" + "\n" + client.password,
      parameterKey: "LOGININFO",
      templateID: Number(SmsTemplates.loginInfo),
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
