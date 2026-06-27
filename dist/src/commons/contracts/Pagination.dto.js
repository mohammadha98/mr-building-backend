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
exports.PaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const Statuses_1 = require("./Statuses");
const Sorting_admin_enum_1 = require("../enums/Sorting-admin.enum");
class PaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Statuses_1.default,
        type: "string",
        default: Statuses_1.default.all,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Sorting_admin_enum_1.GetTypes, default: Sorting_admin_enum_1.GetTypes.normal, required: false }),
    __metadata("design:type", String)
], PaginationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], PaginationDto.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Sorting_admin_enum_1.SortingAdminEnum,
        default: Sorting_admin_enum_1.SortingAdminEnum.newest
    }),
    __metadata("design:type", String)
], PaginationDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 12 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PaginationDto.prototype, "per_page", void 0);
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=Pagination.dto.js.map