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
exports.DbBackupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const internalServerErrorHandler_1 = require("../../services/httpResponseHandler/internalServerErrorHandler");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const dbBackup_service_1 = require("./dbBackup.service");
const Transformer_1 = require("./Transformer");
const AdminTokenAuthGuard_1 = require("../jwt-auth/AdminTokenAuthGuard");
const forbiddenErrorHandler_1 = require("../../services/httpResponseHandler/forbiddenErrorHandler");
const Pagination_dto_1 = require("../../../commons/contracts/Pagination.dto");
let DbBackupController = class DbBackupController {
    constructor(backupsService, backupTransFormer, responseHandler) {
        this.backupsService = backupsService;
        this.backupTransFormer = backupTransFormer;
        this.responseHandler = responseHandler;
    }
    async saveNewBackup() {
        console.log("saveNewBackup: ADMIN");
        return this.backupsService.saveBackup();
    }
    async createZipPublicDir(res, req) {
        const user_id = req.user.id;
        console.log("saveNewBackup: ADMIN");
        console.log({ user_id });
        const result = await this.backupsService.createZipPublicDir(user_id);
        console.log(result.status);
        if (result.status === 401) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responseHandler.send(res, 201, "عملیات با موفقیت انجلم شد.");
    }
    async getBackupList(qeury, res, req) {
        qeury.user_id = req.user.id;
        console.log("getBackupList: ADMIN");
        console.log({ qeury });
        const result = await this.backupsService.getBackupList(qeury);
        console.log(result.status);
        if (result.status === 401) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.backupTransFormer.collection(result.result);
        return this.responseHandler.send(res, 200, "لیست بکاپ ها در دسترس است", {
            data: transformer,
            metadata: result.metadata,
        });
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "ذخیره و دریافت بکاپ از دیتابیس" }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DbBackupController.prototype, "saveNewBackup", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "بکاپ گیری از فایل ها" }),
    (0, common_1.Get)("file"),
    __param(0, (0, common_1.Response)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DbBackupController.prototype, "createZipPublicDir", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست بکاپ ها در دسترس است",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست بکاپ ها در دسترس است",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    link: { type: "string" },
                                    created_at: { type: "object" },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست بکاپ ها" }),
    (0, common_1.Get)("/list"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Response)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DbBackupController.prototype, "getBackupList", null);
DbBackupController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin-backups"),
    (0, common_1.Controller)("v1/admin/backups"),
    __metadata("design:paramtypes", [dbBackup_service_1.DbBackupService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], DbBackupController);
exports.DbBackupController = DbBackupController;
//# sourceMappingURL=dbBackup.controller.js.map