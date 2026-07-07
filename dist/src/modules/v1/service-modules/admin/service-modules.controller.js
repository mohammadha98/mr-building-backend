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
const create_service_media_module_dto_1 = require("./dto/create-service-media-module.dto");
const swagger_1 = require("@nestjs/swagger");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const nestjs_form_data_1 = require("nestjs-form-data");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const get_service_media_module_dto_1 = require("./dto/get-service-media-module.dto");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const create_service_dto_1 = require("./dto/create-service.dto");
let ServiceModulesController = class ServiceModulesController {
    constructor(serviceModulesService, transformer) {
        this.serviceModulesService = serviceModulesService;
        this.transformer = transformer;
        this.httpResponsehandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async saveServiceInfo(body, req, res) {
        body.user_id = req.user.id;
        console.log("****** save service info ******");
        console.log({ body });
        const result = await this.serviceModulesService.saveServiceInfo(body);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.transformer.transformerService(result.result);
        return this.httpResponsehandler.send(res, 201, "درخواست با موفقیت انجام شد.", transformer);
    }
    async saveNewMedia(body, req, res, file) {
        body.user_id = req.user.id;
        body.file = file.filename;
        console.log("****** save new media in service module ******");
        console.log({ body });
        const result = await this.serviceModulesService.create(body);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.transformer.transformerMedia(result.result);
        return this.httpResponsehandler.send(res, 201, "فایل با موفقیت ذخیره شد.", transformer);
    }
    async findAll(query, req, res) {
        console.log("****** get serviceMedia module ******");
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
        return this.httpResponsehandler.send(res, 200, "لیست فایل های خدمات در دسترس است.", {
            info: serviceInfo,
            list: media,
        });
    }
    async remove(id, req, res) {
        console.log("****** remove Media in service module ******");
        console.log({ id });
        const result = await this.serviceModulesService.remove(id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.httpResponsehandler.send(res, 200, "ایتم موردنظر حذف شد.");
    }
};
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
                        description: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره مشخصات خدمات" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "saveServiceInfo", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "فایل با موفقیت ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 201 },
                message: {
                    type: "string",
                    example: "فایل با موفقیت ذخیره شد.",
                },
                error: { type: "string", example: "" },
                data: {
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
    }),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره مدیا برای سرویس" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_service_media_module_dto_1.CreateServiceMediaDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/services/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    })),
    (0, common_1.Post)("/media"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_media_module_dto_1.CreateServiceMediaDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "saveNewMedia", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست فایل های خدمات در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "لیست فایل های خدمات در دسترس است.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت مدیاهای بخش خدمات" }),
    (0, common_1.Get)("/media"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_service_media_module_dto_1.GetServicesMediaDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ایتم موردنظر حذف شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: {
                    type: "string",
                    example: "ایتم موردنظر حذف شد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "خطا. آیتم موردنظر وجود ندارد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 400 },
                message: {
                    type: "string",
                    example: "خطا. آیتم موردنظر وجود ندارد.",
                },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف فایل" }),
    (0, common_1.Delete)("media/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ServiceModulesController.prototype, "remove", null);
ServiceModulesController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin/services-module"),
    (0, common_1.Controller)("v1/admin/services-module"),
    __metadata("design:paramtypes", [service_modules_service_1.ServiceModulesService,
        Transformer_1.default])
], ServiceModulesController);
exports.ServiceModulesController = ServiceModulesController;
//# sourceMappingURL=service-modules.controller.js.map