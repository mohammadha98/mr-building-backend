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
exports.AdminReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const admin_report_types_enum_1 = require("./enums/admin-report-types.enum");
const Statuses_1 = require("../../../commons/contracts/Statuses");
const get_details_real_estate_ads_dto_1 = require("../real-estate-ads/app/dto/get-details-real-estate-ads.dto");
let AdminReportsService = class AdminReportsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async generateAdsReports(reportDto) {
        const ads = await this.getAdsStats(reportDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: "دیتا ارسال شد",
            data: {
                ads,
            },
        };
    }
    async generateClientReports(reportDto) {
        const clients = await this.getInstallationStats(reportDto.period);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: "دیتا ارسال شد",
            data: {
                clients,
            },
        };
    }
    async generateRealEstateReports(reportDto) {
        const real_estates = await this.getRealEstateAgentsStats(reportDto.period);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: "دیتا ارسال شد",
            data: {
                real_estates,
            },
        };
    }
    async getInActiveClients(body) {
        const fromDate = new Date(Date.UTC(+body.from.year, +body.from.month - 1, +body.from.date, 0, 0, 0, 0));
        const toDate = new Date(Date.UTC(+body.to.year, +body.to.month - 1, +body.to.date, 23, 59, 59, 999));
        const result = await this.prismaService.client.findMany({
            where: {
                last_login_time: {
                    gt: fromDate.toISOString(),
                    lt: toDate.toISOString(),
                },
            },
            select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                last_login_time: true,
            },
            orderBy: { last_login_time: "asc" },
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: "لیست کاربران غیر فعال بر اساس بازه زمانی",
            data: {
                data: result,
            },
        };
    }
    async getInstallationStats(period) {
        let { now, daily, weekly, monthly, yearly } = this.generateDateForStats();
        const where = this.generateCondition(period);
        const total = await this.prismaService.client.count();
        daily = await this.prismaService.client.count({
            where: {
                created_at: {
                    gte: daily,
                },
            },
        });
        weekly = await this.prismaService.client.count({
            where: {
                created_at: {
                    gte: weekly,
                },
            },
        });
        monthly = await this.prismaService.client.count({
            where: {
                created_at: {
                    gte: monthly,
                },
            },
        });
        yearly = await this.prismaService.client.count({
            where: {
                created_at: {
                    gte: yearly,
                },
            },
        });
        const period_count = await this.prismaService.client.count({
            where,
        });
        const result = await this.prismaService.client.groupBy({
            by: ["created_at"],
            _count: {
                _all: true,
            },
            where,
            orderBy: {
                created_at: "asc",
            },
        });
        const data = this.formattedStats(result, period);
        return {
            total,
            daily,
            weekly,
            monthly,
            yearly,
            period_count,
            data,
        };
    }
    async getRealEstateAgentsStats(period) {
        let { daily, weekly, monthly, yearly } = this.generateDateForStats();
        const where = this.generateCondition(period);
        const total = await this.prismaService.realEstateAgents.count();
        daily = await this.prismaService.realEstateAgents.count({
            where: {
                created_at: {
                    gte: daily,
                },
            },
        });
        weekly = await this.prismaService.realEstateAgents.count({
            where: {
                created_at: {
                    gte: weekly,
                },
            },
        });
        monthly = await this.prismaService.realEstateAgents.count({
            where: {
                created_at: {
                    gte: monthly,
                },
            },
        });
        yearly = await this.prismaService.realEstateAgents.count({
            where: {
                created_at: {
                    gte: yearly,
                },
            },
        });
        const period_count = await this.prismaService.realEstateAgents.count({
            where,
        });
        const result = await this.prismaService.realEstateAgents.groupBy({
            by: ["created_at"],
            _count: {
                _all: true,
            },
            where,
            orderBy: {
                created_at: "asc",
            },
        });
        const data = this.formattedStats(result, period);
        return {
            total,
            daily,
            weekly,
            monthly,
            yearly,
            period_count,
            data,
        };
    }
    async getAdsStats(reportDto) {
        let { daily, weekly, monthly, yearly } = this.generateDateForStats();
        const where = this.generateCondition(reportDto.period);
        let status = undefined;
        if (reportDto.status !== Statuses_1.default.all) {
            status = reportDto.status;
            where.status = reportDto.status;
        }
        const total = await this.prismaService.realEstateAds.count();
        daily = await this.prismaService.realEstateAds.count({
            where: {
                status,
                tag: get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding,
                created_at: {
                    gte: daily,
                },
            },
        });
        weekly = await this.prismaService.realEstateAds.count({
            where: {
                status,
                tag: get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding,
                created_at: {
                    gte: weekly,
                },
            },
        });
        monthly = await this.prismaService.realEstateAds.count({
            where: {
                status,
                tag: get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding,
                created_at: {
                    gte: monthly,
                },
            },
        });
        yearly = await this.prismaService.realEstateAds.count({
            where: {
                status,
                tag: get_details_real_estate_ads_dto_1.AdsDetailTags.mrbuilding,
                created_at: {
                    gte: yearly,
                },
            },
        });
        const period_count = await this.prismaService.realEstateAds.count({
            where,
        });
        const result = await this.prismaService.realEstateAds.groupBy({
            by: ["created_at"],
            _count: {
                _all: true,
            },
            where,
            orderBy: {
                created_at: "asc",
            },
        });
        const data = this.formattedStats(result, reportDto.period);
        return {
            total,
            daily,
            weekly,
            monthly,
            yearly,
            period_count,
            data,
        };
    }
    generateCondition(period) {
        let { daily, weekly, monthly, yearly } = this.generateDateForStats();
        let now = new Date();
        let where = {};
        if (period === admin_report_types_enum_1.AdminReportTypes.Daily) {
            where = {
                created_at: {
                    gte: daily,
                },
            };
        }
        else if (period === admin_report_types_enum_1.AdminReportTypes.Weekly) {
            where = {
                created_at: {
                    gte: weekly,
                },
            };
        }
        else if (period === admin_report_types_enum_1.AdminReportTypes.Monthly) {
            where = {
                created_at: {
                    gte: monthly,
                },
            };
        }
        else if (period === admin_report_types_enum_1.AdminReportTypes.Yearly) {
            where = {
                created_at: {
                    gte: yearly,
                },
            };
        }
        return where;
    }
    formattedStats(list, period) {
        const formattedStats = list.map((stat) => ({
            date: stat.created_at.toISOString().split("T")[0],
            count: stat._count._all,
        }));
        let data = formattedStats.reduce((acc, current) => {
            const existingDate = acc.find((item) => item.date === current.date);
            if (existingDate) {
                existingDate.count += current.count;
            }
            else {
                acc.push({ date: current.date, count: current.count });
            }
            return acc;
        }, []);
        return data;
    }
    generateDateForStats() {
        let date = new Date();
        date.setHours(3, 30, 0, 0);
        let daily = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 3, 30, 0, 0);
        console.log({ daily });
        let weekly = date.setDate(date.getDate() - 7);
        weekly = new Date(weekly);
        console.log({ weekly });
        let monthly = date.setDate(date.getDate() - 30);
        monthly = new Date(monthly);
        console.log({ monthly });
        let yearly = date.setDate(date.getDate() - 365);
        yearly = new Date(yearly);
        console.log({ yearly });
        return {
            now: new Date(),
            daily,
            weekly,
            monthly,
            yearly,
        };
    }
};
AdminReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminReportsService);
exports.AdminReportsService = AdminReportsService;
//# sourceMappingURL=admin-reports.service.js.map