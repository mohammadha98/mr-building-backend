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
exports.DownloadFileUrl = exports.CreateRealEstateAdRobotScraperDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const RealEstateAdMediaType_1 = require("../../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const RealEstateAdSellerTypes_1 = require("../../../../../commons/contracts/RealEstateAdSellerTypes");
class AdItemScraper {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdItemScraper.prototype, "field_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdItemScraper.prototype, "value", void 0);
class AdMediaScraper {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdMediaScraper.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AdMediaScraper.prototype, "file_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: `${RealEstateAdMediaType_1.default.image}, ${RealEstateAdMediaType_1.default.video}`,
        title: "media_type",
    }),
    __metadata("design:type", String)
], AdMediaScraper.prototype, "file_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], AdMediaScraper.prototype, "sort_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: `${RealEstateAdMediaTypePriorities_1.default.primary}, ${RealEstateAdMediaTypePriorities_1.default.normal}`,
        title: "priority",
    }),
    __metadata("design:type", String)
], AdMediaScraper.prototype, "priority", void 0);
class CreateRealEstateAdRobotScraperDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        default: RealEstateAdSellerTypes_1.default.individual,
    }),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "seller_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: "divar" }),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "owner_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "owner_phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "sub_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], CreateRealEstateAdRobotScraperDto.prototype, "is_applicant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "year_built", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "sale_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "deposit_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "rent_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "number_of_rooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "max_capicity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "normal_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "weekend_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "special_days_price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "cost_per_additional_person", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "extra_people", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateRealEstateAdRobotScraperDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateRealEstateAdRobotScraperDto.prototype, "area", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdItemScraper, isArray: true }),
    __metadata("design:type", Array)
], CreateRealEstateAdRobotScraperDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdMediaScraper, isArray: true }),
    __metadata("design:type", Array)
], CreateRealEstateAdRobotScraperDto.prototype, "media", void 0);
exports.CreateRealEstateAdRobotScraperDto = CreateRealEstateAdRobotScraperDto;
class DownloadFileUrl {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DownloadFileUrl.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DownloadFileUrl.prototype, "dest", void 0);
exports.DownloadFileUrl = DownloadFileUrl;
//# sourceMappingURL=create-real-estate-roborScraper-ads.dto.js.map