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
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const swagger_1 = require("@nestjs/swagger");
const BadRequestSchema_1 = require("../../../../commons/contracts/swaggerDefinations/BadRequestSchema");
const InternalServerErrorSchema_1 = require("../../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const create_operator_real_estate_agent_1 = require("./dto/create-operator-real-estate-agent");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const Transformer_2 = require("../../reports/admin/Transformer");
const Client_Reports_Pagination_dto_1 = require("./dto/Client-Reports-Pagination.dto");
const transformer_1 = require("../../prizes/app/transformer");
const Transformer_3 = require("../../real-estate-ads/admin/Transformer");
let ClientController = class ClientController {
    constructor(clientService, reportsTransformer, prizesTransformer, realEstateAdsTransformer) {
        this.clientService = clientService;
        this.reportsTransformer = reportsTransformer;
        this.prizesTransformer = prizesTransformer;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
        this.responsehandler = new httpResponsehandler_1.HttpResponsehandler();
        this.clientTransformer = new Transformer_1.default();
    }
    async findOne(client_id, req, res) {
        console.log("Get Clients: ADMIN");
        console.log("ip_address: ", req.ip_address);
        const client = await this.clientService.findOneByID(client_id);
        if (!client) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        const clientTransformer = this.clientTransformer.transform(client);
        return this.responsehandler.send(res, 200, "اطلاعات پروفایل کاربر در دسترس است.", clientTransformer);
    }
    async clientList(queryDto, request, response) {
        const result = await this.clientService.findAll(queryDto);
        const clientTransformer = this.clientTransformer.collection(result.clients);
        return this.responsehandler.send(response, 200, "لیست کاربران پنل در دسترس است.", {
            data: clientTransformer,
            metadata: result.metadata,
        });
    }
    async getPublicOperators(queryDto, request, response) {
        const result = await this.clientService.getPublicOperators(queryDto);
        const clientTransformer = this.clientTransformer.collection(result.clients);
        return this.responsehandler.send(response, 200, "لیست کاربران پنل در دسترس است.", {
            data: clientTransformer,
            metadata: result.metadata,
        });
    }
    async saveNewPublicOperators(body, request, response) {
        body.user_id = request.user.id;
        console.log("*** Create Operator RealEstate Agent Dto ***");
        console.log(body);
        const result = await this.clientService.saveNewPublicOperators(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. امکان اضافه کردن نقش جدید به کاربر فراهم نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const clientTransformer = this.clientTransformer.transform(result.client);
        return this.responsehandler.send(response, result.status, "لیست اپراتور های مشاوران املاک در دسترس است.", clientTransformer);
    }
    async deletePublicOperators(client_id, request, response) {
        const body = {
            user_id: request.user.id,
            client_id,
        };
        console.log("*** DeleteOperatorRealEstateAgentDto ***");
        console.log(body);
        const result = await this.clientService.deletePublicOperator(body);
        console.log(result.status);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کلاینت مورد نظر به دسترسی اپراتوی مشاوران املاک را ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(response, 200, "حذف اپراتور با موفقیت انجام شد.");
    }
    async generateKeyForClients(request, response) {
        console.log("*** generateKeyForClients ***");
        await this.clientService.generateKeyForClients(request.user.id);
        return this.responsehandler.send(response, 200, "کلیدها ایجاد شدند");
    }
    async getAllReports(query, req, res) {
        console.log("*** Get Client reports ***");
        console.log(query);
        const body = {
            client_id: query.client_id,
            page: query.page,
            per_page: query.per_page,
            type: query.type,
        };
        const result = await this.clientService.getAllReports(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.reportsTransformer.collection(result.list);
        return this.responsehandler.send(res, 200, "لیست گزارشات ارسال در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async getAllPrizes(client_id, query, req, res) {
        console.log("*** Get Client Prizes ***");
        const body = {
            client_id,
            page: query.page,
            per_page: query.per_page,
        };
        console.log({ body });
        const result = await this.clientService.getUserPrizes(body);
        if (result.result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.prizesTransformer.collection(result.result.prizes);
        return this.responsehandler.send(res, 200, "لیست جوایز در دسترس است.", {
            data: transformer,
            metadata: result.result.metadata,
        });
    }
    async getHistoryOfScores(client_id, query, req, res) {
        query.user_id = req.user.id;
        console.log("*** Get HistoryOfScores: ADMIN ***");
        const body = {
            client_id,
            page: query.page,
            per_page: query.per_page,
        };
        console.log({ body });
        const result = await this.clientService.getHistoryOfScores(body);
        const transformer = this.prizesTransformer.historyOfScorCollection(result.result.history);
        return this.responsehandler.send(res, 200, "لیست امتیاز ها  در دسترس است.", {
            total_score: result.result.total_score,
            prizes: transformer,
            metadata: result.result.metadata,
        });
    }
    async findAds(client_id, query, req, res) {
        query.user_id = client_id;
        const result = await this.clientService.findAds(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.collectionAdList(result.result);
        return this.responsehandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
};
__decorate([
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
                        id: { type: "integer" },
                        name: { type: "string" },
                        surname: { type: "string" },
                        phone: { type: "string" },
                        user_name: { type: "string" },
                        email: { type: "string" },
                        avatar: { type: "string" },
                        token: { type: "string" },
                        created_at: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت اطلاعات پروفایل کاربر" }),
    (0, common_1.Get)("/info/:client_id"),
    __param(0, (0, common_1.Param)("client_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
                },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                    phone: { type: "string" },
                                    user_name: { type: "string" },
                                    email: { type: "string" },
                                    avatar: { type: "string" },
                                    token: { type: "string" },
                                    created_at: { type: "string" },
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
    (0, swagger_1.ApiBadRequestResponse)({
        type: BadRequestSchema_1.default,
        description: "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    (0, common_1.Get)("/list"),
    (0, swagger_1.ApiOperation)({ summary: "لیست کلاینت ها  " }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "clientList", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
                },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    name: { type: "string" },
                                    surname: { type: "string" },
                                    phone: { type: "string" },
                                    user_name: { type: "string" },
                                    email: { type: "string" },
                                    avatar: { type: "string" },
                                    token: { type: "string" },
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
    (0, common_1.Get)("/operators/real_estate_agents"),
    (0, swagger_1.ApiOperation)({ summary: "لیست  اپراتورهای عمومی املاک" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getPublicOperators", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: ".تکمیل ثبت نام با موفقیت بروزرسانی شد",
                },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        surname: { type: "string" },
                        phone: { type: "string" },
                        user_name: { type: "string" },
                        email: { type: "string" },
                        avatar: { type: "string" },
                        token: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, common_1.Post)("/operators/real_estate_agents"),
    (0, swagger_1.ApiOperation)({ summary: "تعیین اپراتور عمومی -  مشاوراملاک" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_operator_real_estate_agent_1.CreateOperatorRealEstateAgentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "saveNewPublicOperators", null);
__decorate([
    (0, common_1.Delete)("/operators/real_estate_agents/:client_id"),
    (0, swagger_1.ApiOperation)({ summary: "حذف اپراتور عمومی -  مشاوراملاک" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)("client_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "deletePublicOperators", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "generateKeyForClients", null);
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
                                    type: { type: "string" },
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
    (0, common_1.Get)("reports"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Client_Reports_Pagination_dto_1.ClientReportsPaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getAllReports", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست جوایز در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست جوایز در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        total_score: { type: "integer", example: 50 },
                        prizes: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    point: { type: "integer", example: 1 },
                                    thumbnail: { type: "string" },
                                    coupon: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست جوایز کاربر " }),
    (0, common_1.Get)("prizes/:client_id"),
    __param(0, (0, common_1.Param)("client_id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getAllPrizes", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست امتیاز ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست امتیاز ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        total_score: { type: "integer", example: 50 },
                        prizes: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    title: { type: "string" },
                                    score: { type: "integer", example: 1 },
                                    action: { type: "string", example: "increase, decrease" },
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
    (0, swagger_1.ApiOperation)({ summary: "تاریخچه امتیازات " }),
    (0, common_1.Get)("/prizes/history/:client_id"),
    __param(0, (0, common_1.Param)("client_id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getHistoryOfScores", null);
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
    (0, common_1.Get)("/ads/:client_id"),
    __param(0, (0, common_1.Param)("client_id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findAds", null);
ClientController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-clients"),
    (0, common_1.Controller)("v1/admin/clients"),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        Transformer_2.default,
        transformer_1.default,
        Transformer_3.default])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map