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
exports.saveReasonsForRejectingAdsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ReasonAdTypes_1 = require("../enums/ReasonAdTypes");
const class_validator_1 = require("class-validator");
class saveReasonsForRejectingAdsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], saveReasonsForRejectingAdsDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], saveReasonsForRejectingAdsDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReasonAdTypes_1.ReasonAdTypes }),
    (0, class_validator_1.IsEnum)(ReasonAdTypes_1.ReasonAdTypes),
    __metadata("design:type", String)
], saveReasonsForRejectingAdsDto.prototype, "type", void 0);
exports.saveReasonsForRejectingAdsDto = saveReasonsForRejectingAdsDto;
//# sourceMappingURL=saveReasonsForRejectingAds-dto.js.map