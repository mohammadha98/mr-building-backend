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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const banner_service_1 = require("./banner.service");
const banner_slider_dto_1 = require("./dto/banner-slider.dto");
const update_banner_dto_1 = require("./dto/update-banner.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const InternalServerErrorSchema_1 = require("../../../commons/contracts/swaggerDefinations/InternalServerErrorSchema");
const PaginationSchema_1 = require("../../../commons/contracts/PaginationSchema");
const check_file_middleware_1 = require("../../../middlewares/check-file.middleware");
const AdminTokenAuthGuard_1 = require("../jwt-auth/AdminTokenAuthGuard");
const swagger_consumes_1 = require("../../../commons/enums/swagger.consumes");
let BannerController = class BannerController {
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async create(createSliderDto, thumbnail) {
        createSliderDto.thumbnail = thumbnail.filename;
        return this.bannerService.create(createSliderDto);
    }
    async findAll(query) {
        return this.bannerService.findAll(query);
    }
    async update(body, file) {
        body.file = file ? file.filename : null;
        console.log("*** Update Banner ***");
        console.log({ body });
        return this.bannerService.update(body);
    }
    async remove(id) {
        return this.bannerService.remove(+id);
    }
};
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("thumbnail", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/banners",
            filename(req, file, callback) {
                const filename = (0, path_1.parse)((0, path_1.join)(file.originalname)).name;
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${filename}-${Date.now()}${extention}`);
            },
        }),
    })),
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.MultipartData),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره بنر" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [banner_slider_dto_1.BannerSliderDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: InternalServerErrorSchema_1.default,
        description: "خطای سرور. لطفا کمی بعد تلاش کنید",
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(InternalServerErrorSchema_1.default),
        },
    }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaginationSchema_1.PaginationSchema]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)("update"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/banners",
            filename(req, file, callback) {
                const filename = (0, path_1.parse)((0, path_1.join)(file.originalname)).name;
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${filename}-${Date.now()}${extention}`);
            },
        }),
    }), check_file_middleware_1.CheckFileMiddleware),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.MultipartData),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_banner_dto_1.UpdateBannerDto, Object]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "remove", null);
BannerController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin/banner"),
    (0, common_1.Controller)("v2/admin/banner"),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
exports.BannerController = BannerController;
//# sourceMappingURL=banner.controller.js.map