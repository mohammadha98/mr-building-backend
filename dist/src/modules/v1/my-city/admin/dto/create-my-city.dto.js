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
exports.CreateMyCityDto = exports.UploadFileMyCityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const myCity_category_enum_1 = require("../enums/myCity.category.enum");
const myCity_files_enum_1 = require("../enums/myCity.files.enum");
const delete_media_item_dto_1 = require("../../../real-estate-ads/app/dto/delete-media-item.dto");
class MyCityFile {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MyCityFile.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: myCity_files_enum_1.MyCityFilesEnum,
        default: `${myCity_files_enum_1.MyCityFilesEnum.file}, ${myCity_files_enum_1.MyCityFilesEnum.structural}, ${myCity_files_enum_1.MyCityFilesEnum.crooky}, ${myCity_files_enum_1.MyCityFilesEnum.architectural}, ${myCity_files_enum_1.MyCityFilesEnum.facilities}`,
    }),
    __metadata("design:type", String)
], MyCityFile.prototype, "tag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: delete_media_item_dto_1.RealEstateMediaItemTypes,
        default: delete_media_item_dto_1.RealEstateMediaItemTypes.temp,
    }),
    __metadata("design:type", String)
], MyCityFile.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MyCityFile.prototype, "file_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, required: false }),
    __metadata("design:type", String)
], MyCityFile.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: `image, video, file`,
        title: "media_type",
    }),
    __metadata("design:type", String)
], MyCityFile.prototype, "file_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MyCityFile.prototype, "sort_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        default: `primary, normal`,
        title: "priority",
    }),
    __metadata("design:type", String)
], MyCityFile.prototype, "priority", void 0);
class UploadFileMyCityDto extends MyCityFile {
}
__decorate([
    (0, swagger_1.ApiProperty)({ name: "file", type: "string", format: "binary" }),
    __metadata("design:type", String)
], UploadFileMyCityDto.prototype, "file", void 0);
exports.UploadFileMyCityDto = UploadFileMyCityDto;
class CreateMyCityDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: myCity_category_enum_1.MyCityCategoriesEnum,
        default: `${myCity_category_enum_1.MyCityCategoriesEnum.constructionProjects}, ${myCity_category_enum_1.MyCityCategoriesEnum.offices}, ${myCity_category_enum_1.MyCityCategoriesEnum.stores}, ${myCity_category_enum_1.MyCityCategoriesEnum.stores}`,
    }),
    __metadata("design:type", String)
], CreateMyCityDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CreateMyCityDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CreateMyCityDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CreateMyCityDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CreateMyCityDto.prototype, "number_of_rooms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CreateMyCityDto.prototype, "renovation_tax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CreateMyCityDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CreateMyCityDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CreateMyCityDto.prototype, "province_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], CreateMyCityDto.prototype, "city_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: MyCityFile }),
    __metadata("design:type", Array)
], CreateMyCityDto.prototype, "files", void 0);
exports.CreateMyCityDto = CreateMyCityDto;
//# sourceMappingURL=create-my-city.dto.js.map