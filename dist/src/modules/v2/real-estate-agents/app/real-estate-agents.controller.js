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
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const real_estate_agents_service_1 = require("./real-estate-agents.service");
const create_real_estate_agent_dto_1 = require("./dto/create-real-estate-agent.dto");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const list_real_estate_agent_dto_1 = require("./dto/list-real-estate-agent.dto");
const Transformer_1 = require("./Transformer");
const check_avatar_middleware_1 = require("./dto/check-avatar.middleware");
const check_lisence_middleware_1 = require("./dto/check-lisence.middleware");
const search_real_estate_agents_dto_1 = require("./dto/search.real-estate-agents.dto");
let RealEstateAgentsController = class RealEstateAgentsController {
    constructor(realEstateAgentsService, realEstateAgentsTransFormer, responseHandler) {
        this.realEstateAgentsService = realEstateAgentsService;
        this.realEstateAgentsTransFormer = realEstateAgentsTransFormer;
        this.responseHandler = responseHandler;
    }
    async create(createDto, req, res, files) {
        const { avatar, license } = files;
        const avatarName = avatar ? avatar[0].filename : null;
        const licenseName = license ? license[0].filename : null;
        createDto.user_id = req.user.id;
        console.log("*** Store Request: RealEstateAgent ***");
        console.log(createDto);
        console.log({ avatarName });
        console.log({ licenseName });
        const result = await this.realEstateAgentsService.storeRequest(createDto, avatarName, licenseName);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        const transform = this.realEstateAgentsTransFormer.transform(result.response);
        return this.responseHandler.send(res, 201, "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.", transform);
    }
    async listOfRealEstateAgents(query, req, res) {
        const client_id = req.user.id;
        console.log("listOfRealEstateAgents");
        console.log({ query });
        const result = await this.realEstateAgentsService.listOfRealEstateAgents(query, client_id);
        const transformer = this.realEstateAgentsTransFormer.collection(result.list);
        return this.responseHandler.send(res, 200, "لیست مشاوران املاک در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async search(query, res) {
        console.log("search RealEstateAgents");
        console.log({ query });
        const result = await this.realEstateAgentsService.search(query);
        const transformer = this.realEstateAgentsTransFormer.collection(result.list);
        return this.responseHandler.send(res, 200, "لیست مشاوران املاک در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async GetRealEstateAgentInfo(agent_id, req, res) {
        const client_id = req.user.id;
        const result = await this.realEstateAgentsService.GetRealEstateAgentInfo(agent_id, client_id);
        const transformer = this.realEstateAgentsTransFormer.transform(result.list[0]);
        return this.responseHandler.send(res, 200, "جزییات مشاوران املاک در دسترس است.", transformer);
    }
    async getActiveRealEstates(query) {
        console.log("getActiveRealEstates");
        console.log({ query });
        return this.realEstateAgentsService.getActiveRealEstates(query);
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست شما با موفقیت ثبت شد. بعد تایید میتوانید از امکانات بخش موردنظر استفاده کنید.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        client_id: { type: "integer", example: 1 },
                        name: { type: "string" },
                        phone: { type: "string" },
                        validate_phone: { type: "boolean", default: false },
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
                        channel: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                key: { type: "string" },
                                name: { type: "string" },
                                profile: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ثبت درخواست مشاور شدن" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: "avatar", maxCount: 1 },
        { name: "license", maxCount: 1 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/estate_agents",
            filename: (req, file, callback) => {
                const extension = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}${extension}`);
            },
        }),
    }), check_avatar_middleware_1.CheckAvatarMiddleware, check_lisence_middleware_1.CheckLicenseMiddleware),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: create_real_estate_agent_dto_1.CreateRealEstateAgentDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_agent_dto_1.CreateRealEstateAgentDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "create", null);
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
                                    phone: { type: "string" },
                                    validate_phone: { type: "boolean", default: false },
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
                                    channel: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            key: { type: "string" },
                                            name: { type: "string" },
                                            profile: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست مشاوران املاک" }),
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
                                    channel: {
                                        type: "object",
                                        properties: {
                                            id: { type: "number" },
                                            key: { type: "string" },
                                            name: { type: "string" },
                                            profile: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "سرچ مشاور املاک" }),
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_real_estate_agents_dto_1.SearchForRealEstateAgentDto, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "search", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "جزییات مشاوران املاک در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "جزییات مشاوران املاک در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        client_id: { type: "integer", example: 1 },
                        name: { type: "string" },
                        phone: { type: "string" },
                        validate_phone: { type: "boolean", default: false },
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
                        channel: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                key: { type: "string" },
                                name: { type: "string" },
                                profile: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "جزییات مشاور املاک" }),
    (0, common_1.Get)("info/:agent_id"),
    __param(0, (0, common_1.Param)("agent_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "GetRealEstateAgentInfo", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "دریافت فعال ترین مشاوران املاک (بر اساس انتشار انتشار آگهی)",
    }),
    (0, common_1.Get)("active"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_real_estate_agent_dto_1.ListRealEstateAgentDto]),
    __metadata("design:returntype", Promise)
], RealEstateAgentsController.prototype, "getActiveRealEstates", null);
RealEstateAgentsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-real-estate-agents"),
    (0, common_1.Controller)("v2/app/real-estate-agents"),
    __metadata("design:paramtypes", [real_estate_agents_service_1.RealEstateAgentsService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], RealEstateAgentsController);
exports.RealEstateAgentsController = RealEstateAgentsController;
//# sourceMappingURL=real-estate-agents.controller.js.map