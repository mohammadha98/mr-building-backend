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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_auth_dto_1 = require("./dto/register-auth.dto");
const verify_auth_dto_1 = require("./dto/verify-auth.dto");
const codeGenerator_1 = require("../../services/codeGenerator");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const swagger_1 = require("@nestjs/swagger");
const badRequestErrorHandler_1 = require("../../services/httpResponseHandler/badRequestErrorHandler");
const BadRequestSchema_1 = require("../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const InternalServerErrorSchema_1 = require("../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const NotFoundSchema_1 = require("../../../commons/contracts/swaggerDefinations/NotFoundSchema");
const UnProcessableEntitySchema_1 = require("../../../commons/contracts/swaggerDefinations/UnProcessableEntitySchema");
const nestjs_form_data_1 = require("nestjs-form-data");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const Transformer_1 = require("../client/app/Transformer");
let AuthController = class AuthController {
    constructor(authService, clientTransformer, responseHandler) {
        this.authService = authService;
        this.clientTransformer = clientTransformer;
        this.responseHandler = responseHandler;
    }
    async register(RegisterAuthDto, req, res) {
        console.log("*** register ***");
        console.log({ RegisterAuthDto });
        const code = (0, codeGenerator_1.default)();
        await this.authService.create(RegisterAuthDto.phone, code);
        return this.responseHandler.send(res, common_1.HttpStatus.OK, "کد تایید ارسال شد.", {
            code,
        });
    }
    async verify(verifyAuthDto, res) {
        console.log("Verify Code");
        console.log({ Body: common_1.Body });
        const result = await this.authService.verify(verifyAuthDto);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کد ارسالی صحیح نمیباشد.");
        }
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.clientTransformer.transform(result.client);
        return this.responseHandler.send(res, result.status, result.message, {
            next_step: result.next_step,
            client_info: transformer,
        });
    }
    async addAllUserToDefaultChannel(res) {
        console.log("Verify addAllUserToDefaultChannel");
        await this.authService.addAllUserToDefaultChannel();
        return this.responseHandler.send(res, 200, "اضافه شدن");
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "کد تایید ارسال شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "number", example: 200 },
                message: { type: "string", example: "کد تایید ارسال شد." },
                error: { type: "string", example: "" },
                data: {
                    type: "object",
                    properties: {
                        code: { type: "string", example: "1234" },
                    },
                },
            },
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
    (0, swagger_1.ApiOperation)({ summary: "ثبت نام شماره کاربران" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiBody)({ type: register_auth_dto_1.RegisterAuthDto }),
    (0, common_1.Post)("/register"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_auth_dto_1.RegisterAuthDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "کد ارسالی تایید شد. با موفقیت وارد شدید.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "کد ارسالی تایید شد. با موفقیت وارد شدید.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        next_step: {
                            type: "string",
                            example: "home, complete_registration",
                        },
                        client_info: {
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
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "ثبت نام با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "ثبت نام با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        next_step: {
                            type: "string",
                            example: "home, complete_registration",
                        },
                        client_info: {
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
    (0, common_1.Post)("/verify"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: verify_auth_dto_1.VerifyAuthDto }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_auth_dto_1.VerifyAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("addAllUserToDefaultChannel"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "addAllUserToDefaultChannel", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("v1/register"),
    (0, common_1.Controller)("v1/auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map