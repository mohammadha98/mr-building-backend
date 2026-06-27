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
exports.SaveAdSettingsDto = exports.FilteredAdNotification_item = void 0;
const swagger_1 = require("@nestjs/swagger");
class FilteredAdNotification_item {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilteredAdNotification_item.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilteredAdNotification_item.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilteredAdNotification_item.prototype, "value", void 0);
exports.FilteredAdNotification_item = FilteredAdNotification_item;
class SaveAdSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveAdSettingsDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveAdSettingsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "2024-08-07 00:00:00" }),
    __metadata("design:type", Date)
], SaveAdSettingsDto.prototype, "expired_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "provinceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveAdSettingsDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SaveAdSettingsDto.prototype, "subCategoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SaveAdSettingsDto.prototype, "smsNotification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SaveAdSettingsDto.prototype, "whatsappNotification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "year_built_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "year_built_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "size_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "size_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "sale_price_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "sale_price_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "deposit_price_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "deposit_price_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "rent_price_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "rent_price_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "normal_days_price_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "normal_days_price_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "number_of_rooms_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "number_of_rooms_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "max_capicity_from", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SaveAdSettingsDto.prototype, "max_capicity_to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: FilteredAdNotification_item, isArray: true }),
    __metadata("design:type", Array)
], SaveAdSettingsDto.prototype, "items", void 0);
exports.SaveAdSettingsDto = SaveAdSettingsDto;
//# sourceMappingURL=save-ad-settings.js.map