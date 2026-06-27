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
exports.MyCityController = void 0;
const common_1 = require("@nestjs/common");
const my_city_service_1 = require("./my-city.service");
const swagger_1 = require("@nestjs/swagger");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const pagination_decorator_1 = require("../../../../commons/decorators/pagination.decorator");
const create_my_city_dto_1 = require("./dto/create-my-city.dto");
const update_location_my_city_dto_1 = require("./dto/update-location-my-city.dto");
const update_my_city_dto_1 = require("./dto/update-my-city.dto");
const query_geolocation_dto_1 = require("./dto/query-geolocation.dto");
const find_my_near_dto_1 = require("./dto/find-my-near.dto");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
const pagination_dto_1 = require("../../../../commons/dto/pagination.dto");
let MyCityController = class MyCityController {
    constructor(myCityService) {
        this.myCityService = myCityService;
    }
    async UploadTempFile(body, file) {
        console.log("*** UploadFile: Location in MyCity ***");
        console.log({ file });
        body.file = file.filename;
        console.log({ body });
        return await this.myCityService.UploadFile(body);
    }
    create(createGeolocationDto) {
        console.log("CreateGeolocationDto");
        console.log(createGeolocationDto);
        return this.myCityService.create(createGeolocationDto);
    }
    findAll(query) {
        console.log("GetLocaionInMyCity");
        console.log({ query });
        return this.myCityService.findAll(query);
    }
    findAllMe(query) {
        return this.myCityService.myLocations(query);
    }
    findNear(body) {
        return this.myCityService.findNearLocations(body);
    }
    locationDetails(id) {
        return this.myCityService.locationDetails(id);
    }
    updateLocationInMyCity(id, body) {
        console.log("updateLocationInMyCity");
        console.log({ id });
        console.log({ body });
        return this.myCityService.updateLocationInMyCity(id, body);
    }
    update(id, updateGeolocationDto) {
        return this.myCityService.update(id, updateGeolocationDto);
    }
    remove(id) {
        return this.myCityService.remove(id);
    }
    removeFile(id) {
        return this.myCityService.removeFile(id);
    }
    changePriorityFile(id) {
        return this.myCityService.changePriorityFile(id);
    }
};
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/mycity/",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(3).toString("hex").toUpperCase();
                const extension = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                const filename = `${Date.now()}-${uniqueCode}${extension}`;
                callback(null, filename);
            },
        }),
    })),
    (0, swagger_1.ApiOperation)({ summary: "آپلود فایل" }),
    (0, common_1.Post)("file"),
    (0, swagger_1.ApiBody)({ type: create_my_city_dto_1.UploadFileMyCityDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_my_city_dto_1.UploadFileMyCityDto, Object]),
    __metadata("design:returntype", Promise)
], MyCityController.prototype, "UploadTempFile", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " ثبت لوکیشن جدید " }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_my_city_dto_1.CreateMyCityDto]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "لیست لوکیشن" }),
    (0, common_1.Get)(),
    (0, pagination_decorator_1.Pagination)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_geolocation_dto_1.GetLocaionInMyCity]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " لیست لوکیشن های من" }),
    (0, common_1.Get)("my-location"),
    (0, pagination_decorator_1.Pagination)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "findAllMe", null);
__decorate([
    (0, common_1.Post)("findNear"),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " لوکیشن های نزدیک من " }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_my_near_dto_1.MayNearDto]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "findNear", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: "مشخصات لوکیشن" }),
    (0, common_1.Get)("details/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "locationDetails", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " بروزرسانی لوکیشن  " }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_location_my_city_dto_1.UpdateLocationInMyCity]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "updateLocationInMyCity", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " بروزرسانی لوکیشن  " }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_my_city_dto_1.UpdateMyCityDto]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " حذف لوکیشن  " }),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " حذف فایل  " }),
    (0, common_1.Delete)("file/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "removeFile", null);
__decorate([
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, swagger_1.ApiOperation)({ summary: " تغییر اولویت فایل به اصلی " }),
    (0, common_1.Patch)("file"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MyCityController.prototype, "changePriorityFile", null);
MyCityController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app/my-city"),
    (0, common_1.Controller)("v1/app/my-city"),
    __metadata("design:paramtypes", [my_city_service_1.MyCityService])
], MyCityController);
exports.MyCityController = MyCityController;
//# sourceMappingURL=my-city.controller.js.map