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
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const marketplace_factory_1 = require("./fartories/marketplace-factory");
const axios_1 = require("axios");
const messages_1 = require("../../../../commons/enums/messages");
const brand_enum_1 = require("./enums/brand.enum");
let MarketplaceService = class MarketplaceService {
    constructor(request, marketplaceFactory) {
        this.request = request;
        this.marketplaceFactory = marketplaceFactory;
    }
    async getHomePage(query) {
        const { id: clientId } = this.request.client;
        console.log({ clientId });
        const paginationDto = {
            page: 0,
            per_page: 10,
        };
        const storefront = await this.marketplaceFactory.checkExistStorefront(clientId);
        let is_seller = false;
        if (storefront) {
            is_seller = true;
        }
        const categories = await this.marketplaceFactory.findCategories(paginationDto);
        const brands = await this.marketplaceFactory.findBrands({
            page: paginationDto.page,
            per_page: paginationDto.per_page,
            type: "normal",
            keyword: null,
            sort: brand_enum_1.MarketPlaceBrandSort.best_seller,
        });
        const top_products = await this.marketplaceFactory.findTopSales(query);
        const sliders = await this.marketplaceFactory.findSliders();
        const top_storefronts = await this.marketplaceFactory.findTopStorefronts(query);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: {
                is_seller,
                storefront,
                sliders,
                categories: categories.categories,
                brands: brands.brands,
                top_products,
                top_storefronts,
            },
        };
    }
    async getBrands(query) {
        const brands = await this.marketplaceFactory.findBrands(query);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: brands,
        };
    }
    async getBrandDetails(brandId) {
        const details = await this.marketplaceFactory.getBrandDetails(brandId);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: details,
        };
    }
    async getCategories(pagination) {
        const categories = await this.marketplaceFactory.findCategories(pagination);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: categories,
        };
    }
    async getProducts(query) {
        const products = await this.marketplaceFactory.getProducts(query);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: products,
        };
    }
    async filteredProducts(query) {
        const products = await this.marketplaceFactory.filteredProducts(query);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: products,
        };
    }
    async getProductDetails(product_id) {
        const result = await this.marketplaceFactory.getProductDetails(product_id);
        return {
            statusCode: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: result,
        };
    }
};
MarketplaceService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, marketplace_factory_1.MarketplaceFactory])
], MarketplaceService);
exports.MarketplaceService = MarketplaceService;
//# sourceMappingURL=marketplace.service.js.map