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
exports.GetPublicAdsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetPublicAdsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "string", name: "ad_type" }),
    __metadata("design:type", Array)
], GetPublicAdsDto.prototype, "ad_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "integer", name: "province" }),
    __metadata("design:type", Array)
], GetPublicAdsDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "integer", name: "city" }),
    __metadata("design:type", Array)
], GetPublicAdsDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetPublicAdsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], GetPublicAdsDto.prototype, "per_page", void 0);
exports.GetPublicAdsDto = GetPublicAdsDto;
//# sourceMappingURL=get-public-ads.js.map