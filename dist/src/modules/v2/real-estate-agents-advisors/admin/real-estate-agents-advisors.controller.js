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
exports.RealEstateAgentsAdvisorsController = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_advisors_service_1 = require("./real-estate-agents-advisors.service");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("../../client/app/Transformer");
const get_real_estate_agents_advisors_dto_1 = require("./dto/get-real-estate-agents-advisors.dto");
const Transformer_2 = require("./Transformer");
const get_advisor_comments__dto_1 = require("./dto/get-advisor-comments..dto");
const change_status_real_estate_agents_advisors_dto_1 = require("./dto/change-status-real-estate-agents-advisors.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let RealEstateAgentsAdvisorsController = class RealEstateAgentsAdvisorsController {
    constructor(responseHandler, realEstateAdvisorTransformer, clientTransformer, realEstateAgentsAdvisorsService) {
        this.responseHandler = responseHandler;
        this.realEstateAdvisorTransformer = realEstateAdvisorTransformer;
        this.clientTransformer = clientTransformer;
        this.realEstateAgentsAdvisorsService = realEstateAgentsAdvisorsService;
    }
    async findAll(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** RealEstateAgentsAdvisor: findAll ***");
        console.log({ query });
        const result = await this.realEstateAgentsAdvisorsService.findAll(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کارشناس درخواست موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "لیست کارشناس های کارشناس در دسترس است.", result.advisors);
    }
    async changeStatus(body, req, res) {
        console.log("*** RealEstateAgentsAdvisor Comment: change status ***");
        console.log(body);
        body.client_id = req.user.id;
        const result = await this.realEstateAgentsAdvisorsService.changeStatus(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . کارشناس مورد نظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت کارشناس با موفقیت تغییر کرد.");
    }
    async findComments(query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get Advisor Comments ***");
        console.log(query);
        const result = await this.realEstateAgentsAdvisorsService.findComments(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "لیست نظرات ثبت شده در دسترس است.", {
            data: result.result,
            metadata: result.metadata,
        });
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کارشناس های کارشناس در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کارشناس های کارشناس در دسترس است.",
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
                            validate_phone: { type: "boolean", default: false },
                            avatar: { type: "string" },
                            score: { type: "integer", example: 0 },
                            biography: { type: "string" },
                            comment_visibility: { type: "boolean" },
                            number_of_ads: { type: "integer", example: 0 },
                            total_customer: { type: "integer", example: 0 },
                            status: { type: "string", example: "active, inactive" },
                            agent_info: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت لیست کارشناس های یک مشاور املاک" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_real_estate_agents_advisors_dto_1.GetRealEstateAgentsAdvisorsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت کارشناس با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت کارشناس با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت کامنت کارشناس ها" }),
    (0, common_1.Patch)("comments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_real_estate_agents_advisors_dto_1.ChangeStatusAdvisorsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست نظرات ثبت شده در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست نظرات ثبت شده در دسترس است.",
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
                                    comment: { type: "String" },
                                    score: { type: "number", example: 4 },
                                    status: {
                                        type: "string",
                                        example: "pending, approved, rejected",
                                    },
                                    client: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "String" },
                                        },
                                    },
                                    created_at: {
                                        type: "object",
                                        properties: {
                                            day: { type: "integer" },
                                            month: { type: "string" },
                                            year: { type: "integer" },
                                        },
                                    },
                                },
                            },
                        },
                        statistics: {
                            type: "object",
                            properties: {
                                total_comments: { type: "number", example: 1 },
                                total_score: { type: "number", example: 2 },
                            },
                        },
                        comment_submitted: { type: "boolean", example: true },
                        user_comment: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: "1" },
                                agent_id: { type: "number", example: 1 },
                                comment: { type: "String" },
                                score: { type: "number", example: 4 },
                                status: {
                                    type: "string",
                                    example: "pending, approved, rejected",
                                },
                                client: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        name: { type: "String" },
                                    },
                                },
                                created_at: {
                                    type: "object",
                                    properties: {
                                        day: { type: "integer" },
                                        month: { type: "string" },
                                        year: { type: "integer" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست نظرات کارشناس ها" }),
    (0, common_1.Get)("comments"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_advisor_comments__dto_1.GetAdvisorCommentsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsAdvisorsController.prototype, "findComments", null);
RealEstateAgentsAdvisorsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin/real-estate-agents-advisors"),
    (0, common_1.Controller)("v2/admin/real-estate-agents-advisors"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        Transformer_2.default,
        Transformer_1.default,
        real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService])
], RealEstateAgentsAdvisorsController);
exports.RealEstateAgentsAdvisorsController = RealEstateAgentsAdvisorsController;
//# sourceMappingURL=real-estate-agents-advisors.controller.js.map