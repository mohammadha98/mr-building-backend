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
exports.UploadFileRealEstateAdItemsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const RealEstateAdMediaType_1 = require("../../../../../commons/contracts/RealEstateAdMediaType");
const delete_media_item_dto_1 = require("./delete-media-item.dto");
const RealEstateAdMediaTypePriorities_1 = require("../../../../../commons/contracts/RealEstateAdMediaTypePriorities");
class UploadFileRealEstateAdItemsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: delete_media_item_dto_1.RealEstateMediaItemTypes,
        default: delete_media_item_dto_1.RealEstateMediaItemTypes.temp,
    }),
    __metadata("design:type", String)
], UploadFileRealEstateAdItemsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], UploadFileRealEstateAdItemsDto.prototype, "ad_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: RealEstateAdMediaTypePriorities_1.default,
        default: RealEstateAdMediaTypePriorities_1.default.normal,
    }),
    __metadata("design:type", String)
], UploadFileRealEstateAdItemsDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: RealEstateAdMediaType_1.default,
        title: "file_type",
        default: RealEstateAdMediaType_1.default.image,
    }),
    __metadata("design:type", String)
], UploadFileRealEstateAdItemsDto.prototype, "file_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "file", type: "string", format: "binary" }),
    __metadata("design:type", String)
], UploadFileRealEstateAdItemsDto.prototype, "file", void 0);
exports.UploadFileRealEstateAdItemsDto = UploadFileRealEstateAdItemsDto;
//# sourceMappingURL=upload-file-real-estate-ads.dto.js.map