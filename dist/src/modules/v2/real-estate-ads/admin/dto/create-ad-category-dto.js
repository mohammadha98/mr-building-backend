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
exports.CreateAdCategoryDto = exports.RealEstateAdCategoryTypes = exports.SubCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SubCategoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubCategoryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubCategoryDto.prototype, "form_id", void 0);
exports.SubCategoryDto = SubCategoryDto;
var RealEstateAdCategoryTypes;
(function (RealEstateAdCategoryTypes) {
    RealEstateAdCategoryTypes["sale"] = "sale";
    RealEstateAdCategoryTypes["rent"] = "rent";
    RealEstateAdCategoryTypes["participation"] = "participation";
    RealEstateAdCategoryTypes["short_rent"] = "short_rent";
})(RealEstateAdCategoryTypes = exports.RealEstateAdCategoryTypes || (exports.RealEstateAdCategoryTypes = {}));
class CreateAdCategoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: null }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdCategoryDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdCategoryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RealEstateAdCategoryTypes,
        default: RealEstateAdCategoryTypes.sale,
    }),
    (0, class_validator_1.IsEnum)(RealEstateAdCategoryTypes),
    __metadata("design:type", String)
], CreateAdCategoryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, isArray: true, type: SubCategoryDto }),
    __metadata("design:type", Array)
], CreateAdCategoryDto.prototype, "items", void 0);
exports.CreateAdCategoryDto = CreateAdCategoryDto;
//# sourceMappingURL=create-ad-category-dto.js.map