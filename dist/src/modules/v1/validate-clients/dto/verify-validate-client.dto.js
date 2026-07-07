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
exports.VerifyCodeValidateClientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
class VerifyCodeValidateClientDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ enum: UserTypes_1.default, default: UserTypes_1.default.estate_agent }),
    __metadata("design:type", String)
], VerifyCodeValidateClientDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], VerifyCodeValidateClientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VerifyCodeValidateClientDto.prototype, "code", void 0);
exports.VerifyCodeValidateClientDto = VerifyCodeValidateClientDto;
//# sourceMappingURL=verify-validate-client.dto.js.map