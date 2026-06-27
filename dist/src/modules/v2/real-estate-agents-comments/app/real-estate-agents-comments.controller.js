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
const real_estate_agents_comments_service_1 = require("./real-estate-agents-comments.service");
const create_real_estate_agents_comment_dto_1 = require("./dto/create-real-estate-agents-comment.dto");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const Transformer_1 = require("./Transformer");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const get_list__dto_1 = require("../../real-estate-agents/app/dto/get-list..dto");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const update_real_estate_agents_comment_dto_1 = require("./dto/update-real-estate-agents-comment.dto");
let RealEstateAgentsCommentsController = class RealEstateAgentsCommentsController {
    constructor(responseHandler, agentsCommentsService, agentsCommentsTransformer) {
        this.responseHandler = responseHandler;
        this.agentsCommentsService = agentsCommentsService;
        this.agentsCommentsTransformer = agentsCommentsTransformer;
    }
    async create(body, req, res) {
        body.client_id = req.user.id;
        const result = await this.agentsCommentsService.storeComment(body);
        if (result.status === 200) {
            const transformer = this.agentsCommentsTransformer.transform(result.result);
            return this.responseHandler.send(res, 200, "نظر شما در سیستم موجود میباشد.", transformer);
        }
        else if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. مشاور املاک موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.agentsCommentsTransformer.transform(result.result);
        return this.responseHandler.send(res, 201, "لیست آیتم های فرم آگهی املاک در دسترس است.", transformer);
    }
    async findComments(query, req, res) {
        query.client_id = req.user.id;
        const result = await this.agentsCommentsService.findComments(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.agentsCommentsTransformer.collection(result.result);
        const user_comment = this.agentsCommentsTransformer.transform(result.user_comment);
        return this.responseHandler.send(res, 200, "لیست نظرات ثبت شده در دسترس است.", {
            data: transformer,
            statistics: result.statistics,
            comment_submitted: result.comment_submitted,
            user_comment,
            metadata: result.metadata,
        });
    }
    async deleteCommentForRealEstate(query) {
        return this.agentsCommentsService.deleteCommentForRealEstate(query);
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "نظر شما در سیستم موجود میباشد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "نظر شما در سیستم موجود میباشد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: "1" },
                        agent_id: { type: "number", example: 1 },
                        comment: { type: "String" },
                        score: { type: "number", example: 4 },
                        status: { type: "string", example: "pending, approved, rejected" },
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
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "کامنت با موفقیت ثبت شد. بعد از تایید منتشر میشود.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "کامنت با موفقیت ثبت شد. بعد از تایید منتشر میشود.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: "1" },
                        agent_id: { type: "number", example: 1 },
                        comment: { type: "String" },
                        score: { type: "number", example: 4 },
                        status: { type: "string", example: "pending, approved, rejected" },
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
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ثبت نظر" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_2.Post)(),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_agents_comment_dto_1.CreateRealEstateAgentsCommentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "create", null);
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
    (0, swagger_1.ApiOperation)({ summary: "لیست نظرات مشاور املاک" }),
    (0, common_2.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_list__dto_1.GetCommentsListForRealEstateAgentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "findComments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف نظر  مشاور املاک" }),
    (0, common_2.Delete)("/comments"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_real_estate_agents_comment_dto_1.DeleteCommentDto]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "deleteCommentForRealEstate", null);
RealEstateAgentsCommentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-real-estate-agents-comments"),
    (0, common_2.Controller)("v2/app/real-estate-agents-comments"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        real_estate_agents_comments_service_1.RealEstateAgentsCommentsService,
        Transformer_1.default])
], RealEstateAgentsCommentsController);
exports.RealEstateAgentsCommentsController = RealEstateAgentsCommentsController;
//# sourceMappingURL=real-estate-agents-comments.controller.js.map