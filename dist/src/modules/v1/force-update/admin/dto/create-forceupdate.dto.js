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
exports.CreateForceUpdateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const InstalledVersionTypes_1 = require("../../../../../commons/contracts/InstalledVersionTypes");
class CreateForceUpdateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateForceUpdateDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: InstalledVersionTypes_1.default,
        default: InstalledVersionTypes_1.default.direct,
        required: false,
    }),
    __metadata("design:type", String)
], CreateForceUpdateDto.prototype, "installed_version_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "boolean" }),
    (0, class_validator_1.IsBooleanString)(),
    __metadata("design:type", Boolean)
], CreateForceUpdateDto.prototype, "required", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "string" }),
    __metadata("design:type", String)
], CreateForceUpdateDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "string" }),
    __metadata("design:type", Array)
], CreateForceUpdateDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "file_apk",
        type: "string",
        format: "binary",
        required: false,
    }),
    __metadata("design:type", String)
], CreateForceUpdateDto.prototype, "file_apk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateForceUpdateDto.prototype, "indirect_link", void 0);
exports.CreateForceUpdateDto = CreateForceUpdateDto;
//# sourceMappingURL=create-forceupdate.dto.js.map