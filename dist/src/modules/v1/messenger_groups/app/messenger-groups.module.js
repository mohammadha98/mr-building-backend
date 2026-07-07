"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessengerGroupsAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerGroupsAppModule = void 0;
const common_1 = require("@nestjs/common");
const messenger_groups_service_1 = require("./messenger-groups.service");
const messenger_groups_controller_1 = require("./messenger-groups.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("./Transformer");
const UploadService_1 = require("../../../services/UploadService");
const notifications_service_1 = require("../../notifications/app/notifications.service");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
const Transformer_2 = require("./Transformer");
let MessengerGroupsAppModule = MessengerGroupsAppModule_1 = class MessengerGroupsAppModule {
};
MessengerGroupsAppModule = MessengerGroupsAppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [messenger_groups_controller_1.MessengerGroupsController],
        providers: [
            messenger_groups_service_1.MessengerGroupsService,
            Transformer_2.default,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
            UploadService_1.default,
            notifications_service_1.NotificationsService,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
        ],
        exports: [
            messenger_groups_service_1.MessengerGroupsService,
            Transformer_2.default,
            messenger_groups_service_1.MessengerGroupsService,
            MessengerGroupsAppModule_1,
        ],
    })
], MessengerGroupsAppModule);
exports.MessengerGroupsAppModule = MessengerGroupsAppModule;
//# sourceMappingURL=messenger-groups.module.js.map