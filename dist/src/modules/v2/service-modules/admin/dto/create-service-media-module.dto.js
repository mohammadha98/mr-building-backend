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
exports.CreateServiceMediaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ServicesTypes_1 = require("../../../../../commons/contracts/ServicesTypes");
var ServicesFileType;
(function (ServicesFileType) {
    ServicesFileType["image"] = "image";
    ServicesFileType["video"] = "video";
})(ServicesFileType || (ServicesFileType = {}));
class CreateServiceMediaDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ServicesFileType, default: ServicesFileType.video }),
    (0, class_validator_1.IsEnum)(ServicesFileType),
    __metadata("design:type", String)
], CreateServiceMediaDto.prototype, "file_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ServicesTypes_1.default, default: ServicesTypes_1.default.general }),
    (0, class_validator_1.IsEnum)(ServicesTypes_1.default),
    __metadata("design:type", String)
], CreateServiceMediaDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "file", type: "string", format: "binary" }),
    __metadata("design:type", String)
], CreateServiceMediaDto.prototype, "file", void 0);
exports.CreateServiceMediaDto = CreateServiceMediaDto;
//# sourceMappingURL=create-service-media-module.dto.js.map