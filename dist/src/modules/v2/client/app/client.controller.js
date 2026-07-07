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
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const update_client_dto_1 = require("./dto/update-client.dto");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const Transformer_1 = require("./Transformer");
const swagger_1 = require("@nestjs/swagger");
const UnAuthorizedSchema_1 = require("../../../../commons/contracts/swaggerDefinations/UnAuthorizedSchema");
const BadRequestSchema_1 = require("../../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const UnProcessableEntitySchema_1 = require("../../../../commons/contracts/swaggerDefinations/UnProcessableEntitySchema");
const NotFoundSchema_1 = require("../../../../commons/contracts/swaggerDefinations/NotFoundSchema");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const ForbiddenSchema_1 = require("../../../../commons/contracts/swaggerDefinations/ForbiddenSchema");
const nestjs_form_data_1 = require("nestjs-form-data");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const path_1 = require("path");
const disbale_update_status_1 = require("./dto/disbale-update-status");
const save_gif_client_dto_1 = require("./dto/save-gif-client.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const InstalledVersionTypes_1 = require("../../../../commons/contracts/InstalledVersionTypes");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const check_file_middleware_1 = require("../../../../middlewares/check-file.middleware");
let ClientController = class ClientController {
    constructor(clientService, clientTransformer) {
        this.clientService = clientService;
        this.clientTransformer = clientTransformer;
        this.responsehandler = new httpResponsehandler_1.HttpResponsehandler();
    }
    async clientInfo(req, res) {
        console.log("*** Client info ***");
        const result = await this.clientService.clientInfo(req.user.id);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const clientTransformer = this.clientTransformer.transform(result.client_info);
        console.log(clientTransformer.phone);
        return this.responsehandler.send(res, 200, "اطلاعات پروفایل کاربر در دسترس است.", clientTransformer);
    }
    async disableUpdateStatus(item_id, req, res) {
        const query = {
            client_id: req.user.id,
            item_id: Number(item_id),
            installed_version_type: InstalledVersionTypes_1.default.direct,
        };
        console.log("*** disable_update ***");
        console.log(query);
        await this.clientService.disableUpdateStatus(query);
        return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
    async disableUpdateStatusMain(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** disable_update: Main ***");
        console.log(query);
        await this.clientService.disableUpdateStatus(query);
        return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
    async update(updateClientDto, request, response) {
        updateClientDto.id = request.user.id;
        const result = await this.clientService.update(updateClientDto);
        if (!result) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.transform(result.client);
        return this.responsehandler.send(response, 200, "تکمیل ثبت نام با موفقیت انجام شد.", transformer);
    }
    async updateClienProfile(body, request, response, file) {
        console.log({ file });
        body.client_id = request.user.id;
        body.avatar = file ? file.filename : null;
        console.log("*** updateClienProfile ***");
        console.log(body);
        const result = await this.clientService.updateClienProfile(body);
        if (!result) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.transform(result.client);
        return this.responsehandler.send(response, 200, "بروزرسانی پروفایل با موفقیت انجام شد.", transformer);
    }
    async saveGif(body, request, response, file) {
        body.client_id = request.user.id;
        body.file = file.filename;
        console.log("*** Save Gif ***");
        console.log(body);
        const result = await this.clientService.saveGif(body);
        if (!result) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.gifTransformer(result.result);
        return this.responsehandler.send(response, 201, "گیف موردنظر با موفقیت ذخیره شد.", transformer);
    }
    async findMyChats(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Client Gifs ***");
        console.log(query);
        const result = await this.clientService.getClientGifList(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.gifCollection(result.result);
        return this.responsehandler.send(res, 200, "لیست گیف های کاربر در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "دریافت اطلاعات پروفایل کاربر",
        description: " اگر کلاینت درخواست مشاور شدن ثبت نکرده باشد  فیلد   \n \n  estate_agent_info \n \n برابر \n \n null \n \n میباشد و در صورتیکه درخواست ثبت شده باشد بر اساس مدل مشخص شده در ریسپانس دریافت میشود",
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOkResponse)({
        description: "دریافت اطلاعات پروفایل کاربر با موفقیت انجام شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "دریافت اطلاعات پروفایل کاربر با موفقیت انجام شد",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        provider_id: { type: "integer", example: 1 },
                        name: { type: "string" },
                        surname: { type: "string" },
                        phone: { type: "string" },
                        user_name: { type: "string" },
                        email: { type: "string" },
                        has_update: { type: "boolean", example: false },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        user_key: { type: "string" },
                        referral_code: { type: "string" },
                        province: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                        city: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: BadRequestSchema_1.default,
        description: "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(BadRequestSchema_1.default),
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "خطا. احزار هویت انجام نشده است",
        type: UnAuthorizedSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(UnAuthorizedSchema_1.default),
        },
    }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: "خطا. اجازه ادامه کار را ندارید.",
        type: ForbiddenSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(ForbiddenSchema_1.default),
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "خطا. آدرس موردنظر یافت نشد",
        type: NotFoundSchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(NotFoundSchema_1.default),
        },
    }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: "خطا. مقادیر ارسالی اشتباه هستند. در فیلد مسیج مقادیر اشتباه قرار دارند.",
        type: UnProcessableEntitySchema_1.default,
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(UnProcessableEntitySchema_1.default),
        },
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "clientInfo", null);
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
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت آپدیت کلاینت" }),
    (0, common_1.Patch)("disable_update/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "disableUpdateStatus", null);
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
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت آپدیت کلاینت - اصلی" }),
    (0, common_1.Patch)("disable_update_main"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disbale_update_status_1.DisableUpdateStatus, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "disableUpdateStatusMain", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "تکمیل ثبت نام با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "تکمیل ثبت نام با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        provider_id: { type: "integer", example: 1 },
                        name: { type: "string" },
                        surname: { type: "string" },
                        phone: { type: "string" },
                        user_name: { type: "string" },
                        email: { type: "string" },
                        has_update: { type: "boolean", example: false },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        user_key: { type: "string" },
                        province: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                        city: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: "تکمیل ثبت نام" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: update_client_dto_1.UpdateClientDto }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_client_dto_1.UpdateClientDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "بروزرسانی پروفایل با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "بروزرسانی پروفایل با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        provider_id: { type: "integer", example: 1 },
                        name: { type: "string" },
                        surname: { type: "string" },
                        phone: { type: "string" },
                        user_name: { type: "string" },
                        email: { type: "string" },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        user_key: { type: "string" },
                        referral_code: { type: "string" },
                        province: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                        city: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, common_1.Patch)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "بروزرسانی پروفایل" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("avatar", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/clients/avatars",
            filename(req, file, callback) {
                console.log({ file });
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    }), check_file_middleware_1.CheckFileMiddleware),
    (0, swagger_1.ApiBody)({ type: update_profile_dto_1.UpdateClienProfiletDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({ fileIsRequired: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateClienProfiletDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "updateClienProfile", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "گیف موردنظر با موفقیت ذخیره شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "گیف موردنظر با موفقیت ذخیره شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/gif/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(8).toString("hex").toLocaleUpperCase();
                const extension = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${uniqueCode}${extension}`);
            },
        }),
    })),
    (0, common_1.Post)("gif"),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره گیف" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: save_gif_client_dto_1.SaveGifClientDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_gif_client_dto_1.SaveGifClientDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "saveGif", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست گیف های کاربر در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست گیف های کاربر در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    file: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست گیف های من" }),
    (0, common_1.Get)("gif"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findMyChats", null);
ClientController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/client"),
    (0, common_1.Controller)("v2/client"),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        Transformer_1.default])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map