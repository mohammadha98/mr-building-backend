"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NotificationAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationAppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const notifications_service_1 = require("./notifications.service");
const notification_controller_1 = require("./notification.controller");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
let NotificationAppModule = NotificationAppModule_1 = class NotificationAppModule {
};
NotificationAppModule = NotificationAppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [notification_controller_1.NotificationController],
        providers: [
            notifications_service_1.NotificationsService,
            FcmNotificationService_1.default,
            httpResponsehandler_1.HttpResponsehandler,
            GoogleFCM_1.default,
        ],
        exports: [NotificationAppModule_1],
    })
], NotificationAppModule);
exports.NotificationAppModule = NotificationAppModule;
//# sourceMappingURL=notification.module.js.map