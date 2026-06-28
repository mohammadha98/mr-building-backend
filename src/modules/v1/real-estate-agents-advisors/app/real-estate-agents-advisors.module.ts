import { Module } from "@nestjs/common";
import { RealEstateAgentsAdvisorsService } from "./real-estate-agents-advisors.service";
import { RealEstateAgentsAdvisorsController } from "./real-estate-agents-advisors.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { ClientModule } from "src/modules/v1/client/app/client.module";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import ClientTransformer from "src/modules/v1/client/app/Transformer";
import RealEstateAdvisorTransformer from "./Transformer";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        database: 14,
        ttl: 60,
        password:
          process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
      }),
    }),
    ClientModule,
    NestjsFormDataModule,
  ],
  controllers: [RealEstateAgentsAdvisorsController],
  providers: [
    RealEstateAgentsAdvisorsService,
    RealEstateAdvisorTransformer,
    ClientService,
    HttpResponsehandler,
    ClientTransformer,
    SmsService,
    MrBuildingMailerService,
    MailerService,
  ],
  exports: [
    RealEstateAgentsAdvisorsAppModule,
    RealEstateAgentsAdvisorsService,
    RealEstateAdvisorTransformer,
    SmsService,
  ],
})
export class RealEstateAgentsAdvisorsAppModule {}
