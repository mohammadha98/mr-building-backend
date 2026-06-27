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
exports.RealEstateAgentsAdminsController = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_admins_service_1 = require("./real-estate-agents-admins.service");
const create_real_estate_agents_admin_dto_1 = require("./dto/create-real-estate-agents-admin.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const validate_real_estate_agents_advisor_dto_1 = require("./dto/validate-real-estate-agents-advisor.dto");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("../../client/app/Transformer");
const get_real_estate_agents_admins_dto_1 = require("./dto/get-real-estate-agents-admins.dto");
const Transformer_2 = require("./Transformer");
const change_status_real_estate_agents_admins_dto_1 = require("./dto/change-status-real-estate-agents-admins.dto");
const delete_real_estate_agents_admin_dto_1 = require("./dto/delete-real-estate-agents-admin.dto");
const update_admin_permisions_1 = require("./dto/update-admin-permisions");
let RealEstateAgentsAdminsController = class RealEstateAgentsAdminsController {
    constructor(responseHandler, realEstateAdminTransformer, clientTransformer, realEstateAgentsAdminsService) {
        this.responseHandler = responseHandler;
        this.realEstateAdminTransformer = realEstateAdminTransformer;
        this.clientTransformer = clientTransformer;
        this.realEstateAgentsAdminsService = realEstateAgentsAdminsService;
    }
    async validate(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdmin: validate ***");
        console.log(body);
        const result = await this.realEstateAgentsAdminsService.validate(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.transform(result.user);
        return this.responseHandler.send(res, 200, "ریسپانس در دسترس است.", {
            status: result.result,
            client_info: transformer,
        });
    }
    async create(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdmin: create ***");
        console.log(body);
        const result = await this.realEstateAgentsAdminsService.create(body);
        if (result.status === 200) {
            const transformer = this.clientTransformer.transform(result.admin);
            return this.responseHandler.send(res, 200, "ادمین موردنظر اضافه نشد. برای بررسی دلیل خطا به جزییات ریسپانس مراجعه کنید.", {
                status: result.result,
                client_info: transformer,
            });
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "ادمین با موفقیت اضافه شد.", {
            status: result.result,
            result: result.transform,
        });
    }
    async findAll(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdmin: findAll ***");
        console.log({ query });
        const result = await this.realEstateAgentsAdminsService.findAll(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. مشاور املاک موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "لیست ادمین های ادمین در دسترس است.", result.admins);
    }
    async changeStatus(body, req, res) {
        console.log("*** RealEstateAgentsAdmin: change status ***");
        console.log(body);
        body.client_id = req.user.id;
        const result = await this.realEstateAgentsAdminsService.changeStatus(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . ادمین مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت ادمین با موفقیت تغییر کرد.");
    }
    async updatePermissions(body, req, res) {
        console.log("*** RealEstateAgentsAdmin: Update Permissions ***");
        console.log(body);
        body.client_id = req.user.id;
        const result = await this.realEstateAgentsAdminsService.updatePermissions(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . ادمین مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت ادمین با موفقیت تغییر کرد.");
    }
    async removeAdmin(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdmin: removeAdmin ***");
        console.log(body);
        const result = await this.realEstateAgentsAdminsService.removeAdmin(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . ادمین مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "ادمین  با موفقیت حذف شد.");
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ریسپانس در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "ریسپانس در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "estate_agent, not_found, busy, free",
                        },
                        client_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                provider_id: { type: "integer", example: 1 },
                                name: { type: "string", example: "" },
                                surname: { type: "string", example: "" },
                                phone: { type: "string", example: "09120000000" },
                                avatar: { type: "string", example: "" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "بررسی شماره ادمین" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/validate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_real_estate_agents_advisor_dto_1.ValidateRealEstateAgentsAdvisorDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdminsController.prototype, "validate", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "افزودن ادمین انجام نشد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "افزودن ادمین انجام نشد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "admin, estate_agent, not_found, busy",
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "ادمین با موفقیت اضافه شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "ادمین با موفقیت اضافه شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "created" },
                        result: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                name: { type: "string" },
                                phone: { type: "string" },
                                color: { type: "string" },
                                agent_id: { type: "integer", example: 1 },
                                agent_name: { type: "string" },
                                agent_number_of_ads: { type: "integer", example: 1 },
                                agent_score: { type: "integer", example: 1 },
                                agent_avatar: { type: "string" },
                                province: { type: "string" },
                                permissions: { type: "array", items: {} },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "افزودن ادمین به مشاوراملاک" }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_agents_admin_dto_1.CreateRealEstateAgentsAdminDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdminsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست ادمین های ادمین در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست ادمین های ادمین در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "string" },
                            phone: { type: "string" },
                            color: { type: "string" },
                            agent_id: { type: "integer", example: 1 },
                            agent_name: { type: "string" },
                            agent_number_of_ads: { type: "integer", example: 1 },
                            agent_score: { type: "integer", example: 1 },
                            agent_avatar: { type: "string" },
                            province: { type: "string" },
                            permissions: { type: "array", items: {} },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت لیست ادمین های یک مشاور املاک" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_real_estate_agents_admins_dto_1.GetRealEstateAgentsAdminsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdminsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت ادمین با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت ادمین با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت ادمین" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_real_estate_agents_admins_dto_1.ChangeStatusRealEstateAdminsAdminsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdminsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت ادمین با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت ادمین با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ویرایش دسترسی" }),
    (0, common_1.Patch)("permissions"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_permisions_1.UpdateAdminPermissionsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdminsController.prototype, "updatePermissions", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ادمین  با موفقیت حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "ادمین  با موفقیت حذف شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف ادمین" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_real_estate_agents_admin_dto_1.DeleteRealEstateAgentsAdminsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdminsController.prototype, "removeAdmin", null);
RealEstateAgentsAdminsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app/real-estate-agents-admins"),
    (0, common_1.Controller)("v2/app/real-estate-agents-admins"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        Transformer_2.default,
        Transformer_1.default,
        real_estate_agents_admins_service_1.RealEstateAgentsAdminsService])
], RealEstateAgentsAdminsController);
exports.RealEstateAgentsAdminsController = RealEstateAgentsAdminsController;
//# sourceMappingURL=real-estate-agents-admins.controller.js.map