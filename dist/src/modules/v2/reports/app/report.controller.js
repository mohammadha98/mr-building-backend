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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const create_report_bugs_dto_1 = require("./dto/create-report-bugs.dto");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const check_voice_middleware_1 = require("./dto/check-voice.middleware");
const check_image_middleware_1 = require("./dto/check-image.middleware");
const nestjs_form_data_1 = require("nestjs-form-data");
const create_report_violation_dto_1 = require("./dto/create-report-violation.dto");
let ReportsController = class ReportsController {
    constructor(responseHandler, reportBugsService) {
        this.responseHandler = responseHandler;
        this.reportBugsService = reportBugsService;
    }
    async storeBug(body, req, res, files) {
        body.client_id = req.user.id;
        const { image, voice } = files;
        body.image = image ? image[0].filename : null;
        body.voice = voice ? voice[0].filename : null;
        console.log("*** Create Report Bug Dto ***");
        console.log(body);
        const result = await this.reportBugsService.storeBug(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "درخواست شما با موفقیت ثبت شد.");
    }
    async storeViolation(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** Store Violation Report***");
        console.log(body);
        const result = await this.reportBugsService.storeViolation(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "درخواست شما با موفقیت ثبت شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست شما با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست شما با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ارسال باگ" }),
    (0, common_1.Post)("/bug"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_report_bugs_dto_1.CreateReportBugDto }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "image", maxCount: 1 },
        { name: "voice", maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/report_bugs/",
            filename: (req, file, callback) => {
                const extension = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}${extension}`);
            },
        }),
    }), check_image_middleware_1.CheckImageMiddleware, check_voice_middleware_1.CheckVoiceFileMiddleware),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_bugs_dto_1.CreateReportBugDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "storeBug", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست شما با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست شما با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ارسال محتوای نامناسب" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("/violations"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_violation_dto_1.CreateReportViolationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "storeViolation", null);
ReportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app/reports"),
    (0, common_1.Controller)("v2/app/reports"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        report_service_1.ReportsService])
], ReportsController);
exports.ReportsController = ReportsController;
//# sourceMappingURL=report.controller.js.map