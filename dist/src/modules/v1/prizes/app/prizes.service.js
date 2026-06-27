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
exports.PrizesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const missions_service_1 = require("../../missions/admin/missions.service");
const client_service_1 = require("../../client/app/client.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
let PrizesService = class PrizesService {
    constructor(prismaService, clientService, missionService) {
        this.prismaService = prismaService;
        this.clientService = clientService;
        this.missionService = missionService;
    }
    async getMissions(query) {
        try {
            const client = await this.clientService.validateWithID(query.user_id);
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const total_score = client.score;
            const missionList = await this.findActivateMissions();
            const missions = await this.checkMissionsForUser(missionList, query.user_id);
            return {
                result: {
                    total_score,
                    missions,
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async checkMissionsForUser(missions, client_id) {
        return await Promise.all(missions.map(async (item) => {
            const presentedMissions = item;
            const date = new Date();
            date.setUTCHours(0, 0, 0, 0);
            presentedMissions.usedAt = null;
            presentedMissions.is_permitted = false;
            if (item.is_limited) {
                const checkDailyMission = await this.prismaService.dailyMissionsLogs.findFirst({
                    where: {
                        clientID: Number(client_id),
                        missionType: item.key,
                    },
                    orderBy: { usedAt: "desc" },
                });
                if (!checkDailyMission) {
                    presentedMissions.usedAt = null;
                }
                else {
                    const calculateTimeDifference = this.calculateTimeDifference(date, checkDailyMission.usedAt);
                    if (calculateTimeDifference) {
                        presentedMissions.usedAt = checkDailyMission.usedAt;
                        presentedMissions.is_permitted = true;
                    }
                    else {
                        presentedMissions.usedAt = checkDailyMission.usedAt;
                        presentedMissions.is_permitted = false;
                    }
                }
            }
            const receivedMissions = await this.prismaService.receiveMissions.findFirst({
                where: { client_id, mission_id: item.id },
            });
            if (!receivedMissions) {
                presentedMissions.mission_done = false;
            }
            else {
                presentedMissions.mission_done = true;
            }
            return presentedMissions;
        }));
    }
    calculateTimeDifference(loginDate, lastLoginDate) {
        const timeDifference = loginDate.getTime() - lastLoginDate.getTime();
        const twentyFourHoursInSeconds = 24 * 60 * 60;
        return timeDifference > twentyFourHoursInSeconds * 100;
    }
    async getPrizes(query) {
        try {
            const client = await this.clientService.validateWithID(query.user_id);
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const total_score = client.score;
            const count = await this.prismaService.prizes.count();
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const prizes = await this.findActivatePrizes(paginationValue.offset, paginationValue.per_page);
            return {
                result: {
                    total_score,
                    prizes,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async getHistoryOfScores(query) {
        try {
            const client = await this.clientService.validateWithID(query.user_id);
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const total_score = client.score;
            const count = await this.prismaService.historyOfScores.count({
                where: { client_id: Number(query.user_id) },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const history = await this.prismaService.historyOfScores.findMany({
                where: { client_id: Number(query.user_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
            });
            return {
                result: {
                    total_score,
                    history,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async getUserPrizes(query) {
        try {
            const client = await this.clientService.validateWithID(query.user_id);
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const total_score = client.score;
            const count = await this.prismaService.receivePrizes.count({
                where: { clientId: Number(query.user_id) },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const prizes = await this.prismaService.receivePrizes.findMany({
                where: { clientId: Number(query.user_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    coupon: true,
                    point: true,
                    thumbnail: true,
                    url: true,
                    title: true,
                    description: true,
                },
            });
            return {
                result: {
                    total_score,
                    prizes,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async usePrize(body) {
        try {
            const client = await this.clientService.validateWithID(body.client_id);
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const validatePrize = await this.prismaService.prizes.findFirst({
                where: { id: Number(body.item_id) },
            });
            if (!validatePrize) {
                return { status: 404 };
            }
            const getValidCoupon = await this.prismaService.prizeCoupons.findFirst({
                where: {
                    prizeId: Number(body.item_id),
                    status: Statuses_1.default.active,
                },
            });
            if (!getValidCoupon) {
                return { status: 400 };
            }
            const deCreseResult = await this.clientService.deCreaseScore(body.client_id, validatePrize.point);
            if (!deCreseResult) {
                return { status: 409 };
            }
            await this.prismaService.prizeCoupons.update({
                where: {
                    id: getValidCoupon.id,
                },
                data: { status: Statuses_1.default.used, used_at: new Date(Date.now()) },
            });
            const result = await this.prismaService.receivePrizes.create({
                data: {
                    client: { connect: { id: Number(body.client_id) } },
                    prizeId: Number(body.item_id),
                    title: validatePrize.title,
                    description: validatePrize.description,
                    coupon: getValidCoupon.coupon,
                    point: validatePrize.point,
                    thumbnail: validatePrize.thumbnail,
                    url: validatePrize.url,
                    received_at: new Date(Date.now()),
                },
                select: { id: true },
            });
            await this.prismaService.historyOfScores.create({
                data: {
                    client: { connect: { id: Number(body.client_id) } },
                    title: validatePrize.title,
                    score: Number(validatePrize.point),
                    type: "prize",
                    action: "decrease",
                },
            });
            return {
                id: result.id,
                total_score: deCreseResult,
                coupon: getValidCoupon.coupon,
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async findActivateMissions() {
        try {
            return await this.prismaService.missions.findMany({
                where: { status: Statuses_1.default.active },
            });
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async findActivatePrizes(offset, per_page) {
        try {
            return await this.prismaService.prizes.findMany({
                where: { status: Statuses_1.default.active },
                skip: offset,
                take: per_page,
                orderBy: { id: "desc" },
            });
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
    generateRedisKey(query) {
        const resourceKey = `get_real_estate_agents_advisors_status_${query.status}_agentId_${query.agent_id}_clientId_${query.client_id}`;
        console.log("* resourceKey *");
        console.log(resourceKey);
        return resourceKey;
    }
};
PrizesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        client_service_1.ClientService,
        missions_service_1.MissionsAdminService])
], PrizesService);
exports.PrizesService = PrizesService;
//# sourceMappingURL=prizes.service.js.map