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
exports.SaveProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const RealEstateAdMediaType_1 = require("../../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../../commons/contracts/RealEstateAdMediaTypePriorities");
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
    __metadata("design:type", String)
], AdMedia.prototype, "priority", void 0);
class SaveProductDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveProductDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveProductDto.prototype, "unit_of_sales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], SaveProductDto.prototype, "has_discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    __metadata("design:type", Number)
], SaveProductDto.prototype, "discounted_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], SaveProductDto.prototype, "colors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveProductDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveProductDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveProductDto.prototype, "brand_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdItem, isArray: true }),
    __metadata("design:type", Array)
], SaveProductDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdMedia, isArray: true }),
    __metadata("design:type", Array)
], SaveProductDto.prototype, "media", void 0);
exports.SaveProductDto = SaveProductDto;
//# sourceMappingURL=save-product.dto.js.map