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
exports.RealEstateAdsSettingsController = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_service_1 = require("./real-estate-ads.service");
const swagger_1 = require("@nestjs/swagger");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const get_details_real_estate_ads_dto_1 = require("./dto/get-details-real-estate-ads.dto");
const Transformer_1 = require("./Transformer");
const get_real_estate_ads_dto_1 = require("./dto/get-real-estate-ads.dto");
const filtered_dto_1 = require("./dto/filtered.dto");
let RealEstateAdsSettingsController = class RealEstateAdsSettingsController {
    constructor(realEstateAdsService, responseHandler, realEstateAdsTransformer) {
        this.realEstateAdsService = realEstateAdsService;
        this.responseHandler = responseHandler;
        this.realEstateAdsTransformer = realEstateAdsTransformer;
    }
    async findAds(query, req, res) {
        const result = await this.realEstateAdsService.findAds(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 200, "لیست آگهی ها در دسترس است.", {
            data: result.result,
            metadata: result.metadata,
        });
    }
    async filteredAds(body, req, res) {
        console.log("*** filteredAds ***");
        console.log({ body });
        const result = await this.realEstateAdsService.filteredAds(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        const transformer = this.realEstateAdsTransformer.collectionAdList(result.result);
        return this.responseHandler.send(res, 200, "آگهی های فیلتر شده در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
        });
    }
    async findDetails(query) {
        return await this.realEstateAdsService.findDetails(query);
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
        return this.responseHandler.send(res, 200, "لیست دسته بندی ها در دسترس است.", transformer);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت آگهی ها" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_real_estate_ads_dto_1.GetRealEstateAdDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "findAds", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "فیلتر آگهی ها" }),
    (0, common_1.Post)("filter"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filtered_dto_1.FilteredDto, Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "filteredAds", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "جزییات آگهی" }),
    (0, common_1.Get)("details"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_details_real_estate_ads_dto_1.GetDetailsRealEstateAdItemsDto]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "findDetails", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست دسته بندی" }),
    (0, common_1.Get)("/categories/list"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RealEstateAdsSettingsController.prototype, "getCategories", null);
RealEstateAdsSettingsController = __decorate([
    (0, swagger_1.ApiTags)("v1/site-real-estate-ads"),
    (0, common_1.Controller)("v1/site/real-estate-ads"),
    __metadata("design:paramtypes", [real_estate_ads_service_1.RealEstateAdsService,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_1.default])
], RealEstateAdsSettingsController);
exports.RealEstateAdsSettingsController = RealEstateAdsSettingsController;
//# sourceMappingURL=real-estate-ads.controller.js.map