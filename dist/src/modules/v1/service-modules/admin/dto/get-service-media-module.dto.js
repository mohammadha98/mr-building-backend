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
exports.GetServicesMediaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ServicesTypes_1 = require("../../../../../commons/contracts/ServicesTypes");
class GetServicesMediaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ServicesTypes_1.default, default: ServicesTypes_1.default.general }),
    (0, class_validator_1.IsEnum)(ServicesTypes_1.default),
    __metadata("design:type", String)
], GetServicesMediaDto.prototype, "type", void 0);
exports.GetServicesMediaDto = GetServicesMediaDto;
//# sourceMappingURL=get-service-media-module.dto.js.map