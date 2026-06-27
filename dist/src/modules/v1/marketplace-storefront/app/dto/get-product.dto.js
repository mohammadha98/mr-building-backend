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
exports.GetProductDto = exports.GetProductTypes = void 0;
const swagger_1 = require("@nestjs/swagger");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
const class_validator_1 = require("class-validator");
const SortingTypes_1 = require("../../../../../commons/contracts/SortingTypes");
var GetProductTypes;
(function (GetProductTypes) {
    GetProductTypes["normal"] = "normal";
    GetProductTypes["search"] = "search";
})(GetProductTypes = exports.GetProductTypes || (exports.GetProductTypes = {}));
class GetProductDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: GetProductTypes, default: GetProductTypes.normal }),
    (0, class_validator_1.IsEnum)(GetProductTypes),
    __metadata("design:type", String)
], GetProductDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetProductDto.prototype, "storefront_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetProductDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    __metadata("design:type", Number)
], GetProductDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 12 }),
    __metadata("design:type", Number)
], GetProductDto.prototype, "per_page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Statuses_1.default, default: Statuses_1.default.active }),
    (0, class_validator_1.IsEnum)(Statuses_1.default),
    __metadata("design:type", String)
], GetProductDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SortingTypes_1.default, default: SortingTypes_1.default.newest }),
    (0, class_validator_1.IsEnum)(SortingTypes_1.default),
    __metadata("design:type", String)
], GetProductDto.prototype, "sort", void 0);
exports.GetProductDto = GetProductDto;
//# sourceMappingURL=get-product.dto.js.map