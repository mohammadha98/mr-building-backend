"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("./redis.service");
const redis_controller_1 = require("./redis.controller");
const redisStore = require("cache-manager-redis-store");
const cache_manager_1 = require("@nestjs/cache-manager");
let RedisModule = class RedisModule {
    constructor(cache) {
        this.cache = cache;
    }
    onModuleInit() {
        const logger = new common_1.Logger("RedisModule");
        logger.log("Redis cache initialized");
    }
};
RedisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => ({
                    store: redisStore,
                    host: process.env.REDIS_HOST || "suitable-stallion-154730.upstash.io",
                    port: parseInt(process.env.REDIS_PORT || "6379"),
                    password: process.env.REDIS_PASSWORD,
                    username: 'mohammad',
                    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
                }),
            }),
        ],
        exports: [redis_service_1.RedisService],
        controllers: [redis_controller_1.RedisController],
        providers: [redis_service_1.RedisService],
    }),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], RedisModule);
exports.RedisModule = RedisModule;
//# sourceMappingURL=redis.module.js.map