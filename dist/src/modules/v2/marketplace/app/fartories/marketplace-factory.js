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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceFactory = void 0;
const common_1 = require("@nestjs/common");
const storefront_service_1 = require("../../../marketplace-storefront/app/storefront.service");
const marketplace_categories_service_1 = require("../../../marketplace-categories/marketplace-categories.service");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
const marketplace_brands_service_1 = require("../../../marketplace-brands/marketplace-brands.service");
const slider_service_1 = require("../../../slider/slider.service");
const brand_enum_1 = require("../enums/brand.enum");
let MarketplaceFactory = class MarketplaceFactory {
    constructor(storefrontService, categoriesService, brandsService, sliderService) {
        this.storefrontService = storefrontService;
        this.categoriesService = categoriesService;
        this.brandsService = brandsService;
        this.sliderService = sliderService;
    }
    async checkExistStorefront(clientId) {
        return this.storefrontService.findByClientId(clientId);
    }
    async findCategories(pagination) {
        return this.categoriesService.findActives(pagination, {
            status: Statuses_1.default.active,
        });
    }
    async findBrands(query) {
        let where = { status: Statuses_1.default.active };
        if (query.type === "search") {
            where.title = {
                contains: query.keyword,
                mode: "insensitive",
            };
        }
        let orderBy = { createdAt: "desc" };
        if (query.sort === brand_enum_1.MarketPlaceBrandSort.best_seller) {
            orderBy = { number_of_sales: "desc" };
        }
        return this.brandsService.findActives({ page: query.page, per_page: query.per_page }, where, orderBy);
    }
    async getBrandDetails(brandId) {
        return this.brandsService.getDetails(brandId);
    }
    async findSliders() {
        return this.sliderService.getSliders("marketplace_home");
    }
    async findTopSales(query) {
        return this.storefrontService.findTopSales(query, 0, 10);
    }
    async getProducts(query) {
        return this.storefrontService.getProducts(query);
    }
    async filteredProducts(query) {
        return this.storefrontService.filteredProducts(query);
    }
    async getProductDetails(product_id) {
        const product = await this.storefrontService.getProductDetails(product_id);
        const comments = [];
        return { product, comments };
    }
    async findTopStorefronts(query) {
        return await this.storefrontService.findTopStorefronts(query, 0, 10);
    }
};
MarketplaceFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storefront_service_1.StorefrontService,
        marketplace_categories_service_1.MarketplaceCategoriesService,
        marketplace_brands_service_1.MarketplaceBrandsService,
        slider_service_1.SliderService])
], MarketplaceFactory);
exports.MarketplaceFactory = MarketplaceFactory;
//# sourceMappingURL=marketplace-factory.js.map