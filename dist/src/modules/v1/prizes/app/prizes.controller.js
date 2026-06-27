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
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const use_prize_dto_1 = require("./dto/use-prize.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const conflictErrorHandler_1 = require("../../../services/httpResponseHandler/conflictErrorHandler");
let PrizesController = class PrizesController {
    constructor(prizesService, responseHandler, prizesTransformer) {
        this.prizesService = prizesService;
        this.responseHandler = responseHandler;
        this.prizesTransformer = prizesTransformer;
    }
    async getMissions(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Missions: APP ***");
        console.log(query);
        const result = await this.prizesService.getMissions(query);
        const transformer = this.prizesTransformer.missionCollection(result.result.missions);
        return this.responseHandler.send(res, 200, "لیست ماموریت ها در دسترس است.", {
            total_score: result.result.total_score,
            missions: transformer,
        });
    }
    async getPrizes(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Prizes: APP ***");
        console.log(query);
        const result = await this.prizesService.getPrizes(query);
        const transformer = this.prizesTransformer.collection(result.result.prizes);
        return this.responseHandler.send(res, 200, "لیست جوایز در دسترس است.", {
            total_score: result.result.total_score,
            prizes: transformer,
            metadata: result.result.metadata,
        });
    }
    async getUserPrizes(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get User Prizes: APP ***");
        console.log(query);
        const result = await this.prizesService.getUserPrizes(query);
        const transformer = this.prizesTransformer.collection(result.result.prizes);
        return this.responseHandler.send(res, 200, "لیست جوایز در دسترس است.", {
            total_score: result.result.total_score,
            prizes: transformer,
            metadata: result.result.metadata,
        });
    }
    async usePrize(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** Use Prize: APP ***");
        console.log(body);
        const result = await this.prizesService.usePrize(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("ظرفیت کدهای تخفیف به اتمام رسیده است.");
        }
        else if (result.status === 404) {
            throw new common_1.NotFoundException("خطا. جایزه موردنظر قابل استفاده نمیباشد. .");
        }
        else if (result.status === 409) {
            throw new conflictErrorHandler_1.ConflictErrorHandler("خطا. امتیاز شما کمتر از حد مجاز میباشد");
        }
        return this.responseHandler.send(res, 200, "جایزه با موفقیت ثبت شد.", {
            total_score: result.total_score,
            id: result.id,
            coupon: result.coupon,
        });
    }
    async getHistoryOfScores(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get HistoryOfScores: APP ***");
        console.log(query);
        const result = await this.prizesService.getHistoryOfScores(query);
        const transformer = this.prizesTransformer.historyOfScorCollection(result.result.history);
        return this.responseHandler.send(res, 200, "لیست امتیاز ها  در دسترس است.", {
            total_score: result.result.total_score,
            prizes: transformer,
            metadata: result.result.metadata,
        });
    }
};
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
                        total_score: { type: "integer", example: 50 },
                        missions: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    point: { type: "integer", example: 1 },
                                    mission_done: { type: "boolean", default: false },
                                    is_limited: { type: "boolean" },
                                    number_of_hours: { type: "integer", example: 1 },
                                    is_permitted: { type: "boolean" },
                                    last_used_at: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت ماموریت ها" }),
    (0, common_1.Get)("/missions"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getMissions", null);
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
                        total_score: { type: "integer", example: 50 },
                        prizes: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    point: { type: "integer", example: 1 },
                                    thumbnail: { type: "string" },
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
    (0, common_1.Get)("/prizes"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getPrizes", null);
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
                        total_score: { type: "integer", example: 50 },
                        prizes: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    point: { type: "integer", example: 1 },
                                    coupon: { type: "string" },
                                    thumbnail: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست جوایز کاربر " }),
    (0, common_1.Get)("/prizes/user"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getUserPrizes", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جایزه با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "جایزه با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        total_score: { type: "integer", example: 50 },
                        id: { type: "integer", example: 1 },
                        coupon: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت جایزه" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/prizes"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [use_prize_dto_1.UsePrizeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "usePrize", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست امتیاز ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست امتیاز ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        total_score: { type: "integer", example: 50 },
                        prizes: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    score: { type: "integer", example: 1 },
                                    action: { type: "string", example: "increase, decrease" },
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
    (0, swagger_1.ApiOperation)({ summary: "تاریخچه امتیازات " }),
    (0, common_1.Get)("/prizes/history"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PrizesController.prototype, "getHistoryOfScores", null);
PrizesController = __decorate([
    (0, common_1.Controller)("v1/app/prizes"),
    (0, swagger_1.ApiTags)("v1/app-prizes"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    __metadata("design:paramtypes", [prizes_service_1.PrizesService,
        httpResponsehandler_1.HttpResponsehandler,
        transformer_1.default])
], PrizesController);
exports.PrizesController = PrizesController;
//# sourceMappingURL=prizes.controller.js.map