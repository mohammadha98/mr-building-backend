import { OnModuleInit } from "@nestjs/common";
import { Cache } from "cache-manager";
export declare class RedisModule implements OnModuleInit {
    private cache;
    constructor(cache: Cache);
    onModuleInit(): void;
}
