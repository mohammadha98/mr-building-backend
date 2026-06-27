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
exports.GetRealEstateAdDto = exports.SelectedAdStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const RealEstateAdTypes_1 = require("../../../../../commons/contracts/RealEstateAdTypes");
const SortingTypes_1 = require("../../../../../commons/contracts/SortingTypes");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
var SelectedAdStatus;
(function (SelectedAdStatus) {
    SelectedAdStatus["all"] = "all";
    SelectedAdStatus["search"] = "search";
    SelectedAdStatus["me"] = "me";
    SelectedAdStatus["individual"] = "individual";
    SelectedAdStatus["real_estate_agent"] = "real_estate_agent";
    SelectedAdStatus["advisor"] = "advisor";
    SelectedAdStatus["general_search"] = "general_search";
})(SelectedAdStatus = exports.SelectedAdStatus || (exports.SelectedAdStatus = {}));
class GetRealEstateAdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "sub_category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RealEstateAdTypes_1.default,
        title: "type",
        default: RealEstateAdTypes_1.default.sale,
    }),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SelectedAdStatus,
        title: "tag",
        default: SelectedAdStatus.me,
    }),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Statuses_1.default,
        title: "status",
        default: Statuses_1.default.all,
    }),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: SortingTypes_1.default,
        title: "sort",
        required: false,
        default: SortingTypes_1.default.newest,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdDto.prototype, "agent_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdDto.prototype, "advisor_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetRealEstateAdDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 12 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetRealEstateAdDto.prototype, "per_page", void 0);
exports.GetRealEstateAdDto = GetRealEstateAdDto;
//# sourceMappingURL=get-real-estate-ads.dto.js.map