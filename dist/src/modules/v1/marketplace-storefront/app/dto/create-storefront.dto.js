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
exports.CreateStorefrontDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStorefrontDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStorefrontDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStorefrontDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStorefrontDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "avatar",
        type: "string",
        format: "binary",
        required: false,
    }),
    __metadata("design:type", String)
], CreateStorefrontDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "license",
        type: "string",
        format: "binary",
        required: false,
    }),
    __metadata("design:type", String)
], CreateStorefrontDto.prototype, "license", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateStorefrontDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateStorefrontDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateStorefrontDto.prototype, "city_id", void 0);
exports.CreateStorefrontDto = CreateStorefrontDto;
//# sourceMappingURL=create-storefront.dto.js.map