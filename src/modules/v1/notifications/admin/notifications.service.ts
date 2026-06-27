import { Injectable } from "@nestjs/common";
import { CreateNotificationForUserDto } from "./dto/create-user-notification.dto";
import { PrismaService } from "src/../prisma/prisma.service";
import { TestSendClientNotificationDto } from "./dto/test-send-client-notification.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
import { HttpStatusCode } from "axios";
import { PublicMessage } from "src/commons/enums/messages";
import { CreateGeneralNotificationDto } from "./dto/create-client-notification.dto";
import FCMNotificationEnum from "../enums/FCM-Notification.enum";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fcmNotificationService: FcmNotificationService
  ) {
  }

  public async testSendClientNotificationDto(
    body: TestSendClientNotificationDto
  ) {
    try {
      const result = await this.prismaService.clientNotificaionTokens.findFirst(
        {
          where: {
            client_id: Number(body.client_id)
          }
        }
      );

      await this.fcmNotificationService.send({
        title: body.title,
        body: body.body,
        notification_token: result.notification_token,
        key: "chat_messenger"
      });

      return { status: 201, result };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }


  async sendGeneralNotification(body: CreateGeneralNotificationDto) {

    // save generalNotification
    await this.prismaService.generalNotification.create({
      data: {
        title: body.title,
        content: body.content,
        link: body.link
      }
    });
    await this.prismaService.generalNotificationSettings.updateMany({ data: { enabled: false } });
    await this.prismaService.generalNotificationSettings.create({ data: { enabled: true } });
    await this.prismaService.client.updateMany({ data: { has_update_general_notification: true } });

    await this.fcmNotificationService.sendToTopic({
      body: JSON.stringify({
        title: body.title,
        content: body.content,
        link: body.link,
        source: FCMNotificationEnum.GeneralNotification
      }),
      title: body.title,
      key: FCMNotificationEnum.GeneralNotification,
      topic: FCMNotificationEnum.GeneralNotification
    });

    return {
      statusCode: HttpStatusCode.Created,
      message: PublicMessage.Created,
      data: {}
    };
  }


  async getGeneralNotification() {
    const result = await this.prismaService.generalNotification.findMany({});
    return {
      statusCode: HttpStatusCode.Created,
      message: PublicMessage.Created,
      data: result
    };
  }

  async saveNotificationForAdminUser(body: SaveNotificationTokenDto) {
    try {
      const oldToken = await this.prismaService.userNotificaionTokens.findFirst(
        {
          where: {
            client_id: body.client_id,
            device_info: body.device_info
          }
        }
      );

      if (oldToken) {
        if (body.notification_token !== oldToken.notification_token) {
          const topics = ["notifications"];
          console.log("topics");
          console.log(topics);

          await topics.map(async (topic) => {
            await this.fcmNotificationService.subscribeToTopic(
              [body.notification_token],
              topic
            );
          });

          await this.prismaService.userNotificaionTokens.deleteMany({
            where: {
              client_id: body.client_id,
              device_info: body.device_info
            }
          });
        }
      }

      await this.prismaService.userNotificaionTokens.create({
        data: {
          client: { connect: { id: body.client_id } },
          notification_token: body.notification_token,
          device_info: body.device_info
        }
      });

      return { status: 201 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getClientNotificationToken(client_id: number): Promise<string[]> {
    const result = await this.prismaService.clientNotificaionTokens.findMany({
      where: { client_id },
      select: {
        notification_token: true
      }
    });

    const tokens = [];
    if (result.length) {
      result.map((item) => tokens.push(item.notification_token));
    }
    return tokens;
  }

  async getAdminUserNotificationToken(client_id: number) {
    const result = await this.prismaService.userNotificaionTokens.findMany({
      where: { client_id },
      select: {
        notification_token: true
      }
    });

    const tokens = [];
    if (result.length) {
      result.map((item) => tokens.push(item.notification_token));
    }
    return tokens;
  }
}
