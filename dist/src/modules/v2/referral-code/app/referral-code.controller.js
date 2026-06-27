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
exports.ReferralCodeController = void 0;
const common_1 = require("@nestjs/common");
const referral_code_service_1 = require("./referral-code.service");
const create_referal_code_dto_1 = require("./dto/create-referal-code.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const get_users_referal_code_dto_1 = require("./dto/get-users-referal-code.dto");
const getDetails_dto_1 = require("./dto/getDetails.dto");
const conflictErrorHandler_1 = require("../../../services/httpResponseHandler/conflictErrorHandler");
let ReferralCodeController = class ReferralCodeController {
    constructor(referralCodeService, responseHandler, referalCodeTransformer) {
        this.referralCodeService = referralCodeService;
        this.responseHandler = responseHandler;
        this.referalCodeTransformer = referalCodeTransformer;
    }
    async create(body, req, res) {
        body.client_id = req.user.id;
        const result = await this.referralCodeService.create(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کد معرف اشتباه است.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 409) {
            throw new conflictErrorHandler_1.ConflictErrorHandler("خطا. کد معرف خود را نمیتوانید استفاده کنید.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, result.status, result.message);
    }
    async getMyUser(query, req, res) {
        query.client_id = req.user.id;
        console.log("get User in Referral Code");
        console.log(query);
        const result = await this.referralCodeService.getMyUser(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.referalCodeTransformer.userCollection(result.clients, result.score);
        return this.responseHandler.send(res, 200, "لیست کاربران در دسترس است.", transformer);
    }
    async getReferralDetails(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** getReferralDetails ***");
        console.log(query);
        const result = await this.referralCodeService.getReferralDetails(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.referalCodeTransformer.transform({
            total: result.total,
            point: result.point,
        });
        return this.responseHandler.send(res, 200, "جزییات فرد دعوت شده در دسترس است.", transformer);
    }
    async updateCodes(req, res) {
        console.log("*** Update ReferralCodes ***");
        const result = await this.referralCodeService.updateCodes();
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کد معرف اشتباه است.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
};
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
    (0, swagger_1.ApiOperation)({ summary: "بررسی و ثبت کدمعرف" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_referal_code_dto_1.CreateReferralCodeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReferralCodeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کاربران در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کاربران در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            client_id: { type: "integer" },
                            client_name: { type: "string" },
                            client_phone: { type: "string" },
                            client_roles: {
                                type: "array",
                                example: [
                                    "client",
                                    "estate_agent",
                                    "advisor",
                                    "admin",
                                    "operator_estate_agent",
                                ],
                            },
                            referral_id: { type: "integer" },
                            referral_code: { type: "string" },
                            number_of_sub_categories: { type: "integer" },
                            point: { type: "integer" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست  کاربرانی که از کد معرف استفاده کرده اند" }),
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_users_referal_code_dto_1.GetUsersReferralCodeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReferralCodeController.prototype, "getMyUser", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جزییات فرد دعوت شده در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "جزییات فرد دعوت شده در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            total: {
                                type: "object",
                                properties: {
                                    client: { type: "integer" },
                                    estate_agent: { type: "integer" },
                                    advisor: { type: "integer" },
                                    admin: { type: "integer" },
                                    operator_estate_agent: { type: "integer" },
                                },
                            },
                            point: { type: "integer" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "جزییات دعوت شده" }),
    (0, common_1.Get)("users/details"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getDetails_dto_1.getDetailsReferralCodeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReferralCodeController.prototype, "getReferralDetails", null);
__decorate([
    (0, common_1.Get)("/update_codes"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReferralCodeController.prototype, "updateCodes", null);
ReferralCodeController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-referral-code"),
    (0, common_1.Controller)("v2/app/referral-code"),
    __metadata("design:paramtypes", [referral_code_service_1.ReferralCodeService,
        httpResponsehandler_1.HttpResponsehandler,
        transformer_1.default])
], ReferralCodeController);
exports.ReferralCodeController = ReferralCodeController;
//# sourceMappingURL=referral-code.controller.js.map