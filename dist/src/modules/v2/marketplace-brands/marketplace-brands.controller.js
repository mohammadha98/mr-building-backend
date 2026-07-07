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
exports.MarketplaceBrandsController = void 0;
const common_1 = require("@nestjs/common");
const marketplace_brands_service_1 = require("./marketplace-brands.service");
const create_marketplace_brands_dto_1 = require("./dto/create-marketplace-brands.dto");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const swagger_1 = require("@nestjs/swagger");
const Pagination_dto_1 = require("../../../commons/contracts/Pagination.dto");
const badRequestErrorHandler_1 = require("../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../services/httpResponseHandler/forbiddenErrorHandler");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const AdminTokenAuthGuard_1 = require("../jwt-auth/AdminTokenAuthGuard");
const Transformer_1 = require("./Transformer");
let MarketplaceBrandsController = class MarketplaceBrandsController {
    constructor(marketplaceBrandsService, responseHandler, marketplaceBrandsTransformer) {
        this.marketplaceBrandsService = marketplaceBrandsService;
        this.responseHandler = responseHandler;
        this.marketplaceBrandsTransformer = marketplaceBrandsTransformer;
    }
    async saveBrands(body, req, res, thumbnail) {
        body.thumbnail = thumbnail ? thumbnail.filename : null;
        body.user_id = req.user.id;
        console.log("*** save Brands marketplace: ADMIN ***");
        console.log(body);
        const result = await this.marketplaceBrandsService.saveBrand(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد");
    }
    async getAssortments(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** get Brands in Marketplace: ADMIN ***");
        console.log(body);
        const result = await this.marketplaceBrandsService.getBrands(body);
        if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.marketplaceBrandsTransformer.collection(result.result);
        return this.responseHandler.send(res, 200, "لیست برندها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async deleteMainBrands(item_id, req, res) {
        console.log("*** delete Brands in Marketplace: ADMIN ***");
        console.log(item_id);
        const result = await this.marketplaceBrandsService.deleteBrand(item_id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. آیتم موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "عملیات با موفقیت انجام شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "عملیات با موفقیت انجام شد",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "عملیات با موفقیت انجام شد",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("thumbnail", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/marketplace/brands/",
            filename(req, file, callback) {
                const filename = (0, path_1.parse)((0, path_1.join)(file.originalname)).name;
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${filename}-${Date.now()}${extention}`);
            },
        }),
    })),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد / ویرایش برند" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({ type: create_marketplace_brands_dto_1.CreateMarketplaceBrandsDto }),
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_marketplace_brands_dto_1.CreateMarketplaceBrandsDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceBrandsController.prototype, "saveBrands", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست برندها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست برندها در دسترس است.",
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
                                    title: { type: "String" },
                                    second_title: { type: "String" },
                                    description: { type: "String" },
                                    status: { type: "String" },
                                    thumbnail: { type: "String" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست برندها" }),
    (0, common_1.Get)("/list"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceBrandsController.prototype, "getAssortments", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "عملیات با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "عملیات با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "حذف برند" }),
    (0, common_1.Delete)("/:item_id"),
    __param(0, (0, common_1.Param)("item_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceBrandsController.prototype, "deleteMainBrands", null);
MarketplaceBrandsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-marketplace-brands"),
    (0, common_1.Controller)("v2/admin/marketplace/brands"),
    __metadata("design:paramtypes", [marketplace_brands_service_1.MarketplaceBrandsService,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_1.default])
], MarketplaceBrandsController);
exports.MarketplaceBrandsController = MarketplaceBrandsController;
//# sourceMappingURL=marketplace-brands.controller.js.map