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
exports.RealEstateAgentsCommentsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const force_update_service_1 = require("./force-update.service");
const create_forceupdate_dto_1 = require("./dto/create-forceupdate.dto");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const Transformer_1 = require("./Transformer");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const change_status_dto_1 = require("./dto/change-status.dto");
const remove_dto_1 = require("./dto/remove.dto");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const path_1 = require("path");
const crypto_1 = require("crypto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const check_file_middleware_1 = require("./check-file.middleware");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let RealEstateAgentsCommentsController = class RealEstateAgentsCommentsController {
    constructor(responseHandler, agentsCommentsService, agentsCommentsTransformer) {
        this.responseHandler = responseHandler;
        this.agentsCommentsService = agentsCommentsService;
        this.agentsCommentsTransformer = agentsCommentsTransformer;
    }
    async storeForceUpdate(body, file_apk, req, res) {
        body.user_id = req.user.id;
        body.file_apk = file_apk ? file_apk.filename : null;
        const result = await this.agentsCommentsService.storeForceUpdate(body);
        const transformer = this.agentsCommentsTransformer.transform(result.result);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "آیتم جدید ذخیره شد.", {
            data: transformer,
            total_clients: result.total_clients,
        });
    }
    async findAllComments(query, req, res) {
        query.user_id = req.user.id;
        const result = await this.agentsCommentsService.findAll(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.agentsCommentsTransformer.collection(result.result);
        return this.responseHandler.send(res, 200, "لیست بروزرسانی های ثبت شده در دسترس است.", {
            data: transformer,
            total_clients: result.total_clients,
            metadata: result.metadata,
        });
    }
    async changeStatus(body, req, res) {
        body.user_id = req.user.id;
        const result = await this.agentsCommentsService.changeStatus(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "تغییر وضعیت انجام شد.");
    }
    async remove(query, req, res) {
        query.user_id = req.user.id;
        const result = await this.agentsCommentsService.remove(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "حذف آیتم با موفقیت انجام شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "آیتم جدید ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "آیتم جدید ذخیره شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)("file_apk", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/force_updates",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    }), check_file_middleware_1.CheckForceUpdateFileMiddleware),
    (0, swagger_1.ApiOperation)({ summary: " آپدیت اجباری" }),
    (0, swagger_1.ApiBody)({ type: create_forceupdate_dto_1.CreateForceUpdateDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_2.Post)(),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.UploadedFile)()),
    __param(2, (0, common_2.Request)()),
    __param(3, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_forceupdate_dto_1.CreateForceUpdateDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "storeForceUpdate", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست بروزرسانی های ثبت شده در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست بروزرسانی های ثبت شده در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: "1" },
                                    version: { type: "String", example: "1.0.5" },
                                    required: { type: "boolean", example: true },
                                    file_name: { type: "String" },
                                    file_url: { type: "String" },
                                    total_clients: { type: "number" },
                                    status: {
                                        type: "string",
                                        example: "active, inactive",
                                    },
                                    items: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                            properties: {},
                                        },
                                    },
                                    created_at: { type: "String", example: "" },
                                },
                            },
                        },
                        total_installs: { type: "number" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست بروزرسانی های ثبت شده" }),
    (0, common_2.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "findAllComments", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "تغییر وضعیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "تغییر وضعیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {},
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_dto_1.ChangeStatusDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "حذف آیتم با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "حذف آیتم با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {},
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [remove_dto_1.RemoveDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "remove", null);
RealEstateAgentsCommentsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-force-update"),
    (0, common_2.Controller)("v1/admin/force-update"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        force_update_service_1.ForceUpdateService,
        Transformer_1.default])
], RealEstateAgentsCommentsController);
exports.RealEstateAgentsCommentsController = RealEstateAgentsCommentsController;
//# sourceMappingURL=force-update.controller.js.map