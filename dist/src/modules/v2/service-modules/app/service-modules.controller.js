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
exports.ServiceModulesController = void 0;
const common_1 = require("@nestjs/common");
const service_modules_service_1 = require("./service-modules.service");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const get_service_media_module_dto_1 = require("./dto/get-service-media-module.dto");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const save_comment_dto_1 = require("./dto/save-comment.dto");
const get_comments_dto_1 = require("./dto/get-comments.dto");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
let ServiceModulesController = class ServiceModulesController {
    constructor(serviceModulesService, transformer) {
        this.serviceModulesService = serviceModulesService;
        this.transformer = transformer;
        this.httpResponsehandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async findAll(query, req, res) {
        console.log("****** get serviceInfo: APP ******");
        console.log({ query });
        const result = await this.serviceModulesService.findAll(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const serviceInfo = this.transformer.transformerService(result.service.info);
        const media = this.transformer.collectionMedia(result.service.media);
        return this.httpResponsehandler.send(res, 200, "جزییات خدمات در دسترس است.", {
            total_comments: result.service.total_comments,
            info: serviceInfo,
            list: media,
        });
    }
    async saveComment(body, req, res) {
        body.user_id = req.user.id;
        console.log("****** save comment in DeActiveServices ******");
        console.log({ body });
        const result = await this.serviceModulesService.saveServiceInfo(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.transformer.transformComment(result.result, body.user_id);
        return this.httpResponsehandler.send(res, 201, "درخواست با موفقیت انجام شد.", transformer);
    }
    async getComments(query, req, res) {
        query.user_id = req.user.id;
        console.log("****** Get Comments in DeActiveServices ******");
        const result = await this.serviceModulesService.getComments(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.transformer.collectionComments(result.result, Number(query.user_id));
        return this.httpResponsehandler.send(res, 201, "لیست کامنت ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async actionForComment(comment_id, req, res) {
        console.log("****** Action Comments in DeActiveServices: APP ******");
        console.log({ comment_id });
        console.log({ clientID: req.user.id });
        const result = await this.serviceModulesService.actionForComment(comment_id, req.user.id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.httpResponsehandler.send(res, result.status, "درخواست شما انجام شد.");
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جزییات خدمات در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "جزییات خدمات در دسترس است.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        total_comment: {
                            type: "number",
                        },
                        info: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                description: { type: "string" },
                            },
                        },
                        list: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    type: { type: "string" },
                                    file_type: { type: "string" },
                                    file: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)(),
    (0, swagger_1.ApiOperation)({ summary: "جزییات خدمات" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_service_media_module_dto_1.GetServicesMediaDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست با موفقیت انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        content: { type: "string" },
                        client_id: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                surname: { type: "string" },
                            },
                        },
                        replied_to: { type: "null" },
                        created_at: {
                            type: "object",
                            properties: {
                                day: { type: "integer" },
                                month: { type: "string" },
                                year: { type: "integer" },
                                time: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره کامنت جدید" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/comments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_comment_dto_1.SaveCommentInServicesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "saveComment", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کامنت ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کامنت ها در دسترس است.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    content: { type: "string" },
                                    client_id: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                            surname: { type: "string" },
                                        },
                                    },
                                    is_replied: { type: "boolean" },
                                    is_liked: { type: "boolean" },
                                    total_like: { type: "number" },
                                    replied_to: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            content: { type: "string" },
                                            client_id: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string" },
                                                    name: { type: "string" },
                                                    surname: { type: "string" },
                                                },
                                            },
                                            replied_to: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string" },
                                                    content: { type: "string" },
                                                    client_id: {
                                                        type: "object",
                                                        properties: {
                                                            id: { type: "string" },
                                                            name: { type: "string" },
                                                            surname: { type: "string" },
                                                        },
                                                    },
                                                    replied_to: { type: "null" },
                                                    created_at: {
                                                        type: "object",
                                                        properties: {
                                                            day: { type: "integer" },
                                                            month: { type: "string" },
                                                            year: { type: "integer" },
                                                            time: { type: "string" },
                                                        },
                                                    },
                                                },
                                            },
                                            created_at: {
                                                type: "object",
                                                properties: {
                                                    day: { type: "integer" },
                                                    month: { type: "string" },
                                                    year: { type: "integer" },
                                                    time: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                    created_at: {
                                        type: "object",
                                        properties: {
                                            day: { type: "integer" },
                                            month: { type: "string" },
                                            year: { type: "integer" },
                                            time: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت کامنت ها" }),
    (0, common_1.Get)("/comments"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_comments_dto_1.GetCommentsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "getComments", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "درخواست شما انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "درخواست شما انجام شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لایک و دیسلایک" }),
    (0, common_1.Post)("/comments/:comment_id"),
    __param(0, (0, common_1.Param)("comment_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "actionForComment", null);
ServiceModulesController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app/services-module"),
    (0, common_1.Controller)("v2/app/services-module"),
    __metadata("design:paramtypes", [service_modules_service_1.ServiceModulesService,
        Transformer_1.default])
], ServiceModulesController);
exports.ServiceModulesController = ServiceModulesController;
//# sourceMappingURL=service-modules.controller.js.map