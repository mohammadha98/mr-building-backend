import { Module } from "@nestjs/common";
import { RealEstateAdsServiceApp } from "./real-estate-ads-service-app.service";
import { RealEstateAdsSettingsController } from "./real-estate-ads.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import { ClientModule } from "src/modules/v1/client/app/client.module";
import { ClientService } from "src/modules/v1/client/app/client.service";
import RealEstateAdsTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import { RealEstateAdsService_robotScraper } from "../robotScraper/real-estate-ads.service";
import RealEstateAdsScraperTransformer from "../robotScraper/Transformer";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import SmsService from "src/modules/services/notifications/sms/SmsService";

// APP_MODE

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          ...(process.env.REDIS_TLS === 'true' && { tls: true }),
        },
        database: 10,
        ttl: 60,
        password:
          process.env.APP_MODE !== 'development'
            ? process.env.REDIS_PASSWORD
            : undefined,
      }),
    }),
    ClientModule,
    NestjsFormDataModule,
  ],

  controllers: [RealEstateAdsSettingsController],
  providers: [
    HttpResponsehandler,
    RealEstateAdsServiceApp,
    RealEstateAdsPostgresqlRepository,
    RealEstateAdsTransformer,
    ClientService,
    MailerService,
    MrBuildingMailerService,
    RealEstateAdsService_robotScraper,
    RealEstateAdsScraperTransformer,
    FcmNotificationService,
    GoogleFCM,
    SmsService,
  ],
  exports: [
    RealEstateAdsModuleApp,
    RealEstateAdsServiceApp,
    RealEstateAdsPostgresqlRepository,
    RealEstateAdsTransformer,
    CacheModule,
    ClientModule,
    RealEstateAdsService_robotScraper,
    RealEstateAdsScraperTransformer,
    SmsService,
  ],
})
export class RealEstateAdsModuleApp {}
