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
exports.GetRealEstateAdScraperDto = exports.SelectedAdStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const SortingTypes_1 = require("../../../../../commons/contracts/SortingTypes");
var SelectedAdStatus;
(function (SelectedAdStatus) {
    SelectedAdStatus["general_ads"] = "general_ads";
    SelectedAdStatus["general_search"] = "general_search";
})(SelectedAdStatus = exports.SelectedAdStatus || (exports.SelectedAdStatus = {}));
class GetRealEstateAdScraperDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SelectedAdStatus,
        title: "tag",
        default: SelectedAdStatus.general_ads,
    }),
    __metadata("design:type", String)
], GetRealEstateAdScraperDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SortingTypes_1.default,
        title: "sort",
        required: false,
        default: SortingTypes_1.default.newest,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetRealEstateAdScraperDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetRealEstateAdScraperDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdScraperDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 12 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdScraperDto.prototype, "per_page", void 0);
exports.GetRealEstateAdScraperDto = GetRealEstateAdScraperDto;
//# sourceMappingURL=get-real-estate-ads-scraper.dto.js.map