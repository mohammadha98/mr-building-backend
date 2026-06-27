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
exports.RealEstateAgentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const real_estate_agents_service_1 = require("./real-estate-agents.service");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const list_real_estate_agent_dto_1 = require("./dto/list-real-estate-agent.dto");
const Transformer_1 = require("./Transformer");
const real_estate_change_change_status_dtop_1 = require("./dto/real-estate-change-change-status.dtop");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const Transformer_2 = require("../../real-estate-ads/admin/Transformer");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const Transformer_3 = require("../../real-estate-agents-comments/admin/Transformer");
const delete_real_estate_agents_advisors_dto_1 = require("../../real-estate-agents-advisors/app/dto/delete-real-estate-agents-advisors.dto");
let RealEstateAgentsController = class RealEstateAgentsController {
    constructor(realEstateAgentsService, realEstateAgentsTransFormer, responseHandler, realEstateAdsTransformer, agentsCommentsTransformer) {
        this.realEstateAgentsService = realEstateAgentsService;
        this.realEstateAgentsTransFormer = realEstateAgentsTransFormer;
        this.responseHandler = responseHandler;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
        this.agentsCommentsTransformer = agentsCommentsTransformer;
    }
    async listOfRealEstateAgents(query, req, res) {
        console.log("listOfRealEstateAgents: ADMIN");
        console.log("ip_address: ", req.ip_address);
        const result = await this.realEstateAgentsService.listOfRealEstateAgents(query);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.realEstateAgentsTransFormer.collection(result.list);
        return this.responseHandler.send(res, 200, "لیست مشاوران املاک در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async changeStatus(query, req, res) {
        query.user_id = req.user.id;
        const result = await this.realEstateAgentsService.changeStatus(query);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت با موفقیت تغییر کرد.", {
            status: result.client_status,
            license_status: result.license_status,
        });
    }
    async findAds(agent_id, query, req, res) {
        const result = await this.realEstateAgentsService.findAds(agent_id, query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.collectionAdList(result.result);
        return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async findAdvisors(agent_id, req, res) {
        console.log("*** RealEstateAgentsAdvisor: ADMIN ***");
        console.log({ agent_id });
        const result = await this.realEstateAgentsService.findAdvisors(agent_id);
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
    async findAdmins(agent_id, req, res) {
        console.log("*** RealEstateAgentsAdmin: ADMIN ***");
        console.log({ agent_id });
        const result = await this.realEstateAgentsService.findAdmins(agent_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. مشاور املاک موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "لیست ادمین های ادمین در دسترس است.", result.admins);
    }
    async findAllComments(agent_id, query, req, res) {
        query.user_id = req.user.id;
        const result = await this.realEstateAgentsService.findAllComments(agent_id, query);
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
    async removeAdvisorInRealEstate(body) {
        console.log("Remove Advisor In RealEstate");
        console.log({ Body: common_1.Body });
        return this.realEstateAgentsService.removeAdvisorInRealEstate(body);
    }
    async generateTrackingCode() {
        return await this.realEstateAgentsService.makeTrackingCode();
    }
    async CreateChannelForOldRealEstates_test() {
        return await this.realEstateAgentsService.CreateChannelForOldRealEstates_test();
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست مشاوران املاک در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست مشاوران املاک در دسترس است.",
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
                                    client_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    avatar: { type: "string" },
                                    license: { type: "string" },
                                    license_status: {
                                        type: "string",
                                        example: "pending || approved || rejected",
                                    },
                                    status: { type: "string", example: "active, inactive" },
                                    score: { type: "number", example: 0 },
                                    number_of_ads: { type: "number", example: 0 },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست مشاوران املاک " }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_real_estate_agent_dto_1.ListRealEstateAgentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "listOfRealEstateAgents", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "وضعیت با موفقیت تغییر کرد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "وضعیت با موفقیت تغییر کرد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        status: { type: "string", example: "active, inactive" },
                        license_status: {
                            type: "string",
                            example: "pending, approved, rejected",
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت" }),
    (0, common_1.Patch)("/change-status"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [real_estate_change_change_status_dtop_1.RealEstateAgentChangeStatusDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست آگهی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست آگهی ها در دسترس است.",
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
                                    type: {
                                        type: "String",
                                        example: "sale, presell, collaboration, rent",
                                    },
                                    title: { type: "String" },
                                    sale_price: { type: "String" },
                                    deposit_price: { type: "String" },
                                    rent_price: { type: "String" },
                                    prepaid_price: { type: "String" },
                                    status: {
                                        type: "String",
                                        example: "pending, rejected, approved, inactive, expired",
                                    },
                                    province: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    city: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            name: { type: "string" },
                                        },
                                    },
                                    area: { type: "String" },
                                    seller_type: { type: "String" },
                                    media: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number", example: 1 },
                                            file_name: { type: "string" },
                                            file_type: { type: "string", example: "image" },
                                            file_url: { type: "string" },
                                            sort_number: { type: "string" },
                                            priority: { type: "string", example: "primary" },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت آگهی ها" }),
    (0, common_1.Get)("/ads/:agent_id"),
    __param(0, (0, common_1.Param)("agent_id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "findAds", null);
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
                            number_of_ads: { type: "integer", example: 1 },
                            total_customers: { type: "integer", example: 1 },
                            score: { type: "integer", example: 1 },
                            biography: { type: "string" },
                            comment_visibility: { type: "boolean" },
                            avatar: { type: "string" },
                            status: { type: "string", example: "active, inactive" },
                            phone: { type: "string" },
                            validate_phone: { type: "boolean" },
                            client: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                    phone: { type: "string" },
                                },
                            },
                            real_estate_agent: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    score: { type: "integer" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت لیست کارشناس های یک مشاور املاک" }),
    (0, common_1.Get)("/advisors/:agent_id"),
    __param(0, (0, common_1.Param)("agent_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "findAdvisors", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست ادمین های ادمین در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست ادمین های ادمین در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            permissions: { type: "array", items: {} },
                            color: { type: "string" },
                            client: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                    phone: { type: "string" },
                                },
                            },
                            real_estate_agent: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    avatar: { type: "string" },
                                    number_of_ads: { type: "integer" },
                                    score: { type: "integer" },
                                    province: {
                                        type: "object",
                                        properties: {
                                            name: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت لیست ادمین های یک مشاور املاک" }),
    (0, common_1.Get)("/admin/:agent_id"),
    __param(0, (0, common_1.Param)("agent_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "findAdmins", null);
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
    (0, swagger_1.ApiOperation)({ summary: "لیست نظرات مشاور املاک" }),
    (0, common_1.Get)("/comments/:agent_id"),
    __param(0, (0, common_1.Param)("agent_id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "findAllComments", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "حذف کارشناس از مشاور املاکی" }),
    (0, common_1.Delete)("/comments/:agent_id"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_real_estate_agents_advisors_dto_1.DeleteRealEstateAgentsAdvisorsDto]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "removeAdvisorInRealEstate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "تست - ایجاد کد اختصاصی" }),
    (0, common_1.Get)("/tracking_code"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "generateTrackingCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "تست - ایجاد کانال برای مشاوران قدیمی" }),
    (0, common_1.Get)("/create-channel"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "CreateChannelForOldRealEstates_test", null);
RealEstateAgentsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-real-estate-agents"),
    (0, common_1.Controller)("v2/admin/real-estate-agents"),
    __metadata("design:paramtypes", [real_estate_agents_service_1.RealEstateAgentsService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_2.default,
        Transformer_3.default])
], RealEstateAgentsController);
exports.RealEstateAgentsController = RealEstateAgentsController;
//# sourceMappingURL=real-estate-agents.controller.js.map