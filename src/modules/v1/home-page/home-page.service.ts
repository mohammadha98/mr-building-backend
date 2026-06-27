import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import statuses from "src/commons/contracts/Statuses";
import UserTypes from "src/commons/contracts/UserTypes";
import SliderTransformerApp from "src/modules/v1//slider/contracts/transformer-app";
import { GetHomePageDto } from "./dto/create-home-page.dto";
import InstalledVersionTypes from "src/commons/contracts/InstalledVersionTypes";
import { ClientService } from "../client/app/client.service";
import missionTypes from "src/commons/contracts/MissionTypes";
import { SliderEnum } from "../slider/enums/slider.enum";
import SliderTransformerAdmin from "../slider/contracts/transformer-admin";
import { MessengerChannelsService } from "../messenger_channels/app/messenger-channels.service";
import BannerTransformerApp from "../banners/contracts/transformer-app";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { NotificationsService } from "../notifications/app/notifications.service";
import FCMNotificationEnum from "../notifications/enums/FCM-Notification.enum";

@Injectable()
export class HomePageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sliderTransformer: SliderTransformerApp,
    private readonly clientService: ClientService,
    private readonly sliderTransformerAdmin: SliderTransformerAdmin,
    private readonly bannerTransformer: BannerTransformerApp,
    private readonly messengerChannelsService: MessengerChannelsService,
    private readonly fcmNotificationService: FcmNotificationService,
    private readonly notificationsService: NotificationsService
  ) {
  }

  // get homePage items
  async homePage(query: GetHomePageDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id: query.client_id }
      });

      if (!client) {
        return { status: 403 };
      }
      const roles = client.roles;

      const generalNotificationSettings = await this.prisma.generalNotificationSettings.findFirst({
        where: { enabled: true }
      });
      if (generalNotificationSettings && generalNotificationSettings.enabled && client.has_update_general_notification) {
        const tokens = await this.notificationsService.getClientNotificationToken(client.id);
        await this.fcmNotificationService.subscribeToTopic(tokens, FCMNotificationEnum.GeneralNotification);
        await this.prisma.client.update({ where: { id: client.id }, data: { has_update_general_notification: false } });
      }

      // realEstateAgents
      let estate_agent_info = null;
      let advisor_info = null;
      const operator: any = {};
      if (roles.includes(UserTypes.estate_agent)) {
        estate_agent_info = (await this.prisma.realEstateAgents.findFirst({
          where: { client_id: query.client_id },
          select: {
            id: true,
            phone: true,
            validate_phone: true,
            name: true,
            avatar: true,
            license: true,
            license_status: true,
            status: true,
            score: true,
            number_of_ads: true,
            client_id: true,
            province: { select: { id: true, name: true } },
            city: { select: { id: true, name: true } }
          }
        })) as any;
        const channel =
          await this.messengerChannelsService.findChannelByClientId(
            estate_agent_info.client_id,
            client.id,
            "real_estate"
          );
        estate_agent_info.channel = channel;
      } else if (roles.includes(UserTypes.advisor)) {
        advisor_info = await this.prisma.realEstateAdvisors.findFirst({
          where: { client_id: query.client_id },
          select: {
            id: true,
            avatar: true,
            biography: true,
            comment_visibility: true,
            status: true,
            score: true,
            total_score: true,
            number_of_ads: true,
            total_customers: true,
            phone: true,
            validate_phone: true,
            permissions: true,
            color: true,
            client: {
              select: { id: true, name: true, surname: true, avatar: true }
            },
            real_estate_agent: {
              select: { id: true, name: true, score: true }
            }
          }
        });
      }
      if (roles.includes(UserTypes.operator_estate_agent)) {
        const operatorPermisions =
          await this.prisma.operator_realEstateAgents.findFirst({
            where: { client_id: query.client_id },
            select: {
              provinces: true,
              cities: true
            }
          });

        const number_of_approved_ads =
          await this.prisma.realEstateAdApproval.count({
            where: {
              user_id: Number(query.client_id),
              user_type:
                client.roles[client.roles.indexOf(UserTypes.client) + 1]
            }
          });
        operatorPermisions.provinces = [client.provincesId];

        operatorPermisions.cities = [client.citiesId];
        operator.real_estate_agent = operatorPermisions;
        operator.real_estate_agent.number_of_approved_ads =
          number_of_approved_ads;
      }

      // forceUpdate
      let forceUpdate = null;
      if (!query.installed_version_type) {
        query.installed_version_type = InstalledVersionTypes.direct;
      }

      if (
        query.installed_version_type == InstalledVersionTypes.direct &&
        client.has_update_direct
      ) {
        forceUpdate = await this.prisma.forceUpdate.findFirst({
          where: {
            status: statuses.active,
            installed_version_type: query.installed_version_type
          },
          orderBy: { id: "desc" },
          select: {
            id: true,
            installed_version_type: true,
            version: true,
            required: true,
            file_name: true,
            indirect_link: true,
            content: true,
            items: true
          }
        });
      } else if (
        query.installed_version_type == InstalledVersionTypes.cafebazar &&
        client.has_update_cafebazar
      ) {
        forceUpdate = await this.prisma.forceUpdate.findFirst({
          where: {
            status: statuses.active,
            installed_version_type: query.installed_version_type
          },
          orderBy: { id: "desc" },
          select: {
            id: true,
            installed_version_type: true,
            version: true,
            required: true,
            file_name: true,
            indirect_link: true,
            content: true,
            items: true
          }
        });
      } else if (
        query.installed_version_type == InstalledVersionTypes.myket &&
        client.has_update_myket
      ) {
        forceUpdate = await this.prisma.forceUpdate.findFirst({
          where: {
            status: statuses.active,
            installed_version_type: query.installed_version_type
          },
          orderBy: { id: "desc" },
          select: {
            id: true,
            installed_version_type: true,
            version: true,
            required: true,
            file_name: true,
            indirect_link: true,
            content: true,
            items: true
          }
        });
      }

      // slider
      const slider = await this.getSlider();

      const missionInfo = await this.prisma.missions.findFirst({
        where: { key: missionTypes.daily_score }
      });

      await this.clientService.saveMission(missionInfo, client);

      const blockedHistory = await this.prisma.messengerBlockHistory.findMany({
        where: {
          OR: [{ clientId: client.id }, { targetId: client.id }]
        }
      });

      const blocked_account_ids = [];
      const blocked_participant_ids = [];

      //
      const number_of_unread_messages =
        await this.prisma.chatMessengerMessages.count({
          where: { destination_id: client.id, seen: false }
        });

      blockedHistory.map((item) => {
        if (client.id === item.clientId) {
          blocked_account_ids.push(item.targetId);
        } else if (client.id !== item.clientId) {
          blocked_participant_ids.push(item.clientId);
        }
      });

      const slider_services = await this.getServicesSlider();
      const banner_home = await this.getBanners(SliderEnum.home);
      const banner_services = await this.getBanners(SliderEnum.services);

      return {
        status: 200,
        result: {
          total_score: client.score,
          token: client.token,
          number_of_unread_messages,
          user_key: client.key,
          blocked_account_ids,
          blocked_participant_ids,
          has_update:
            query.installed_version_type === InstalledVersionTypes.direct
              ? client.has_update_direct
              : client.has_update_cafebazar,
          force_update: forceUpdate,
          roles,
          estate_agent_info,
          advisor_info,
          operator,
          slider,
          slider_services,
          banner_home,
          banner_services
        }
      };
    } catch (error) {
      console.log("*** Error in Get HomePage Items ***");
      console.log(error);
      return { status: 500 };
    }
  }

  private async getServicesSlider() {
    const slider = await this.prisma.slider.findMany({
      where: { tag: SliderEnum.services },
      select: {
        id: true,
        thumbnail: true
      }
    });

    return this.sliderTransformerAdmin.collection(slider);
  }

  private async getBanners(tag: string) {
    const slider = await this.prisma.banners.findFirst({
      where: { tag },
      select: {
        id: true,
        thumbnail: true,
        url: true
      }
    });

    return this.bannerTransformer.transform(slider);
  }

  // getSlider
  private async getSlider() {
    const slider = await this.prisma.slider.findMany({
      where: {
        status: statuses.active,
        tag: SliderEnum.home
      }
    });
    return this.sliderTransformer.collection(slider);
  }
}
