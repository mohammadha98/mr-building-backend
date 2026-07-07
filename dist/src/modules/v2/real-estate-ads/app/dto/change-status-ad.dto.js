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
exports.APP_ChangeStatusAdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const PriceStatuses_1 = require("../../../../../commons/contracts/PriceStatuses");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
class APP_ChangeStatusAdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], APP_ChangeStatusAdDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Statuses_1.default,
        default: Statuses_1.default.approved,
        example: `${Statuses_1.default.approved}`,
    }),
    (0, class_validator_1.IsEnum)(Statuses_1.default),
    __metadata("design:type", String)
], APP_ChangeStatusAdDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "string" }),
    __metadata("design:type", Array)
], APP_ChangeStatusAdDto.prototype, "reasons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PriceStatuses_1.default,
        default: PriceStatuses_1.default.low,
        required: false,
    }),
    __metadata("design:type", String)
], APP_ChangeStatusAdDto.prototype, "price_status", void 0);
exports.APP_ChangeStatusAdDto = APP_ChangeStatusAdDto;
//# sourceMappingURL=change-status-ad.dto.js.map