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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const report_service_1 = require("./report.service");
const Transformer_1 = require("./Transformer");
const get_reports_violations_dto_1 = require("./dto/get-reports-violations.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let ReportController = class ReportController {
    constructor(responseHandler, reportBugsService, transformer) {
        this.responseHandler = responseHandler;
        this.reportBugsService = reportBugsService;
        this.transformer = transformer;
    }
    async getAll(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Report Bug: ADMIN ***");
        console.log(query);
        const result = await this.reportBugsService.getAll(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.transformer.collection(result.list);
        return this.responseHandler.send(res, 200, "لیست گزارشات ارسال در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async single(id, req, res) {
        const query = {
            client_id: req.user.id,
            id,
        };
        console.log("*** single Report Bug: ADMIN ***");
        console.log(query);
        const result = await this.reportBugsService.single(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.transformer.transform(result.item);
        return this.responseHandler.send(res, 200, "جزییات گزارشات ارسالی در دسترس است.", transformer);
    }
    async getAllViolations(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Report Violations: ADMIN ***");
        console.log(query);
        const result = await this.reportBugsService.getAllViolations(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "لیست گزارشات ارسالی در دسترس است.", {
            data: result.transformer,
            metadata: result.metadata,
        });
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست گزارشات ارسال در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست گزارشات ارسال در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    content: { type: "string" },
                                    image: { type: "string" },
                                    voice: { type: "string" },
                                    created_at: { type: "string" },
                                    client: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            name: { type: "integer", example: 1 },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت گزارشات ارسالی" }),
    (0, common_1.Get)("bugs"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جزییات گزارشات ارسالی در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "جزییات گزارشات ارسالی در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        content: { type: "string" },
                        image: { type: "string" },
                        voice: { type: "string" },
                        created_at: { type: "string" },
                        client: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                name: { type: "integer", example: 1 },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "جزییات گزارشات ارسالی" }),
    (0, common_1.Get)("/bugs/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "single", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست گزارشات ارسالی در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست گزارشات ارسالی در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    description: { type: "string" },
                                    type: { type: "string" },
                                    created_at: { type: "string" },
                                    client: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            name: { type: "integer", example: 1 },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت گزارشات محتوای نامناسب" }),
    (0, common_1.Get)("violations"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_reports_violations_dto_1.GetReportsViolationsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getAllViolations", null);
ReportController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin/reports"),
    (0, common_1.Controller)("v2/admin/reports"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        report_service_1.ReportService,
        Transformer_1.default])
], ReportController);
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map