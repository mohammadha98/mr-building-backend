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
exports.CreateRealEstateAdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const RealEstateAdMediaType_1 = require("../../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const RealEstateAdSellerTypes_1 = require("../../../../../commons/contracts/RealEstateAdSellerTypes");
class AdItem {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdItem.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdItem.prototype, "value", void 0);
class AdMedia {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdMedia.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdMedia.prototype, "file_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: `${RealEstateAdMediaType_1.default.image}, ${RealEstateAdMediaType_1.default.video}`,
        title: "media_type",
    }),
    __metadata("design:type", String)
], AdMedia.prototype, "file_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdMedia.prototype, "sort_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: `${RealEstateAdMediaTypePriorities_1.default.primary}, ${RealEstateAdMediaTypePriorities_1.default.normal}`,
        title: "priority",
    }),
    __metadata("design:type", Number)
], AdMedia.prototype, "priority", void 0);
class CreateRealEstateAdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RealEstateAdSellerTypes_1.default,
        default: RealEstateAdSellerTypes_1.default.individual,
        example: `${RealEstateAdSellerTypes_1.default.individual}, ${RealEstateAdSellerTypes_1.default.real_estate_agent}, ${RealEstateAdSellerTypes_1.default.advisor}`,
    }),
    __metadata("design:type", String)
], CreateRealEstateAdDto.prototype, "seller_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateRealEstateAdDto.prototype, "agent_valuation_request", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "agent_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "advisor_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    __metadata("design:type", Boolean)
], CreateRealEstateAdDto.prototype, "display_contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], CreateRealEstateAdDto.prototype, "is_applicant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "year_built", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "sale_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "deposit_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "rent_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "number_of_rooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "max_capicity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "normal_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "weekend_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "special_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "cost_per_additional_person", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "extra_people", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], CreateRealEstateAdDto.prototype, "is_timed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2024-08-07 00:00:00 || null" }),
    __metadata("design:type", Object)
], CreateRealEstateAdDto.prototype, "expired_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdItem, isArray: true }),
    __metadata("design:type", Array)
], CreateRealEstateAdDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdMedia, isArray: true }),
    __metadata("design:type", Array)
], CreateRealEstateAdDto.prototype, "media", void 0);
exports.CreateRealEstateAdDto = CreateRealEstateAdDto;
//# sourceMappingURL=create-real-estate-ads.dto.js.map