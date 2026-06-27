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
exports.ValidateClientsController = void 0;
const common_1 = require("@nestjs/common");
const validate_clients_service_1 = require("./validate-clients.service");
const create_validate_client_dto_1 = require("./dto/create-validate-client.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../jwt-auth/jwt-auth.guard");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const forbiddenErrorHandler_1 = require("../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const codeGenerator_1 = require("../../services/codeGenerator");
const verify_validate_client_dto_1 = require("./dto/verify-validate-client.dto");
const badRequestErrorHandler_1 = require("../../services/httpResponseHandler/badRequestErrorHandler");
let ValidateClientsController = class ValidateClientsController {
    constructor(validateClientsService, responseHandler) {
        this.validateClientsService = validateClientsService;
        this.responseHandler = responseHandler;
    }
    async validatePhone(body, req, res) {
        body.client_id = req.user.id;
        body.code = (0, codeGenerator_1.default)();
        console.log("*** Validate Client Phone Number ***");
        console.log(body);
        const result = await this.validateClientsService.create(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "کد تایید ارسال شد.", {
            code: body.code,
        });
    }
    async VerifyValidatePhone(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** Verify: Validate Client Phone Number ***");
        console.log(body);
        const result = await this.validateClientsService.VerifyValidatePhone(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کد ارسالی صحیح نمیباشد.");
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "کد ارسالی تایید شد. شماره شما فعال گردید.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "کد تایید ارسال شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "کد تایید ارسال شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ثبت شماره و احراز هویت " }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_validate_client_dto_1.CreateValidateClientDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ValidateClientsController.prototype, "validatePhone", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "کد ارسالی تایید شد. شماره شما فعال گردید.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "کد ارسالی تایید شد. شماره شما فعال گردید.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "وریفای " }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("verify"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_validate_client_dto_1.VerifyCodeValidateClientDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ValidateClientsController.prototype, "VerifyValidatePhone", null);
ValidateClientsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-validate-clients"),
    (0, common_1.Controller)("v2/app/validate-clients"),
    __metadata("design:paramtypes", [validate_clients_service_1.ValidateClientsService,
        httpResponsehandler_1.HttpResponsehandler])
], ValidateClientsController);
exports.ValidateClientsController = ValidateClientsController;
//# sourceMappingURL=validate-clients.controller.js.map