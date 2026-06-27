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
exports.RealEstateAdsRobotScraperController = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_service_1 = require("./real-estate-ads.service");
const create_real_estate_roborScraper_ads_dto_1 = require("./dto/create-real-estate-roborScraper-ads.dto");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
let RealEstateAdsRobotScraperController = class RealEstateAdsRobotScraperController {
    constructor(realEstateAdsService, responseHandler, realEstateAdsTransformer) {
        this.realEstateAdsService = realEstateAdsService;
        this.responseHandler = responseHandler;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
    }
    async create(body, res) {
        console.log("*** Save Ad: RobotScraper ***");
        const result = await this.realEstateAdsService.storeAd(body);
        if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "آگهی جدید ثبت شد.");
    }
    async getCategories(req, res) {
        console.log("*** getCategories Ad: APP ***");
        const result = await this.realEstateAdsService.getCategories();
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.assortmentCollection(result.result);
        return this.responseHandler.send(res, 200, "لیست دیته بندی ها در دسترس است.", transformer);
    }
    async testDownloadFile(body) {
        console.log(" test Download File");
        console.log(body);
        return await this.realEstateAdsService.downloadFile(body);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره آگهی - اسکرپر" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_roborScraper_ads_dto_1.CreateRealEstateAdRobotScraperDto, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsRobotScraperController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست دیته بندی ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست دیته بندی ها در دسترس است.",
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
                                    items: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", example: 1 },
                                                title: { type: "String" },
                                                form: {
                                                    type: "object",
                                                    properties: {
                                                        items: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    id: { type: "integer", example: 1 },
                                                                    field_name: {
                                                                        type: "String",
                                                                        example: "field_name",
                                                                    },
                                                                    type: {
                                                                        type: "String",
                                                                        example: "sale, presell, collaboration, rent",
                                                                    },
                                                                    field_type: {
                                                                        type: "String",
                                                                        example: "input_string, input_number, list, toggle  ",
                                                                    },
                                                                    values: {
                                                                        type: "array",
                                                                        items: { type: "string", properties: {} },
                                                                    },
                                                                    sort_number: { type: "integer", example: 1 },
                                                                    icon: {
                                                                        type: "String",
                                                                        example: "field_name",
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست دسته بندی" }),
    (0, common_1.Get)("/categories/list"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsRobotScraperController.prototype, "getCategories", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/real_estate_ads/scraper/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    })),
    (0, common_1.Post)("test/download"),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "تست - دانلود فایل از URL" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_real_estate_roborScraper_ads_dto_1.DownloadFileUrl]),
    __metadata("design:returntype", Promise)
], RealEstateAdsRobotScraperController.prototype, "testDownloadFile", null);
RealEstateAdsRobotScraperController = __decorate([
    (0, swagger_1.ApiTags)("v1/app-real-estate-ads-scraper"),
    (0, common_1.Controller)("v1/app/real-estate-ads/scraper"),
    __metadata("design:paramtypes", [real_estate_ads_service_1.RealEstateAdsService_robotScraper,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_1.default])
], RealEstateAdsRobotScraperController);
exports.RealEstateAdsRobotScraperController = RealEstateAdsRobotScraperController;
//# sourceMappingURL=real-estate-ads.controller.js.map