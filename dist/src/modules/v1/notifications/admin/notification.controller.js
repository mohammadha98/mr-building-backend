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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const notifications_service_1 = require("./notifications.service");
const save_notification_token_dto_1 = require("./dto/save-notification-token.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const swagger_consumes_1 = require("../../../../commons/enums/swagger.consumes");
const create_client_notification_dto_1 = require("./dto/create-client-notification.dto");
let NotificationController = class NotificationController {
    constructor(notificationsService, responseHandler) {
        this.notificationsService = notificationsService;
        this.responseHandler = responseHandler;
    }
    async saveNotificationForAdminUser(body, req, res) {
        body.client_id = req.user.id;
        console.log("saveNotificationForAdminUser");
        console.log(body);
        const result = await this.notificationsService.saveNotificationForAdminUser(body);
        if (result.status === 500) {
            throw new common_1.InternalServerErrorException();
        }
        return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد.");
    }
    async sendGeneralNotification(body) {
        console.log("sendGeneralNotification");
        console.log({ body });
        return await this.notificationsService.sendGeneralNotification(body);
    }
    async GetGeneralNotification() {
        console.log("GetGeneralNotification");
        return await this.notificationsService.getGeneralNotification();
    }
};
__decorate([
    (0, common_1.Post)("admin"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiOperation)({ summary: "ذخیره توکن fcm ادمین پنل" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_notification_token_dto_1.SaveNotificationTokenDto, Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "saveNotificationForAdminUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "نوتیف عمومی" }),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_notification_dto_1.CreateGeneralNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendGeneralNotification", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "دریافت نوتیف عمومی" }),
    (0, swagger_1.ApiConsumes)(swagger_consumes_1.SwaggerConsumes.Json),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "GetGeneralNotification", null);
NotificationController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/admin/notification"),
    (0, common_1.Controller)("v1/admin/notification"),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        httpResponsehandler_1.HttpResponsehandler])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map