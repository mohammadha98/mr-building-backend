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
exports.CreateWebinarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const WebinarTypes_1 = require("../../contracts/WebinarTypes");
class CreateWebinarDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateWebinarDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "title", description: "عنوان وبینار" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "description", description: "توضیحات وبینار" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: WebinarTypes_1.default,
        name: "type",
        type: "string",
        description: "نوع وبینار: عمومی - خصوصی",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "tag", description: "رنگ را ارسال کنید" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "guest_access",
        description: "آیا کاربر مهمان اجازه ورود به وبینار را دارد؟ در صورتیکه اجازه دارد عدد 1 و در غیر این صورت عدد 0",
        enum: [0, 1],
    }),
    __metadata("design:type", Number)
], CreateWebinarDto.prototype, "guest_access", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "guest_count",
        description: "محدودیت کاربران مهمان (در صورتیکه محدودیتی ندارد عدد 0 ارسال شود.)",
        default: 0,
        example: 0,
    }),
    __metadata("design:type", Number)
], CreateWebinarDto.prototype, "guest_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "String",
        name: "started_at",
        description: "تاریخ شروع وبینار",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "started_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "String",
        name: "start_time",
        description: "ساعت شروع وبینار",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "start_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "String",
        name: "end_time",
        description: "ساعت پایان وبینار",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebinarDto.prototype, "end_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "year", description: "سال ایجاد وبینار به شمسی" }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateWebinarDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "month", description: "ماه ایجاد وبینار به شمسی" }),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateWebinarDto.prototype, "month", void 0);
exports.CreateWebinarDto = CreateWebinarDto;
//# sourceMappingURL=create-webinar.dto.js.map