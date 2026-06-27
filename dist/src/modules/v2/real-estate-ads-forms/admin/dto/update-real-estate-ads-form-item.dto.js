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
exports.UpdateRealEstateAdFormsItemsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const FeatureFieldTypes_1 = require("../../../../../commons/contracts/FeatureFieldTypes");
class UpdateRealEstateAdFormsItemsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdFormsItemsDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateRealEstateAdFormsItemsDto.prototype, "field_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: FeatureFieldTypes_1.default, title: "field_type" }),
    __metadata("design:type", String)
], UpdateRealEstateAdFormsItemsDto.prototype, "field_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ title: "values", type: "string", isArray: true }),
    __metadata("design:type", Array)
], UpdateRealEstateAdFormsItemsDto.prototype, "values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "icon", type: "string", format: "binary" }),
    __metadata("design:type", String)
], UpdateRealEstateAdFormsItemsDto.prototype, "icon", void 0);
exports.UpdateRealEstateAdFormsItemsDto = UpdateRealEstateAdFormsItemsDto;
//# sourceMappingURL=update-real-estate-ads-form-item.dto.js.map