import { Module } from "@nestjs/common";
import { WebinarService } from "./webinar.service";
import { WebinarController } from "./webinar.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";

import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";

@Module({
  imports: [
    NestjsFormDataModule,
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        database: 15,
        ttl: 30,
        password:
          process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
      }),
    }),
  ],
  controllers: [WebinarController],
  providers: [WebinarService],
  exports: [WebinarModule, WebinarService],
})
export class WebinarModule {}
