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
exports.GetBrands = void 0;
const pagination_dto_1 = require("../../../../../commons/dto/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
const brand_enum_1 = require("../enums/brand.enum");
class GetBrands extends pagination_dto_1.PaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "normal, search" }),
    __metadata("design:type", String)
], GetBrands.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], GetBrands.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: brand_enum_1.MarketPlaceBrandSort,
        default: brand_enum_1.MarketPlaceBrandSort.newest,
    }),
    __metadata("design:type", String)
], GetBrands.prototype, "sort", void 0);
exports.GetBrands = GetBrands;
//# sourceMappingURL=brands.dto.js.map