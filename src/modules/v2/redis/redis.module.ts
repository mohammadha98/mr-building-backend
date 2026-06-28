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
        store: redisStore.redisStore as any,
        host: "https://suitable-stallion-154730.upstash.io",
        token:'gQAAAAAAAlxqAAIgcDFlNzI2YzFkNWRkOWI0NmQyOTgzNWVjNDhmYTQwYzgwNw',
        port: 6379,
      }),
    }),
  ],
  exports: [RedisModule, RedisService],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}
  onModuleInit() {
    const logger = new Logger("cache logger");
    console.log(logger);
  }
}
