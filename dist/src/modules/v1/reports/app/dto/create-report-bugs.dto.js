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
exports.CreateReportBugDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ServicesTypes_1 = require("../../../../../commons/contracts/ServicesTypes");
const ReportTypes_1 = require("../../../../../commons/contracts/ReportTypes");
class CreateReportBugDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateReportBugDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ReportTypes_1.default, default: ReportTypes_1.default.bug }),
    __metadata("design:type", String)
], CreateReportBugDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ServicesTypes_1.default, default: ServicesTypes_1.default.general }),
    __metadata("design:type", String)
], CreateReportBugDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "image",
        type: "string",
        format: "binary",
        required: false,
    }),
    __metadata("design:type", String)
], CreateReportBugDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "voice",
        type: "string",
        format: "binary",
        required: false,
    }),
    __metadata("design:type", String)
], CreateReportBugDto.prototype, "voice", void 0);
exports.CreateReportBugDto = CreateReportBugDto;
//# sourceMappingURL=create-report-bugs.dto.js.map