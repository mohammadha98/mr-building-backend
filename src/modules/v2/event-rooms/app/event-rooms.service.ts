import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from "@nestjs/common";
 import { CreateEventRoomDto } from "./dto/Create-event-room.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { UpdateEventRoomDto } from "./dto/update-event-room.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import statuses from "src/commons/contracts/Statuses";
import EventService from "src/modules/v2//webinar/provider/EventService";
import { EventRoomPaginationDto } from "./dto/Event-room-pagination.dto";
import SmsTemplates from "src/commons/contracts/Templates";
import { REQUEST } from "@nestjs/core";
import { Request, Response } from "express";
import { NotFoundMessage } from "src/commons/enums/messages";
import EventRoomsTransformer from "./Transformer";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Injectable({ scope: Scope.REQUEST })
export class EventRoomsService {
  private readonly eventService: EventService;
  private readonly smsService: SmsService;
  constructor(
    @Inject(REQUEST) private request: Request,
    private prisma: PrismaService,
    private readonly roomTransformer: EventRoomsTransformer
  ) {
    this.eventService = new EventService();
    this.smsService = new SmsService();
  }

  // دریافت وبینارهای ثبت شده توسط کاربر
  async findAllMyOwnWebinars() {
    const client_id = this.request.client.id;
    const weninars = await this.prisma.eventRooms.findMany({
      where: { owner_id: client_id },
    });

    const roomTransformer = this.roomTransformer.collection(
      weninars as any,
      client_id
    );

    return {
      statusCode: 200,
      message: "لیست اتاقهای کاربر در دسترس است.",
      data: roomTransformer,
    };
  }

  // دریافت اتاق های کاربر
  async findAllMyRooms(query: EventRoomPaginationDto) {
    const client = this.request.client;

    const count = await this.prisma.eventRooms.count({
      where: {
        // owner_id: query.client_id,
        clients: { some: { id: client.id } },
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

    const rooms = await this.prisma.eventRooms.findMany({
      where: {
        // owner_id: query.client_id,
        clients: { some: { id: client.id } },
      },
      orderBy: { created_at: "desc" },
      take: Number(paginationValue.per_page),
      skip: Number(paginationValue.offset),
    });

    const roomTransformer = this.roomTransformer.collection(rooms, client);

    return {
      statusCode: 200,
      message: "لیست اتاقهای کاربر در دسترس است.",
      data: {
        data: roomTransformer,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      },
    };
  }

  // دریافت وبینارهای ثبت شده توسط کاربر
  async findInvitedWebinars(room_id: number) {
    const users = await this.prisma.eventRoomUsers.findMany({
      where: { event_room_id: Number(room_id) },
    });

    const roomTransformer = this.roomTransformer.guestCollection(users);
    return {
      statusCode: 200,
      message: "لیست کاربران دعوت شده به اتاق در دسترس است.",
      data: roomTransformer,
    };
  }

  // حذف وبینار
  // حذف وبینار از پرووایدر
  async deleteWebinar(data: DeleteEventRoomDto) {
    const client_id = this.request.client.id;

    const event = await this.prisma.eventRooms.findFirst({
      where: { id: Number(data.room_id), owner_id: client_id },
    });
    if (event) {
      // delete webinar in provider db
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

      return {
        statusCode: 200,
        message: "اتاق موردنظر با موفقیت حذف شد.",
        data: {},
      };
    } else {
      throw new BadRequestException(NotFoundMessage.NotFoundData);
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

  // ویرایش وبینار
  // ویرایش وبینار از پرووایدر
  async updateWebinar(eventInfo: UpdateEventRoomDto) {
    const client = this.request.client;

    const event = await this.prisma.eventRooms.findFirst({
      where: {
        id: Number(eventInfo.event_room_id),
      },
    });
    if (event) {
      const slug = this.generateSlug();
      eventInfo.slug = slug;
      eventInfo.webinar_provider_id = event.webinar_id;
      // update webinar in provider db
      eventInfo.guest_access = 0;
      eventInfo.guest_count = 0;
      const response = (await this.eventService.updateWebinar(
        eventInfo
      )) as any;

      if (response.status === 200) {
        // update webinar in db
        const updatedWebinar = await this.prisma.eventRooms.update({
          where: {
            id: Number(eventInfo.event_room_id),
          },
          data: {
            owner_id: eventInfo.user_id,
            title: eventInfo.title,
            event_link: response.data.event.alocom_link,
            type: eventInfo.type,
            tag: eventInfo.tag,
            guest_count: Number(eventInfo.guest_count),
          },
        });

        const transformer = this.roomTransformer.transform(
          updatedWebinar,
          client
        );

        return {
          statusCode: 200,
          message: "اتاق موردنظر با موفقیت حذف شد.",
          data: transformer,
        };
      }
      throw new InternalServerErrorException(
        "خطا در ایجاد اتاق. کمی بعد تلاش کنید."
      );
    } else {
      throw new BadRequestException("خطا در ایجاد اتاق. کمی بعد تلاش کنید.");
    }
  }

  // ثبت وبینار جدید
  async store(createEventRoomDto: CreateEventRoomDto) {
    console.log({ createEventRoomDto });
    const client = this.request.client;

    // generate slug ti webinar
    const slug = this.generateSlug();
    createEventRoomDto.slug = slug;

    // create new webinar in alocom
    createEventRoomDto.guest_access = 0;
    const eventInfo = await this.createNewWebinarInProvider(createEventRoomDto);

    if (eventInfo) {
      const users = {
        users: [{ userid: client.webinar_provider_id, role: "teacher" }],
      };

      // add user to webinar- role:  teacher, assistant, participant
      await this.addUserToEvent_teacherRole(eventInfo.id, users);
      // save new webinar in DB
      const event = await this.prisma.eventRooms.create({
        data: {
          owner_id: client.id,
          webinar_id: eventInfo.id,
          event_link: eventInfo.alocom_link,
          title: createEventRoomDto.title,
          type: createEventRoomDto.type,
          tag: createEventRoomDto.tag,
          guest_count: Number(0),
          // owner: {
          //   connect: {
          //     id: createEventRoomDto.user_id,
          //   },
          // },
        },
        include: { guests: true },
      });

      const transformer = this.roomTransformer.transform(event, client);
      return {
        statusCode: 200,
        message: "اتاق جدید با موفقیت ایجاد شد.",
        data: transformer,
      };
    }

    throw new BadRequestException("خطا در ایجاد اتاق.کمی بعد تلاش کنید");
  }

  async createNewWebinarInProvider(CreateWebinarDto) {
    return await this.eventService.createNewEvent(CreateWebinarDto);
  }

  // add user to event whit teacher role
  async addUserToEvent_teacherRole(event_id: number, users: any) {
    return await this.eventService.addUsersToEvent(event_id, users);
  }

  async inviteContactToEventRoom(
    inviteContactDto: InviteContactDto,
    res: Response
  ) {
    const client_id = this.request.client.id;

    // TODO test log
    console.log("*** inviteContactToEventRoom ***");
    console.log(inviteContactDto);

    const event = await this.prisma.eventRooms.findFirst({
      where: {
        id: Number(inviteContactDto.room_id),
        owner_id: client_id,
      },
    });

    if (event) {
      const contacts = inviteContactDto.contacts;

      // delete old guest
      await this.prisma.eventRoomUsers.deleteMany({
        where: { event_room_id: inviteContactDto.room_id },
      });

      const recipients: any[] = [];
      const users = await Promise.all(
        contacts.map(async (contact) => {
          // connect client to webinar
          /*
            const gusetInfo = await this.prisma.client.update({
              where: { id: contact.client_id },
              data: {
                event_rooms: {
                  connect: { id: inviteContactDto.room_id },
                },
              },
              select: {
                phone: true,
                username: true,
                password: true,
                name: true,
                surname: true,
              },
            });
            */
          const gusetInfo = await this.prisma.client.findUnique({
            where: { id: contact.client_id },
            select: {
              id: true,
              phone: true,
              username: true,
              password: true,
              name: true,
              surname: true,
            },
          });
          recipients.push({
            phone: gusetInfo.phone,
            username: gusetInfo.username,
            password: gusetInfo.password,
          });

          // connect client_id to eventRoom relation
          await this.prisma.eventRooms.update({
            where: { id: Number(inviteContactDto.room_id) },
            data: { clients: { connect: { id: Number(contact.client_id) } } },
          });

          // connect client to guest in web
          await this.prisma.eventRoomUsers.create({
            data: {
              client_id: contact.client_id,
              userid: contact.userid,
              display_name: gusetInfo.name + " " + gusetInfo.surname,
              phone: contact.phone,
              role: contact.role,
              event_room_id: Number(inviteContactDto.room_id),
            },
          });

          delete contact.client_id;
          return contact;
        })
      );

      await this.prisma.eventRooms.update({
        where: { id: Number(inviteContactDto.room_id) },
        data: {
          guest_count: users.length,
        },
      });

      // send Bulk sms for contacts
      this.sendSmsIntoContacts(recipients);

      this.eventService.addUsersToEvent(event.webinar_id, { users });

      res.status(HttpStatus.OK);
      return res.json({
        statusCode: HttpStatus.OK,
        message: "مخاطبین شما به اتاق اضافه شدند.",
        data: {},
      });
    } else {
      throw new BadRequestException("خطا در ایجاد اتاق.کمی بعد تلاش کنید");
    }
  }

  private generateSlug(): string {
    return (
      new Date().getTime().toString() +
      Math.floor(Math.random() * (999999 - 111111 + 1) + 111111)
    );
  }

  // send username and password for client with sms
  private async sendSmsIntoContacts(contacts: any[]) {
    try {
      console.log("*** Send Login Info With SMS ***");
      contacts.map((contact: any) => {
        this.smsService.send({
          recipient: contact.phone,
          message:
            contact.username + "\n" + "کلمه عبور:" + "\n" + contact.password,
          parameterKey: "LOGININFO",
          templateID: Number(SmsTemplates.loginInfo),
        });
      });
    } catch (error) {
      console.log("Error Send Login Info for contacts in event room");
      console.log(error);
    }
  }

  async findOneByID(item_id: number) {
    return await this.prisma.eventRooms.findFirst({
      where: { id: Number(item_id) },
      select: { id: true, title: true },
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
