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
exports.ListStorefrontDto = exports.MarketplaceStorefrontSort = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var MarketplaceStorefrontSort;
(function (MarketplaceStorefrontSort) {
    MarketplaceStorefrontSort["newest"] = "newest";
    MarketplaceStorefrontSort["oldest"] = "oldest";
    MarketplaceStorefrontSort["best_selling"] = "best_selling";
    MarketplaceStorefrontSort["most_chosen"] = "most_chosen";
})(MarketplaceStorefrontSort = exports.MarketplaceStorefrontSort || (exports.MarketplaceStorefrontSort = {}));
class ListStorefrontDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 12 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: MarketplaceStorefrontSort,
        default: MarketplaceStorefrontSort.newest,
    }),
    (0, class_validator_1.IsEnum)(MarketplaceStorefrontSort),
    __metadata("design:type", String)
], ListStorefrontDto.prototype, "sort", void 0);
exports.ListStorefrontDto = ListStorefrontDto;
//# sourceMappingURL=list-storefront.dto.js.map