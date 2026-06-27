import { Injectable } from "@nestjs/common";
import { CreateNotificationForUserDto } from "./dto/create-user-notification.dto";
import { PrismaService } from "prisma/prisma.service";
import { TestSendClientNotificationDto } from "./dto/test-send-client-notification.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";

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

  async saveNotificationFoClient(body: SaveNotificationTokenDto) {
    try {
      const groups = await this.prismaService.messengerGroupsMembers.findMany({
        where: { client_id: body.client_id },
        select: { group: { select: { key: true } } }
      });
      const groupKeys = [];
      groups.map((item) => groupKeys.push(item.group.key));

      const channels =
        await this.prismaService.messengerChannlesMembers.findMany({
          where: { client_id: body.client_id },
          select: { channel: { select: { key: true } } }
        });
      const channelKeys = [];
      channels.map((item) => channelKeys.push(item.channel.key));

      let topics = [...groupKeys, ...channelKeys];
      topics.push("forceUpdate");
      console.log("**** subscribeToTopic after update Token ****");
      console.log(topics);

      await topics.map(async (topic) => {
        await this.fcmNotificationService.subscribeToTopic(
          [body.notification_token],
          topic
        );
      });

      await this.prismaService.clientNotificaionTokens.deleteMany({
        where: {
          client_id: body.client_id,
          device_info: body.device_info
        }
      });

      await this.prismaService.clientNotificaionTokens.create({
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

  async findAllClientNotifications() {
    return `This action returns all notifications`;
  }

  async saveNotificationFoAdminUsers(body: CreateNotificationForUserDto) {
    return "This action adds a new notification";
  }

  async findAllAdminUsersNotifications() {
    return `This action returns all notifications`;
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
