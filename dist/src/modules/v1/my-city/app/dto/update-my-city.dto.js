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
exports.UpdateMyCityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_my_city_dto_1 = require("./create-my-city.dto");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const myCity_category_enum_1 = require("../enums/myCity.category.enum");
class UpdateMyCityDto extends (0, mapped_types_1.PartialType)(create_my_city_dto_1.CreateMyCityDto) {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: myCity_category_enum_1.MyCityCategoriesEnum }),
    __metadata("design:type", String)
], UpdateMyCityDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UpdateMyCityDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UpdateMyCityDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "year_built", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "number_of_rooms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], UpdateMyCityDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], UpdateMyCityDto.prototype, "renovation_tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], UpdateMyCityDto.prototype, "city_id", void 0);
exports.UpdateMyCityDto = UpdateMyCityDto;
//# sourceMappingURL=update-my-city.dto.js.map