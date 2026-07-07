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
exports.ClientReportsPaginationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ReportTypes_1 = require("../../../../../commons/contracts/ReportTypes");
class ClientReportsPaginationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ClientReportsPaginationDto.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportTypes_1.default, default: ReportTypes_1.default.all }),
    (0, class_validator_1.IsEnum)(ReportTypes_1.default),
    __metadata("design:type", String)
], ClientReportsPaginationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 1 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ClientReportsPaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "integer", default: 12 }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ClientReportsPaginationDto.prototype, "per_page", void 0);
exports.ClientReportsPaginationDto = ClientReportsPaginationDto;
//# sourceMappingURL=Client-Reports-Pagination.dto.js.map