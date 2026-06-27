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
exports.UpdateExpiredAd = exports.UpdateRealEstateAdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
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
class UpdateRealEstateAdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RealEstateAdSellerTypes_1.default,
        default: RealEstateAdSellerTypes_1.default.individual,
        example: `${RealEstateAdSellerTypes_1.default.individual}, ${RealEstateAdSellerTypes_1.default.real_estate_agent}, ${RealEstateAdSellerTypes_1.default.advisor}`,
    }),
    __metadata("design:type", String)
], UpdateRealEstateAdDto.prototype, "seller_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UpdateRealEstateAdDto.prototype, "agent_valuation_request", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "agent_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "advisor_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    __metadata("design:type", Boolean)
], UpdateRealEstateAdDto.prototype, "display_contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], UpdateRealEstateAdDto.prototype, "is_applicant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "year_built", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "sale_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "deposit_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "rent_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "number_of_rooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "max_capicity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "normal_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "weekend_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "special_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "cost_per_additional_person", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "extra_people", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateRealEstateAdDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "boolean" }),
    __metadata("design:type", Boolean)
], UpdateRealEstateAdDto.prototype, "is_timed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2024-08-07 00:00:00 || null" }),
    __metadata("design:type", Object)
], UpdateRealEstateAdDto.prototype, "expired_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdItem, isArray: true }),
    __metadata("design:type", Array)
], UpdateRealEstateAdDto.prototype, "items", void 0);
exports.UpdateRealEstateAdDto = UpdateRealEstateAdDto;
class UpdateExpiredAd {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateExpiredAd.prototype, "adId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2024-08-07 00:00:00 || null" }),
    __metadata("design:type", Object)
], UpdateExpiredAd.prototype, "expired_at", void 0);
exports.UpdateExpiredAd = UpdateExpiredAd;
//# sourceMappingURL=update-real-estate-ads.dto.js.map