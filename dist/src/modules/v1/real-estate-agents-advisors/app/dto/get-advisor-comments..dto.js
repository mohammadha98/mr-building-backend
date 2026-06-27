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
exports.GetAdvisorCommentsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var commentStatus;
(function (commentStatus) {
    commentStatus["all"] = "all";
    commentStatus["approved"] = "approved";
})(commentStatus || (commentStatus = {}));
class GetAdvisorCommentsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetAdvisorCommentsDto.prototype, "advisor_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: commentStatus,
        type: "string",
        default: commentStatus.all,
    }),
    __metadata("design:type", String)
], GetAdvisorCommentsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetAdvisorCommentsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 12 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], GetAdvisorCommentsDto.prototype, "per_page", void 0);
exports.GetAdvisorCommentsDto = GetAdvisorCommentsDto;
//# sourceMappingURL=get-advisor-comments..dto.js.map