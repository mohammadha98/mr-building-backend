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
exports.GetChannelsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
class GetChannelsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Statuses_1.default,
        type: "string",
        default: Statuses_1.default.all,
    }),
    __metadata("design:type", String)
], GetChannelsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetChannelsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 12 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetChannelsDto.prototype, "per_page", void 0);
exports.GetChannelsDto = GetChannelsDto;
//# sourceMappingURL=get-channels-pagination..dto.js.map