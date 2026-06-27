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
exports.GetLocaionInMyCity = void 0;
const swagger_1 = require("@nestjs/swagger");
const myCity_category_enum_1 = require("../enums/myCity.category.enum");
class GetLocaionInMyCity {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: myCity_category_enum_1.MyCityCategoriesEnum,
        default: myCity_category_enum_1.MyCityCategoriesEnum.all,
    }),
    __metadata("design:type", String)
], GetLocaionInMyCity.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: "active, inactive, rejected, pending",
    }),
    __metadata("design:type", String)
], GetLocaionInMyCity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false }),
    __metadata("design:type", String)
], GetLocaionInMyCity.prototype, "keyword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: false }),
    __metadata("design:type", Number)
], GetLocaionInMyCity.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: false }),
    __metadata("design:type", Number)
], GetLocaionInMyCity.prototype, "city_id", void 0);
exports.GetLocaionInMyCity = GetLocaionInMyCity;
//# sourceMappingURL=query-geolocation.dto.js.map