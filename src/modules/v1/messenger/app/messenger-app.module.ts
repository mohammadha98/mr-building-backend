import { Module } from "@nestjs/common";
import { MessengerController } from "./messenger.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v1//client/app/client.service";
import { ClientModule } from "src/modules/v1//client/app/client.module";

import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import MessageTransformer from "../../chat-real-estate/app/Transformer";
import MessengerAppTransformer from "../../messenger/app/Transformer";
import { MessengerChannelsService } from "../../messenger_channels/app/messenger-channels.service";
import { MessengerGroupsService } from "../../messenger_groups/app/messenger-groups.service";
import MessengerChannelTransformer from "../../messenger_channels/app/Transformer";
import MessengerGroupsTransformer from "../../messenger_groups/app/Transformer";
import UploadService from "src/modules/services/UploadService";
import { NotificationsService } from "../../notifications/app/notifications.service";
import { RealEstateAgentsService } from "../../real-estate-agents/app/real-estate-agents.service";
import RealEstateAgentsTransformer from "../../real-estate-agents/app/Transformer";
import RealEstateAgentsPostgresqlRepository from "../../real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository";
import { ForceUpdateAdminModule } from "../../force-update/admin/force-update.module";
import { ForceUpdateService } from "../../force-update/admin/force-update.service";
import ForceUpdateTransformer from "../../force-update/admin/Transformer";
import RealEstateAdvisorTransformer from "../../real-estate-agents-advisors/app/Transformer";
import UserPrismaRepository from "../../users/admin/repositories/UserPrismaRepository";
import RealEstateAdminsTransformer from "../../real-estate-agents-admins/app/Transformer";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { MessengerSaveMessageAppModule } from "../../messenger-save-message/app/save-message-app.module";
import { MessengerSaveMessageService } from "../../messenger-save-message/app/save-message.service";
import { MessengerService } from "./messenger.service";

@Module({
  imports: [
    NestjsFormDataModule,
    ClientModule,
    MessengerSaveMessageAppModule,
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          ...(process.env.REDIS_TLS === 'true' && { tls: true }),
        },
        database: 0,
        ttl: null,
        password:
          process.env.APP_MODE !== 'development'
            ? process.env.REDIS_PASSWORD
            : undefined,
      }),
    }),
  ],
  controllers: [MessengerController],
  providers: [
    MessengerService,
    HttpResponsehandler,
    ClientService,
    MessengerGroupsTransformer,
    MessengerChannelTransformer,
    ClientService,
    RealEstateAgentsService,
    RealEstateAgentsTransformer,
    RealEstateAgentsPostgresqlRepository,
    ForceUpdateAdminModule,
    ForceUpdateService,
    ForceUpdateTransformer,
    RealEstateAdvisorTransformer,
    UserPrismaRepository,
    RealEstateAdminsTransformer,
    MailerService,
    MrBuildingMailerService,
    FcmNotificationService,
    FcmNotificationService,
    GoogleFCM,
    MessengerAppTransformer,
    MessageTransformer,
    MessengerChannelsService,
    UploadService,
    MessengerGroupsService,
    MessengerChannelTransformer,
    MessengerGroupsTransformer,
    NotificationsService,
    FcmNotificationService,
    GoogleFCM,
    MessengerSaveMessageService,
  ],
  exports: [MessengerService, MessengerAppModule],
})
export class MessengerAppModule {}
