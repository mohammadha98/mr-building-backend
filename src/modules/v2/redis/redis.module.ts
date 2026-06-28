import { Module, Inject, OnModuleInit, Logger } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { RedisController } from "./redis.controller";
import { Cache } from "cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";
import type { RedisClientOptions } from "redis";

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore as any,
        host: process.env.REDIS_HOST || "suitable-stallion-154730.upstash.io",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
        username:'mohammad',
        tls: process.env.REDIS_TLS === "true" ? {} : undefined,
      }),
    }),
  ],
  exports: [RedisService],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  onModuleInit() {
    const logger = new Logger("RedisModule");
    logger.log("Redis cache initialized");
  }
}
