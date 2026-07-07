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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InwardMarketStatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const inward_stats_enum_1 = require("../enums/inward-stats.enum");
const messages_1 = require("../../../../commons/enums/messages");
let InwardMarketStatsService = class InwardMarketStatsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findAll() {
        const gold = await this.getGolds();
        const coin = await this.getCoins();
        const currency = await this.getCurrency();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: {
                gold,
                coin,
                currency,
            },
        };
    }
    async getGolds() {
        return this.prismaService.inwardMarketStatistics.findMany({
            where: { type: inward_stats_enum_1.InwardStatTypes.Gold },
        });
    }
    async getCoins() {
        return this.prismaService.inwardMarketStatistics.findMany({
            where: { type: inward_stats_enum_1.InwardStatTypes.Coin },
        });
    }
    async getCurrency() {
        return this.prismaService.inwardMarketStatistics.findMany({
            where: { type: inward_stats_enum_1.InwardStatTypes.Currency },
        });
    }
};
InwardMarketStatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InwardMarketStatsService);
exports.InwardMarketStatsService = InwardMarketStatsService;
//# sourceMappingURL=inward-market-stats.service.js.map