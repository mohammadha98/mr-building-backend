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
exports.PrizesController = void 0;
const common_1 = require("@nestjs/common");
const prizes_service_1 = require("./prizes.service");
const create_mission_dto_1 = require("./dto/create-mission.dto");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const change_status_mission_dto_1 = require("../../missions/admin/dto/change-status-mission.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const check_file_middleware_1 = require("../../../../middlewares/check-file.middleware");
let PrizesController = class PrizesController {
    constructor(prizesService, responseHandler, prizesTransformer) {
        this.prizesService = prizesService;
        this.responseHandler = responseHandler;
        this.prizesTransformer = prizesTransformer;
    }
    async create(body, req, res, thumbnail) {
        body.user_id = req.user.id;
        body.thumbnail = thumbnail ? thumbnail.filename : null;
        console.log("*** Create New Pirzes ***");
        console.log(body);
        const result = await this.prizesService.create(body);
        const transformer = this.prizesTransformer.transform(result);
        return this.responseHandler.send(res, 201, "درخواست با موفقیت ثبت شد.", transformer);
    }
    async getPrizes(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Prizes: APP ***");
        console.log(query);
        const result = await this.prizesService.getPrizes(query);
        const transformer = this.prizesTransformer.collection(result.prizes);
        return this.responseHandler.send(res, 200, "لیست جوایز در دسترس است.", {
            prizes: transformer,
            metadata: result.metadata,
        });
    }
    async changeStatus(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** Chane Status Prize: ADMIN ***");
        console.log(body);
        await this.prizesService.changeStatus(body);
        return this.responseHandler.send(res, 200, "تغییر وضعیت با موفقیت انجام شد.");
    }
    async deletePrize(item_id, req, res) {
        const body = { user_id: req.user.id, item_id: item_id };
        console.log("*** Delete Prize: ADMIN ***");
        console.log(body);
        await this.prizesService.deletePrize(body);
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
                        thumbnail: { type: "string" },
                        coupon: { type: "string" },
                        duration_days: { type: "integer", example: 0 },
                        number_of_used: { type: "integer", example: 0 },
                        status: {
                            type: "string",
                            example: "active, inactive",
                        },
                        created_at: { type: "string" },
                        expired_at: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد جایزه جدید" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_mission_dto_1.CreatePrizeDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("thumbnail", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/prizes",
            filename(req, file, callback) {
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}${extention}`);
            },
        }),
    }), check_file_middleware_1.CheckFileMiddleware),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mission_dto_1.CreatePrizeDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست جوایز در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست جوایز در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        prizes: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    point: { type: "integer", example: 1 },
                                    thumbnail: { type: "string" },
                                    coupon: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", example: 1 },
                                                coupon: { type: "string" },
                                                status: { type: "string", example: "active, used" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست جوایز " }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getPrizes", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "تغییر وضعیت با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "تغییر وضعیت با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت جایزه " }),
    (0, common_1.Post)("/change-status"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_mission_dto_1.ChangeStatusMissionDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "changeStatus", null);
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
], PrizesController.prototype, "deletePrize", null);
PrizesController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, common_1.Controller)("v2/admin/prizes"),
    (0, swagger_1.ApiTags)("v2/admin-prizes"),
    __metadata("design:paramtypes", [prizes_service_1.PrizesService,
        httpResponsehandler_1.HttpResponsehandler,
        transformer_1.default])
], PrizesController);
exports.PrizesController = PrizesController;
//# sourceMappingURL=prizes.controller.js.map