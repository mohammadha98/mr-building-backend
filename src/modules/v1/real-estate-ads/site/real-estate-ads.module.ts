import { Module } from "@nestjs/common";
import { RealEstateAdsService } from "./real-estate-ads.service";
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

// APP_MODE

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        host: "localhost",
        port: 6379,
        database: 10,
        ttl: 60,
        password:
          process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
      }),
    }),
    ClientModule,
    NestjsFormDataModule,
  ],
  controllers: [RealEstateAdsSettingsController],
  providers: [
    RealEstateAdsService,
    HttpResponsehandler,
    RealEstateAdsPostgresqlRepository,
    ClientService,
    RealEstateAdsTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class RealEstateAdsModuleSite {}
