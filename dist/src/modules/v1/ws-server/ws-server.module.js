"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WsServerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsServerModule = void 0;
const common_1 = require("@nestjs/common");
const ws_server_service_1 = require("./ws-server.service");
const ws_server_gateway_1 = require("./ws-server.gateway");
const jwt_1 = require("@nestjs/jwt");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
const client_service_1 = require("../client/app/client.service");
const Transformer_1 = require("../client/app/Transformer");
const Transformer_2 = require("../chat-real-estate/app/Transformer");
const Transformer_3 = require("../messenger/app/Transformer");
const messenger_channels_service_1 = require("../messenger_channels/app/messenger-channels.service");
const UploadService_1 = require("../../services/UploadService");
const Transformer_4 = require("../messenger_channels/app/Transformer");
const messenger_groups_service_1 = require("../messenger_groups/app/messenger-groups.service");
const Transformer_5 = require("../messenger_groups/app/Transformer");
const messenger_service_1 = require("../messenger/app/messenger.service");
const GoogleFCM_1 = require("../../services/notifications/fcm/providers/GoogleFCM");
const notifications_service_1 = require("../notifications/app/notifications.service");
const FcmNotificationService_1 = require("../../services/notifications/fcm/FcmNotificationService");
const mailerService_1 = require("../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../services/notifications/mailer/providers/MrBuildingMailerService");
const jwt_staregry_1 = require("../auth/strategies/jwt.staregry");
const TokenService_1 = require("../jwt-auth/services/TokenService");
const save_message_app_module_1 = require("../messenger-save-message/app/save-message-app.module");
const save_message_service_1 = require("../messenger-save-message/app/save-message.service");
const real_estate_agents_advisors_service_1 = require("../real-estate-agents-advisors/app/real-estate-agents-advisors.service");
const Transformer_6 = require("../real-estate-agents-advisors/app/Transformer");
const SmsService_1 = require("../../services/notifications/sms/SmsService");
const marketplace_messenger_module_1 = require("../marketplace-messenger/app/marketplace-messenger.module");
const marketplace_messenger_service_1 = require("../marketplace-messenger/app/marketplace-messenger.service");
const MarketplaceMessenger_factory_1 = require("../marketplace-messenger/app/factory/MarketplaceMessenger-factory");
let WsServerModule = WsServerModule_1 = class WsServerModule {
};
WsServerModule = WsServerModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            save_message_app_module_1.MessengerSaveMessageAppModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
            }),
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
            marketplace_messenger_module_1.MarketplaceChatAppModule,
        ],
        providers: [
            ws_server_gateway_1.WsServerGateway,
            ws_server_service_1.WsServerService,
            jwt_staregry_1.JwtStrategy,
            jwt_1.JwtService,
            TokenService_1.TokenService,
            client_service_1.ClientService,
            Transformer_1.default,
            Transformer_2.default,
            Transformer_3.default,
            messenger_channels_service_1.MessengerChannelsService,
            messenger_groups_service_1.MessengerGroupsService,
            Transformer_4.default,
            Transformer_5.default,
            messenger_service_1.MessengerService,
            UploadService_1.default,
            notifications_service_1.NotificationsService,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            save_message_service_1.MessengerSaveMessageService,
            real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService,
            Transformer_6.default,
            marketplace_messenger_service_1.MarketplaceMessengerService,
            MarketplaceMessenger_factory_1.MarketplaceMessengerFactory,
            SmsService_1.default,
        ],
        exports: [ws_server_gateway_1.WsServerGateway, ws_server_service_1.WsServerService, WsServerModule_1],
    })
], WsServerModule);
exports.WsServerModule = WsServerModule;
//# sourceMappingURL=ws-server.module.js.map