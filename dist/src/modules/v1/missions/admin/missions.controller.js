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
exports.MissionsController = void 0;
const common_1 = require("@nestjs/common");
const missions_service_1 = require("./missions.service");
const create_mission_dto_1 = require("./dto/create-mission.dto");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const change_status_mission_dto_1 = require("./dto/change-status-mission.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let MissionsController = class MissionsController {
    constructor(missionsService, responseHandler, missionsTransformer) {
        this.missionsService = missionsService;
        this.responseHandler = responseHandler;
        this.missionsTransformer = missionsTransformer;
    }
    async create(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** Create New Mission ***");
        console.log(body);
        const result = await this.missionsService.create(body);
        const transformer = this.missionsTransformer.transform(result.retsult.data);
        return this.responseHandler.send(res, result.retsult.status, result.retsult.message, transformer);
    }
    async updateClientMissions(req, res) {
        console.log("*** Update Client Mission: ADMIN ***");
        console.log(req.user.id);
        await this.missionsService.updateClientMissions(req.user.id);
        return this.responseHandler.send(res, 201, "درخواست با موفقیت انجام شد.");
    }
    async getMissions(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Missions: APP ***");
        console.log(query);
        const result = await this.missionsService.getMissions(query);
        const transformer = this.missionsTransformer.collection(result);
        return this.responseHandler.send(res, 200, "لیست ماموریت ها در دسترس است.", {
            missions: transformer,
        });
    }
    async changeStatus(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** ChangeStatus Mission: ADMIN ***");
        console.log(body);
        await this.missionsService.changeStatus(body);
        return this.responseHandler.send(res, 200, "وضعیت با موفقیت تغییر کرد.");
    }
    async deleteMission(item_id, req, res) {
        const body = { user_id: req.user.id, item_id: item_id };
        console.log("*** Delete Mission: ADMIN ***");
        console.log(body);
        await this.missionsService.deleteMission(body);
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        title: { type: "string" },
                        description: { type: "string" },
                        point: { type: "integer", example: 1 },
                        status: {
                            type: "string",
                            example: "active, inactive",
                        },
                        number_of_used: { type: "integer", example: 0 },
                        created_at: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد ماموریت" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mission_dto_1.CreateMissionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MissionsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        title: { type: "string" },
                        description: { type: "string" },
                        point: { type: "integer", example: 1 },
                        status: {
                            type: "string",
                            example: "active, inactive",
                        },
                        number_of_used: { type: "integer", example: 0 },
                        created_at: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تست - بروزرسانی ماموریت های کلاینت های ثبت شده" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MissionsController.prototype, "updateClientMissions", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست ماموریت ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست ماموریت ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        missions: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    key: { type: "string" },
                                    point: { type: "integer", example: 1 },
                                    status: { type: "string" },
                                    created_at: { type: "string" },
                                    number_of_used: { type: "integer", example: 1 },
                                    is_daily: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت ماموریت ها" }),
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MissionsController.prototype, "getMissions", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت ماموریت" }),
    (0, common_1.Post)("/change-status"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_mission_dto_1.ChangeStatusMissionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MissionsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "عملیات با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "عملیات با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف ماموریت" }),
    (0, common_1.Delete)("/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MissionsController.prototype, "deleteMission", null);
MissionsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("v1/admin/missions"),
    (0, swagger_1.ApiTags)("v1/admin-missions"),
    __metadata("design:paramtypes", [missions_service_1.MissionsAdminService,
        httpResponsehandler_1.HttpResponsehandler,
        transformer_1.default])
], MissionsController);
exports.MissionsController = MissionsController;
//# sourceMappingURL=missions.controller.js.map