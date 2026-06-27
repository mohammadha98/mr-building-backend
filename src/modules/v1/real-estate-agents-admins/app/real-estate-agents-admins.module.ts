import { Module } from "@nestjs/common";
import { RealEstateAgentsAdminsService } from "./real-estate-agents-admins.service";
import { RealEstateAgentsAdminsController } from "./real-estate-agents-admins.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { ClientModule } from "src/modules/v1/client/app/client.module";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import ClientTransformer from "src/modules/v1/client/app/Transformer";
import RealEstateAdminsTransformer from "./Transformer";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        host: "localhost",
        port: 6379,
        database: 13,
        ttl: 60,
        password:
          process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
      }),
    }),
    ClientModule,
    NestjsFormDataModule,
  ],
  controllers: [RealEstateAgentsAdminsController],
  providers: [
    RealEstateAgentsAdminsService,
    RealEstateAdminsTransformer,
    ClientService,
    HttpResponsehandler,
    ClientTransformer,
    SmsService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class RealEstateAgentsAdminsAppModule {}
