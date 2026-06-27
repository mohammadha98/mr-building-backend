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
exports.InwardMarketStatsController = void 0;
const common_1 = require("@nestjs/common");
const inward_market_stats_service_1 = require("./inward-market-stats.service");
const swagger_1 = require("@nestjs/swagger");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
let InwardMarketStatsController = class InwardMarketStatsController {
    constructor(inwardMarketStatsService) {
        this.inwardMarketStatsService = inwardMarketStatsService;
    }
    findAll() {
        return this.inwardMarketStatsService.findAll();
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "دریافت قیمت طلا, سکه, ارز" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InwardMarketStatsController.prototype, "findAll", null);
InwardMarketStatsController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app/inward-market-stats"),
    (0, common_1.Controller)("v1/app/inward-market-stats"),
    __metadata("design:paramtypes", [inward_market_stats_service_1.InwardMarketStatsService])
], InwardMarketStatsController);
exports.InwardMarketStatsController = InwardMarketStatsController;
//# sourceMappingURL=inward-market-stats.controller.js.map