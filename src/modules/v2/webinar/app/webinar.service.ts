import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateWebinarDto } from "./dto/create-webinar.dto";
import EventService from "../provider/EventService";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { SaveProceedingDto } from "./dto/SaveProceedingDto";
import { DeleteWebinarDto } from "./dto/delete-webinar.dto.ts";
import { UpdateWebinarDto } from "./dto/update-webinar.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import { ClientWebinarsDto } from "./dto/ClientWebinarsDto";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import statuses from "src/commons/contracts/Statuses";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import SmsTemplates from "src/commons/contracts/Templates";
import WebinarTransformer from "./Transformer";

import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { EventEmitter } from "events";

@Injectable()
export class WebinarService {
  private readonly eventService: EventService;
  private readonly smsService: SmsService;
  private webinarTransformer: WebinarTransformer;

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.eventService = new EventService();
    this.smsService = new SmsService();
    this.webinarTransformer = new WebinarTransformer();
  }

  // لیست وبینارها
  async findAllMyOwnWebinars(query: PaginationDto) {
    try {
      const client_info = await this.prisma.client.findUnique({
        where: { id: query.user_id },
      });
      if (!client_info) {
        return { status: 403 };
      }

      const count = await this.prisma.webinar.count({
        where: {
          client: { some: { id: Number(query.user_id) } },
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

      const list = await this.prisma.webinar.findMany({
        where: {
          client: { some: { id: Number(query.user_id) } },
        },
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

  // دریافت وبینار های کاربر
  async findAllMyWebinars(query: ClientWebinarsDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: Number(query.client_id) },
    });
    if (!client) {
      return { status: 403 };
    }

    const existingWebinars = await this.prisma.webinar.findMany({
      where: {
        year: Number(query.year),
        // month: Number(query.month),
        client: { some: { id: Number(query.client_id) } },
      },
      orderBy: { id: "asc" },
    });

    const presentedWebinars = {};

    existingWebinars.map((webinar) => {
      const transformer = this.webinarTransformer.transform(webinar, client);
      if (!presentedWebinars[webinar.month]) {
        presentedWebinars[webinar.month] = [transformer];
      } else {
        presentedWebinars[webinar.month] = [
          ...presentedWebinars[webinar.month],
          transformer,
        ];
      }
    });

    return {
      status: 200,
      data: {
        presentedWebinars,
        client,
      },
    };
  }

  // دریافت وبینارهای ثبت شده توسط کاربر
  async findInvitedWebinars(webinar_id: number) {
    const users = await this.prisma.guest.findMany({
      where: { webinar_id: Number(webinar_id) },
    });
    return users;
  }

  // ثبت صورتجلسه برای وبینار
  async saveProceeding(data: SaveProceedingDto) {
    try {
      return await this.prisma.webinar.update({
        where: { id: Number(data.webinar_id) },
        data: {
          proceeding: data.content,
        },
      });
    } catch (error) {
      return false;
    }
  }

  // حذف وبینار
  // حذف وبینار از پرووایدر
  async deleteWebinar(data: DeleteWebinarDto) {
    try {
      const webinar = await this.prisma.webinar.findFirst({
        where: { id: Number(data.webinar_id), owner_id: Number(data.user_id) },
      });
      if (webinar) {
        // delete webinar in provider db
        await this.eventService.deleteWebinar(webinar.webinar_id);

        // delte guests in webinar
        await this.prisma.guest.deleteMany({
          where: {
            webinar_id: Number(data.webinar_id),
          },
        });

        // delete webinar
        await this.prisma.webinar.delete({
          where: {
            id: Number(data.webinar_id),
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

  // غیرفعال کردن وبینار
  // حذف وبینار از پرووایدر
  async webinarStatusInactived(data: DeleteWebinarDto) {
    try {
      const webinar = await this.prisma.webinar.findFirst({
        where: { id: Number(data.webinar_id), owner_id: Number(data.user_id) },
      });
      if (webinar) {
        // delete webinar in provider db
        await this.eventService.deleteWebinar(webinar.webinar_id);

        // delete webinar
        await this.prisma.webinar.update({
          where: {
            id: Number(data.webinar_id),
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
  async updateWebinar(werbinarInfo: UpdateWebinarDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id: werbinarInfo.user_id },
      });

      const webinar = await this.prisma.webinar.findFirst({
        where: {
          id: Number(werbinarInfo.webinar_id),
        },
      });
      if (webinar) {
        const slug = this.generateSlug();
        werbinarInfo.slug = slug;
        werbinarInfo.webinar_provider_id = webinar.webinar_id;
        // update webinar in provider db
        const response = (await this.eventService.updateWebinar(
          werbinarInfo
        )) as any;
        if (response.status === 200) {
          // update webinar in db
          const updatedWebinar = await this.prisma.webinar.update({
            where: {
              id: Number(werbinarInfo.webinar_id),
            },
            data: {
              owner_id: werbinarInfo.user_id,
              title: werbinarInfo.title,
              description: werbinarInfo.description,
              event_link: response.data.event.alocom_link,
              type: werbinarInfo.type,
              tag: werbinarInfo.tag,
              guest_count: Number(werbinarInfo.guest_count),
              guest_access: Number(werbinarInfo.guest_access),
              started_at: werbinarInfo.started_at,
              start_time: werbinarInfo.start_time,
              end_time: werbinarInfo.end_time,
            },
          });

          return { status: 200, webinar: updatedWebinar, client };
        }
        return { status: 500 };
      } else {
        return { status: 403 };
      }
    } catch (error) {
      return { status: 500 };
    }
  }

  // ثبت وبینار جدید
  async store(createWebinarDto: CreateWebinarDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id: createWebinarDto.user_id },
      });

      // generate slug ti webinar
      const slug = this.generateSlug();
      createWebinarDto.slug = slug;

      // create new webinar in alocom
      const werbinarInfo = await this.createNewWebinarInProvider(
        createWebinarDto
      );

      if (werbinarInfo) {
        const clientInfo = await this.prisma.client.findUnique({
          where: { id: createWebinarDto.user_id },
        });
        const users = {
          users: [{ userid: clientInfo.webinar_provider_id, role: "teacher" }],
        };

        // add user to webinar- role:  teacher, assistant, participant
        await this.addUserToEvent_teacherRole(werbinarInfo.id, users);
        // save new webinar in DB
        const webinar = await this.prisma.webinar.create({
          data: {
            webinar_id: werbinarInfo.id,
            owner_id: createWebinarDto.user_id,
            title: createWebinarDto.title,
            description: createWebinarDto.description,
            type: createWebinarDto.type,
            tag: createWebinarDto.tag,
            year: Number(createWebinarDto.year),
            month: Number(createWebinarDto.month),
            guest_count: Number(createWebinarDto.guest_count),
            guest_access: Number(createWebinarDto.guest_access),
            started_at: createWebinarDto.started_at,
            start_time: createWebinarDto.start_time,
            end_time: createWebinarDto.end_time,
            event_link: werbinarInfo.alocom_link,
            client: {
              connect: {
                id: createWebinarDto.user_id,
              },
            },
          },
          include: { guests: true },
        });

        return { status: 200, webinar, client };
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

  async inviteContactToWebinar(inviteContactDto: InviteContactDto) {
    try {
      const webinar = await this.prisma.webinar.findFirst({
        where: {
          id: Number(inviteContactDto.webinar_id),
          owner_id: Number(inviteContactDto.user_id),
        },
      });

      if (webinar) {
        const contacts = inviteContactDto.contacts;

        // delete old guest
        await this.prisma.guest.deleteMany({
          where: { webinar_id: inviteContactDto.webinar_id },
        });

        const users = await Promise.all(
          contacts.map(async (contact) => {
            // connect client to webinar
            const gusetInfo = await this.prisma.client.update({
              where: { id: contact.client_id },
              data: {
                webinars: {
                  connect: { id: inviteContactDto.webinar_id },
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

            // connect client to guest in web
            await this.prisma.guest.create({
              data: {
                client_id: contact.client_id,
                userid: contact.userid,
                display_name: gusetInfo.name + " " + gusetInfo.surname,
                phone: contact.phone,
                role: contact.role,
                webinar: {
                  connect: { id: Number(inviteContactDto.webinar_id) },
                },
              },
            });

            // send login info for webinar guest
            await this.sendLoginInfo(
              gusetInfo.phone,
              gusetInfo.username,
              gusetInfo.password
            );

            delete contact.client_id;
            return contact;
          })
        );
        await this.eventService.addUsersToEvent(webinar.webinar_id, { users });
        await this.prisma.webinar.update({
          where: { id: Number(inviteContactDto.webinar_id) },
          data: {
            guest_count: users.length,
          },
        });

        return { status: 200 };
      } else {
        return { status: 403 };
      }
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private generateSlug(): string {
    return (
      new Date().getTime().toString() +
      Math.floor(Math.random() * (999999 - 111111 + 1) + 111111)
    );
  }

  // send username and password for client with sms
  private async sendLoginInfo(
    phone: string,
    username: string,
    password: string
  ) {
    try {
      console.log("*** Send Login Info With SMS ***");
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

  async findOneByID(item_id: number) {
    return await this.prisma.webinar.findFirst({
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
