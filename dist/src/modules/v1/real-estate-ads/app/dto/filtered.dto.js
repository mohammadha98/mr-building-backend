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
exports.FilteredDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const SortingTypes_1 = require("../../../../../commons/contracts/SortingTypes");
const get_real_estate_ads_dto_1 = require("./get-real-estate-ads.dto");
const create_ad_category_dto_1 = require("../../admin/dto/create-ad-category-dto");
class FilteredFields {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], FilteredFields.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], FilteredFields.prototype, "to", void 0);
class Item {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], Item.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], Item.prototype, "value", void 0);
class FilteredDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilteredDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilteredDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: create_ad_category_dto_1.RealEstateAdCategoryTypes,
        title: "type",
        default: create_ad_category_dto_1.RealEstateAdCategoryTypes.sale,
        example: `${create_ad_category_dto_1.RealEstateAdCategoryTypes.sale}, ${create_ad_category_dto_1.RealEstateAdCategoryTypes.rent}, ${create_ad_category_dto_1.RealEstateAdCategoryTypes.short_rent}, ${create_ad_category_dto_1.RealEstateAdCategoryTypes.participation}`,
    }),
    __metadata("design:type", String)
], FilteredDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: get_real_estate_ads_dto_1.SelectedAdStatus,
        title: "tag",
        default: get_real_estate_ads_dto_1.SelectedAdStatus.me,
    }),
    __metadata("design:type", String)
], FilteredDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SortingTypes_1.default,
        title: "sort",
        default: SortingTypes_1.default.newest,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FilteredDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], FilteredDto.prototype, "is_applicant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "sale_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "deposit_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "rent_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "normal_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "number_of_rooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "max_capicity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredFields }),
    __metadata("design:type", FilteredFields)
], FilteredDto.prototype, "year_built", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], FilteredDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], FilteredDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Item, isArray: true }),
    __metadata("design:type", Array)
], FilteredDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FilteredDto.prototype, "has_video", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilteredDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 12 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FilteredDto.prototype, "per_page", void 0);
exports.FilteredDto = FilteredDto;
//# sourceMappingURL=filtered.dto.js.map