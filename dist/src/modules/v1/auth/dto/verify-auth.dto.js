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
exports.VerifyAuthDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const register_auth_dto_1 = require("./register-auth.dto");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class VerifyAuthDto extends (0, mapped_types_1.PartialType)(register_auth_dto_1.RegisterAuthDto) {
}
__decorate([
    (0, class_validator_1.IsString)({
        message: "شماره موبایل را وارد کنید",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "شماره موبایل نمیتواند خالی باشد" }),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VerifyAuthDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VerifyAuthDto.prototype, "code", void 0);
exports.VerifyAuthDto = VerifyAuthDto;
//# sourceMappingURL=verify-auth.dto.js.map