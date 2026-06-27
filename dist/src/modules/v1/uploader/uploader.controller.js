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
exports.UploaderController = void 0;
const common_1 = require("@nestjs/common");
const uploader_service_1 = require("./uploader.service");
const create_uploader_dto_1 = require("./dto/create-uploader.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../jwt-auth/jwt-auth.guard");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const forbiddenErrorHandler_1 = require("../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const multer_util_1 = require("../../../commons/utils/multer.util");
const uploaded_file_decorator_1 = require("../../../commons/decorators/uploaded-file.decorator");
let UploaderController = class UploaderController {
    constructor(uploaderService, responseHandler) {
        this.uploaderService = uploaderService;
        this.responseHandler = responseHandler;
    }
    async uploaderFile(body, file, req, res) {
        body.file = file.filename;
        body.size = file.size;
        body.client_id = req.user.id;
        console.log("*** Global Uploader ***");
        console.log(body);
        const result = await this.uploaderService.uploaderFile(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "آپلود با موفقیت انجام شد.", result.result);
    }
};
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_util_1.MulterDiskStorage)("temp/files/"),
    })),
    (0, swagger_1.ApiOperation)({ summary: "آپلود فایل" }),
    (0, common_1.Post)("file"),
    (0, swagger_1.ApiBody)({ type: create_uploader_dto_1.CreateUploaderDto }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, uploaded_file_decorator_1.CustomUploadedFileDecorator)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_uploader_dto_1.CreateUploaderDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UploaderController.prototype, "uploaderFile", null);
UploaderController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app-uploader"),
    (0, common_1.Controller)("v1/app/uploader"),
    __metadata("design:paramtypes", [uploader_service_1.UploaderService,
        httpResponsehandler_1.HttpResponsehandler])
], UploaderController);
exports.UploaderController = UploaderController;
//# sourceMappingURL=uploader.controller.js.map