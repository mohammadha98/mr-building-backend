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
exports.GetProductsInMarketplaceDto = exports.GetProductMarketplaceTypes = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../../../commons/dto/pagination.dto");
const SortingTypes_1 = require("../../../../../commons/contracts/SortingTypes");
const get_product_dto_1 = require("../../../marketplace-storefront/app/dto/get-product.dto");
var GetProductMarketplaceTypes;
(function (GetProductMarketplaceTypes) {
    GetProductMarketplaceTypes["all"] = "all";
    GetProductMarketplaceTypes["category"] = "category";
    GetProductMarketplaceTypes["sub_category"] = "sub_category";
    GetProductMarketplaceTypes["brand"] = "brand";
})(GetProductMarketplaceTypes = exports.GetProductMarketplaceTypes || (exports.GetProductMarketplaceTypes = {}));
class GetProductsInMarketplaceDto extends pagination_dto_1.PaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: GetProductMarketplaceTypes,
        default: GetProductMarketplaceTypes.category,
    }),
    (0, class_validator_1.IsEnum)(GetProductMarketplaceTypes),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: get_product_dto_1.GetProductTypes, default: get_product_dto_1.GetProductTypes.normal }),
    (0, class_validator_1.IsEnum)(get_product_dto_1.GetProductTypes),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SortingTypes_1.default,
        default: SortingTypes_1.default.newest,
    }),
    (0, class_validator_1.IsEnum)(SortingTypes_1.default),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProductsInMarketplaceDto.prototype, "item_id", void 0);
exports.GetProductsInMarketplaceDto = GetProductsInMarketplaceDto;
//# sourceMappingURL=get-products.dto.js.map