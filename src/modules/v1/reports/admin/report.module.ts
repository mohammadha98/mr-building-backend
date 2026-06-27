import { Module } from "@nestjs/common";
import { ReportController } from "./report.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ReportBugsTransformer from "./Transformer";
import { ReportService } from "./report.service";
import ReportsTransformer from "./Transformer";
import { ClientService } from "src/modules/v1/client/admin/client.service";
import { ClientModule } from "src/modules/v1/client/admin/client.module";
import { WebinarService } from "src/modules/v1/webinar/app/webinar.service";
import { EventRoomsService } from "src/modules/v1/event-rooms/app/event-rooms.service";
import { eventGroupsService } from "src/modules/v1/events/group/app/event-groups.service";

import { RealEstateAgentsService } from "src/modules/v1/real-estate-agents/admin/real-estate-agents.service";
import { RealEstateAgentsAdvisorsService } from "src/modules/v1/real-estate-agents-advisors/admin/real-estate-agents-advisors.service";
import { ChannelRealEstateService } from "src/modules/v1/channel-real-estate/app/channel-real-estate.service";
import { ChatRealEstateService } from "src/modules/v1/chat-real-estate/app/chat-real-estate.service";
import RealEstateAgentsPostgresqlRepository from "src/modules/v1/real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository";
import RealEstateAdvisorTransformer from "src/modules/v1/real-estate-agents-advisors/admin/Transformer";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import MessageTransformer from "src/modules/v1/chat-real-estate/app/Transformer";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v1/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";

import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import RealEstateAdsPostgresqlRepository from "src/modules/v1/real-estate-ads/repositories/RealEstateAdsPostgresqlRepository";
import { UsersModule } from "src/modules/v1/users/admin/users.module";
import { UsersService } from "src/modules/v1/users/admin/users.service";
import UserPrismaRepository from "src/modules/v1/users/admin/repositories/UserPrismaRepository";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { RealEstateAdsService } from "src/modules/v1/real-estate-ads/admin/real-estate-ads.service";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import { RealEstateAdsModuleApp } from "../../real-estate-ads/app/real-estate-ads.module";
import EventRoomsTransformer from "../../event-rooms/app/Transformer";
import { MessengerChannelsService } from "../../messenger_channels/app/messenger-channels.service";
import { MessengerChannelAppModule } from "../../messenger_channels/app/messenger-channel.module";
import UploadService from "src/modules/services/UploadService";

@Module({
  imports: [
    ClientModule,
    UsersModule,
    RealEstateAdsModuleApp,
    MessengerChannelAppModule,
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        host: "localhost",
        port: 6379,
        database: 12,
        ttl: 60,
        password:
          process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
      }),
    }),
  ],
  controllers: [ReportController],
  providers: [
    ClientService,
    UsersService,
    JwtService,
    ReportService,
    ReportBugsTransformer,
    HttpResponsehandler,
    ReportsTransformer,
    UserPrismaRepository,
    WebinarService,
    EventRoomsService,
    eventGroupsService,
    RealEstateAgentsService,
    RealEstateAgentsPostgresqlRepository,
    RealEstateAgentsCommentsPostgresqlRepository,
    RealEstateAgentsAdvisorsService,
    ChannelRealEstateService,
    ChatRealEstateService,
    RealEstateAdvisorTransformer,
    SmsService,
    MessageTransformer,
    RealEstateAdsPostgresqlRepository,
    RealEstateAdsService,
    FcmNotificationService,
    GoogleFCM,
    MailerService,
    MrBuildingMailerService,
    MailerService,
    MrBuildingMailerService,
    EventRoomsTransformer,
    MessengerChannelsService,
    UploadService,
  ],
  exports: [ReportAdminModule, ReportService, ReportBugsTransformer],
})
export class ReportAdminModule {}
