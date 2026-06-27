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
exports.CreateMarketplaceCategoryDto = exports.SubCategoryDto = void 0;
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
class CreateMarketplaceCategoryDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketplaceCategoryDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMarketplaceCategoryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: SubCategoryDto }),
    __metadata("design:type", Array)
], CreateMarketplaceCategoryDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "thumbnail",
        type: "string",
        format: "binary",
        required: false,
    }),
    __metadata("design:type", String)
], CreateMarketplaceCategoryDto.prototype, "thumbnail", void 0);
exports.CreateMarketplaceCategoryDto = CreateMarketplaceCategoryDto;
//# sourceMappingURL=create-marketplace-category.dto.js.map