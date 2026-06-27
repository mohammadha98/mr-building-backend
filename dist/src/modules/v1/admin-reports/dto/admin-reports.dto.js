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
exports.AdminReportsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const admin_report_types_enum_1 = require("../enums/admin-report-types.enum");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
class AdminReportsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: admin_report_types_enum_1.AdminReportTypes,
        default: admin_report_types_enum_1.AdminReportTypes.Daily,
    }),
    (0, class_validator_1.IsEnum)(admin_report_types_enum_1.AdminReportTypes),
    __metadata("design:type", String)
], AdminReportsDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: Statuses_1.default,
        default: Statuses_1.default.active,
        required: false,
        example: `${Statuses_1.default.all},${Statuses_1.default.pending}, ${Statuses_1.default.approved}, ${Statuses_1.default.rejected}, ${Statuses_1.default.sold_out}, ${Statuses_1.default.invalidate}, ${Statuses_1.default.inactive}`,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminReportsDto.prototype, "status", void 0);
exports.AdminReportsDto = AdminReportsDto;
//# sourceMappingURL=admin-reports.dto.js.map