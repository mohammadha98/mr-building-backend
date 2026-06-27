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
exports.UpdateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
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
class UpdateProductDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "product_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "unit_of_sales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "has_discount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "discounted_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "colors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "brand_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdItem, isArray: true }),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "items", void 0);
exports.UpdateProductDto = UpdateProductDto;
//# sourceMappingURL=update-product.dto.js.map