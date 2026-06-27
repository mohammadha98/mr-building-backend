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
exports.MarketplaceAppController = void 0;
const common_1 = require("@nestjs/common");
const marketplace_service_1 = require("./marketplace.service");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
const swagger_1 = require("@nestjs/swagger");
const pagination_decorator_1 = require("../../../../commons/decorators/pagination.decorator");
const pagination_dto_1 = require("../../../../commons/dto/pagination.dto");
const get_products_dto_1 = require("./dto/get-products.dto");
const brands_dto_1 = require("./dto/brands.dto");
const filter_products_dto_1 = require("./dto/filter-products.dto");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const marketplace_home_page_dto_1 = require("./dto/marketplace-home-page.dto");
let MarketplaceAppController = class MarketplaceAppController {
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    getHomePage(query) {
        return this.marketplaceService.getHomePage(query);
    }
    getBrands(query) {
        return this.marketplaceService.getBrands(query);
    }
    getBrandDetails(brandId) {
        return this.marketplaceService.getBrandDetails(brandId);
    }
    getCategories(pagination) {
        return this.marketplaceService.getCategories(pagination);
    }
    getProducts(query) {
        console.log("GetProductsInMarketplaceDto");
        console.log(query);
        return this.marketplaceService.getProducts(query);
    }
    filteredProducts(body) {
        console.log("filteredProducts");
        console.log(body);
        return this.marketplaceService.filteredProducts(body);
    }
    getProductInfo(product_id) {
        console.log("getProductInfo");
        console.log({ product_id });
        return this.marketplaceService.getProductDetails(product_id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "اطلاعات صفحه اصلی نمایشگاه" }),
    (0, common_1.Get)("home-page"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [marketplace_home_page_dto_1.MarketplaceHomePageDto]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "getHomePage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست برندها" }),
    (0, common_1.Get)("brands"),
    (0, pagination_decorator_1.Pagination)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brands_dto_1.GetBrands]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "getBrands", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "جزییات برند" }),
    (0, common_1.Get)("brands/:brandId"),
    __param(0, (0, common_1.Param)("brandId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "getBrandDetails", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست دسته بندی ها" }),
    (0, common_1.Get)("categories"),
    (0, pagination_decorator_1.Pagination)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "getCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست محصولات" }),
    (0, common_1.Get)("products"),
    (0, pagination_decorator_1.Pagination)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_products_dto_1.GetProductsInMarketplaceDto]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "getProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "فیلتر محصولات" }),
    (0, common_1.Post)("filter/products"),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_products_dto_1.FilterProductsDto]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "filteredProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت جزییات یک محصول" }),
    (0, common_1.Get)("products/:product_id"),
    __param(0, (0, common_1.Param)("product_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceAppController.prototype, "getProductInfo", null);
MarketplaceAppController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app/marketplace"),
    (0, common_1.Controller)("v2/app/marketplace"),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceAppController);
exports.MarketplaceAppController = MarketplaceAppController;
//# sourceMappingURL=marketplace.controller.js.map