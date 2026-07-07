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
const update_real_estate_agents_comment_dto_1 = require("./dto/update-real-estate-agents-comment.dto");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const Transformer_1 = require("./Transformer");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const change_status_dto_1 = require("./dto/change-status.dto");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const get_list__dto_copy_1 = require("./dto/get-list..dto copy");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let RealEstateAgentsCommentsController = class RealEstateAgentsCommentsController {
    constructor(responseHandler, agentsCommentsService, agentsCommentsTransformer) {
        this.responseHandler = responseHandler;
        this.agentsCommentsService = agentsCommentsService;
        this.agentsCommentsTransformer = agentsCommentsTransformer;
    }
    async findAllComments(query, req, res) {
        query.user_id = req.user.id;
        const result = await this.agentsCommentsService.findAllComments(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.agentsCommentsTransformer.collection(result.result);
        return this.responseHandler.send(res, 200, "لیست نظرات ثبت شده در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async changeStatus(body, req, res) {
        console.log("ChangeStatusCommentAgentDto");
        body.user_id = req.user.id;
        console.log(body);
        const result = await this.agentsCommentsService.changeStatus(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کامنت موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "تغییر وضعیت انجام شد.");
    }
    findOne(id) {
        return this.agentsCommentsService.findOne(+id);
    }
    update(id, updateRealEstateAgentsCommentDto) {
        return this.agentsCommentsService.update(+id, updateRealEstateAgentsCommentDto);
    }
    remove(id) {
        return this.agentsCommentsService.remove(+id);
    }
};
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
                                        example: "pending, approved, active, rejected",
                                    },
                                    client: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "String" },
                                        },
                                    },
                                    real_estate_agent: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "String" },
                                            avatar: { type: "String" },
                                        },
                                    },
                                    created_at: { type: "String", example: "" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست نظرات مشاوران املاک" }),
    (0, common_2.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_list__dto_copy_1.GetCommentsListForRealEstateAgentDto, Object, Object]),
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
    (0, common_2.Post)("change_status"),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.Request)()),
    __param(2, (0, common_2.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_dto_1.ChangeStatusCommentAgentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsCommentsController.prototype, "changeStatus", null);
__decorate([
    __param(0, (0, common_2.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RealEstateAgentsCommentsController.prototype, "findOne", null);
__decorate([
    __param(0, (0, common_2.Param)("id")),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_real_estate_agents_comment_dto_1.UpdateRealEstateAgentsCommentDto]),
    __metadata("design:returntype", void 0)
], RealEstateAgentsCommentsController.prototype, "update", null);
__decorate([
    __param(0, (0, common_2.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RealEstateAgentsCommentsController.prototype, "remove", null);
RealEstateAgentsCommentsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-real-estate-agents-comments"),
    (0, common_2.Controller)("v2/admin/real-estate-agents-comments"),
    __metadata("design:paramtypes", [httpResponsehandler_1.HttpResponsehandler,
        real_estate_agents_comments_service_1.RealEstateAgentsCommentsService,
        Transformer_1.default])
], RealEstateAgentsCommentsController);
exports.RealEstateAgentsCommentsController = RealEstateAgentsCommentsController;
//# sourceMappingURL=real-estate-agents-comments.controller.js.map