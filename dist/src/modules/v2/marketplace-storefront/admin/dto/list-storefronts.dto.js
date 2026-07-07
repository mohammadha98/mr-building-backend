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
exports.ListStorefrontsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
const list_storefront_dto_1 = require("../../app/dto/list-storefront.dto");
const client_list_dto_1 = require("../../../client/admin/dto/client-list.dto");
class ListStorefrontsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Statuses_1.default, default: Statuses_1.default.all }),
    (0, class_validator_1.IsEnum)(Statuses_1.default),
    __metadata("design:type", String)
], ListStorefrontsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_list_dto_1.GetTypes, default: client_list_dto_1.GetTypes.normal, required: false }),
    __metadata("design:type", String)
], ListStorefrontsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ListStorefrontsDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: list_storefront_dto_1.MarketplaceStorefrontSort,
        default: list_storefront_dto_1.MarketplaceStorefrontSort.newest,
    }),
    (0, class_validator_1.IsEnum)(list_storefront_dto_1.MarketplaceStorefrontSort),
    __metadata("design:type", String)
], ListStorefrontsDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ListStorefrontsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 12 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ListStorefrontsDto.prototype, "per_page", void 0);
exports.ListStorefrontsDto = ListStorefrontsDto;
//# sourceMappingURL=list-storefronts.dto.js.map