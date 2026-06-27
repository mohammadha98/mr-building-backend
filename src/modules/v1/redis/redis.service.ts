import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get(key: string) {
    try {
      // const result = await this.cacheManager.set(key, "Test Key PSG");
      const get = await this.cacheManager.get(key);
      console.log(get);
    } catch (error) {
      console.log(error);
    }
  }
}
