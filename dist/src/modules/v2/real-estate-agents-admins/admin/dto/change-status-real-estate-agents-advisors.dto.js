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
exports.ChangeStatusAdvisorsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
class ChangeStatusAdvisorsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ChangeStatusAdvisorsDto.prototype, "comment_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Statuses_1.default,
        default: Statuses_1.default.inactive,
        example: "approved,rejected",
    }),
    __metadata("design:type", String)
], ChangeStatusAdvisorsDto.prototype, "status", void 0);
exports.ChangeStatusAdvisorsDto = ChangeStatusAdvisorsDto;
//# sourceMappingURL=change-status-real-estate-agents-advisors.dto.js.map