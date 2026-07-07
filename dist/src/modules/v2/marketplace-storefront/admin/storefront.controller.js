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
exports.StorefrontController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const storefront_service_1 = require("./storefront.service");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const list_storefronts_dto_1 = require("./dto/list-storefronts.dto");
const Transformer_1 = require("./Transformer");
const storefront_change_status_dtop_1 = require("./dto/storefront-change-status.dtop");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const get_product_dto_1 = require("../app/dto/get-product.dto");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
let StorefrontController = class StorefrontController {
    constructor(storefrontService, storefrontTransFormer, responseHandler) {
        this.storefrontService = storefrontService;
        this.storefrontTransFormer = storefrontTransFormer;
        this.responseHandler = responseHandler;
    }
    async listOfStorefronts(query, res) {
        console.log("listOfStorefronts: APP");
        console.log({ query });
        const result = await this.storefrontService.listOfStorefronts(query);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.storefrontTransFormer.collection(result.list);
        return this.responseHandler.send(res, 200, "لیست فروشگاه ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async changeStatus(query, req, res) {
        query.user_id = req.user.id;
        const result = await this.storefrontService.changeStatus(query);
        if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 200, "وضعیت با موفقیت تغییر کرد.", {
            status: result.client_status,
            license_status: result.license_status,
        });
    }
    async findStorefrontProducts(body, req, res) {
        body.client_id = req.user.id;
        console.log("findStorefrontProducts");
        console.log(body);
        const result = await this.storefrontService.findStorefrontProducts(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. فروشگاه مورنظر یافت نشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transform = this.storefrontTransFormer.collectionProduct(result.list);
        return this.responseHandler.send(res, 200, "محصولات فروشگاه در دسترس است.", {
            data: transform,
            metadata: result.metadata,
        });
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست فروشگاه ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست فروشگاه  ها در دسترس است.",
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
                                    tracking_code: { type: "string" },
                                    client_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    description: { type: "string" },
                                    color: { type: "string" },
                                    avatar: { type: "string" },
                                    score: { type: "number", example: 0 },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست فروشگاه ها   " }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_storefronts_dto_1.ListStorefrontsDto, Object]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "listOfStorefronts", null);
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
    __metadata("design:paramtypes", [storefront_change_status_dtop_1.RealEstateAgentChangeStatusDto, Object, Object]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "changeStatus", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "محصولات فروشگاه در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "محصولات فروشگاه در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "string" },
                                    category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            title: { type: "string" },
                                        },
                                    },
                                    sub_category: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            title: { type: "string" },
                                        },
                                    },
                                    brand: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            title: { type: "string" },
                                        },
                                    },
                                    tracking_code: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    status: { type: "string", example: "active, inactive" },
                                    price: { type: "string" },
                                    unit_of_sales: { type: "string" },
                                    has_discount: { type: "boolean", default: false },
                                    discounted_price: { type: "string" },
                                    colors: {
                                        type: "array",
                                        items: {
                                            type: "string",
                                            properties: {},
                                        },
                                    },
                                    files: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", default: 1 },
                                                file_name: { type: "string" },
                                                file_type: { type: "string" },
                                                file_url: { type: "string" },
                                                sort_number: { type: "integer", default: 1 },
                                                priority: {
                                                    type: "string",
                                                    example: "normal, primary",
                                                },
                                            },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت محصولات یک فروشگاه" }),
    (0, common_1.Get)("/product"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_product_dto_1.GetProductDto, Object, Object]),
    __metadata("design:returntype", Promise)
], StorefrontController.prototype, "findStorefrontProducts", null);
StorefrontController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-marketplace-storefronts"),
    (0, common_1.Controller)("v2/admin/marketplace-storefronts"),
    __metadata("design:paramtypes", [storefront_service_1.StorefrontService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], StorefrontController);
exports.StorefrontController = StorefrontController;
//# sourceMappingURL=storefront.controller.js.map