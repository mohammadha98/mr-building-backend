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
exports.MissionsAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const users_service_1 = require("../../users/admin/users.service");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
let MissionsAdminService = class MissionsAdminService {
    constructor(prismaService, userService) {
        this.prismaService = prismaService;
        this.userService = userService;
    }
    async create(body) {
        try {
            const user = await this.userService.validateWithID(body.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            let is_limited = false;
            if (body.is_limited == "true") {
                is_limited = true;
            }
            let status = 200;
            let message = "مامورت وارد شده تکراری میباشد.";
            let checkExistMission = (await this.prismaService.missions.findFirst({
                where: {
                    key: body.key,
                },
            }));
            if (!checkExistMission) {
                checkExistMission = await this.prismaService.missions.create({
                    data: {
                        creator_id: body.user_id,
                        key: body.key,
                        title: body.title,
                        description: body.description,
                        point: Number(body.point),
                        is_limited,
                        number_of_hours: Number(body.number_of_hours),
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        point: true,
                        status: true,
                        created_at: true,
                        number_of_used: true,
                        is_limited: true,
                        number_of_hours: true,
                    },
                });
                status = 201;
                message = "ماموریت جدید با موفقیت ثبت شد.";
            }
            else {
                checkExistMission = await this.prismaService.missions.update({
                    where: {
                        id: checkExistMission.id,
                    },
                    data: {
                        creator_id: body.user_id,
                        title: body.title,
                        description: body.description,
                        point: Number(body.point),
                        is_limited,
                        number_of_hours: Number(body.number_of_hours),
                    },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        point: true,
                        status: true,
                        created_at: true,
                        number_of_used: true,
                        is_limited: true,
                        number_of_hours: true,
                    },
                });
                status = 200;
                message = "ویرایش ماموریت با موفقیت انجام شد.";
            }
            return {
                retsult: {
                    status,
                    message,
                    data: checkExistMission,
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async updateClientMissions(user_id) {
        try {
            const user = await this.userService.validateWithID(Number(user_id));
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const result = await this.prismaService.missions.findFirst({
                where: { key: "register" },
            });
            const clientList = await this.prismaService.client.findMany();
            const clientIds = clientList.map((item) => item.id);
            const receivedMissionExists = await this.prismaService.receiveMissions.findMany();
            const receivedMissionExistsIds = receivedMissionExists.map((item) => item.client_id);
            const newClientIds = clientIds.filter((clientId) => !receivedMissionExistsIds.includes(clientId));
            await this.prismaService.receiveMissions.createMany({
                data: newClientIds.map((id) => {
                    return {
                        client_id: Number(id),
                        title: result.title,
                        description: result.description,
                        point: result.point,
                        mission_id: result.id,
                        received_at: new Date(Date.now()),
                    };
                }),
            });
            return result;
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async getMissions(query) {
        try {
            const user = await this.userService.validateWithID(query.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const missions = await this.prismaService.missions.findMany({
                orderBy: { id: "desc" },
            });
            return missions;
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async changeStatus(body) {
        try {
            const user = await this.userService.validateWithID(body.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const missions = await this.prismaService.missions.update({
                where: {
                    id: Number(body.item_id),
                },
                data: {
                    status: body.status,
                },
            });
            return missions;
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async deleteMission(body) {
        try {
            const user = await this.userService.validateWithID(body.user_id);
            if (!user) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            await this.prismaService.missions.deleteMany({
                where: {
                    id: Number(body.item_id),
                },
            });
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async findActivate() {
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
};
MissionsAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], MissionsAdminService);
exports.MissionsAdminService = MissionsAdminService;
//# sourceMappingURL=missions.service.js.map