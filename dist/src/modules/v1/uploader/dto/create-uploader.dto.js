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
exports.CreateUploaderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const UploaderFileTypes_1 = require("../../../../commons/contracts/UploaderFileTypes");
const UploaderSources_1 = require("../../../../commons/contracts/UploaderSources");
class CreateUploaderDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUploaderDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: UploaderFileTypes_1.default,
        default: UploaderFileTypes_1.default.image,
    }),
    __metadata("design:type", String)
], CreateUploaderDto.prototype, "file_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: UploaderSources_1.default,
        default: UploaderSources_1.default.chat_real_estate,
    }),
    __metadata("design:type", String)
], CreateUploaderDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "file", type: "string", format: "binary" }),
    __metadata("design:type", String)
], CreateUploaderDto.prototype, "file", void 0);
exports.CreateUploaderDto = CreateUploaderDto;
//# sourceMappingURL=create-uploader.dto.js.map