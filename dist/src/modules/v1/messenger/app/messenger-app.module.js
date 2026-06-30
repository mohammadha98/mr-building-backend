"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessengerAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerAppModule = void 0;
const common_1 = require("@nestjs/common");
const messenger_controller_1 = require("./messenger.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../../client/app/client.service");
const client_module_1 = require("../../client/app/client.module");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
const Transformer_1 = require("../../chat-real-estate/app/Transformer");
const Transformer_2 = require("../../messenger/app/Transformer");
const messenger_channels_service_1 = require("../../messenger_channels/app/messenger-channels.service");
const messenger_groups_service_1 = require("../../messenger_groups/app/messenger-groups.service");
const Transformer_3 = require("../../messenger_channels/app/Transformer");
const Transformer_4 = require("../../messenger_groups/app/Transformer");
const UploadService_1 = require("../../../services/UploadService");
const notifications_service_1 = require("../../notifications/app/notifications.service");
const real_estate_agents_service_1 = require("../../real-estate-agents/app/real-estate-agents.service");
const Transformer_5 = require("../../real-estate-agents/app/Transformer");
const RealEstateAgentsPostgresqlRepository_1 = require("../../real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository");
const force_update_module_1 = require("../../force-update/admin/force-update.module");
const force_update_service_1 = require("../../force-update/admin/force-update.service");
const Transformer_6 = require("../../force-update/admin/Transformer");
const Transformer_7 = require("../../real-estate-agents-advisors/app/Transformer");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const Transformer_8 = require("../../real-estate-agents-admins/app/Transformer");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
const save_message_app_module_1 = require("../../messenger-save-message/app/save-message-app.module");
const save_message_service_1 = require("../../messenger-save-message/app/save-message.service");
const messenger_service_1 = require("./messenger.service");
let MessengerAppModule = MessengerAppModule_1 = class MessengerAppModule {
};
MessengerAppModule = MessengerAppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_form_data_1.NestjsFormDataModule,
            client_module_1.ClientModule,
            save_message_app_module_1.MessengerSaveMessageAppModule,
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => ({
                    store: redisStore.redisStore,
                    socket: Object.assign({ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT || '6379', 10) }, (process.env.REDIS_TLS === 'true' && { tls: true })),
                    database: 0,
                    ttl: null,
                    password: process.env.APP_MODE !== 'development'
                        ? process.env.REDIS_PASSWORD
                        : undefined,
                }),
            }),
        ],
        controllers: [messenger_controller_1.MessengerController],
        providers: [
            messenger_service_1.MessengerService,
            httpResponsehandler_1.HttpResponsehandler,
            client_service_1.ClientService,
            Transformer_4.default,
            Transformer_3.default,
            client_service_1.ClientService,
            real_estate_agents_service_1.RealEstateAgentsService,
            Transformer_5.default,
            RealEstateAgentsPostgresqlRepository_1.default,
            force_update_module_1.ForceUpdateAdminModule,
            force_update_service_1.ForceUpdateService,
            Transformer_6.default,
            Transformer_7.default,
            UserPrismaRepository_1.default,
            Transformer_8.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            FcmNotificationService_1.default,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            Transformer_2.default,
            Transformer_1.default,
            messenger_channels_service_1.MessengerChannelsService,
            UploadService_1.default,
            messenger_groups_service_1.MessengerGroupsService,
            Transformer_3.default,
            Transformer_4.default,
            notifications_service_1.NotificationsService,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            save_message_service_1.MessengerSaveMessageService,
        ],
        exports: [messenger_service_1.MessengerService, MessengerAppModule_1],
    })
], MessengerAppModule);
exports.MessengerAppModule = MessengerAppModule;
//# sourceMappingURL=messenger-app.module.js.map