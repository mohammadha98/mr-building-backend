"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ReportAdminModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportAdminModule = void 0;
const common_1 = require("@nestjs/common");
const report_controller_1 = require("./report.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const report_service_1 = require("./report.service");
const Transformer_2 = require("./Transformer");
const client_service_1 = require("../../client/admin/client.service");
const client_module_1 = require("../../client/admin/client.module");
const webinar_service_1 = require("../../webinar/app/webinar.service");
const event_rooms_service_1 = require("../../event-rooms/app/event-rooms.service");
const event_groups_service_1 = require("../../events/group/app/event-groups.service");
const real_estate_agents_service_1 = require("../../real-estate-agents/admin/real-estate-agents.service");
const real_estate_agents_advisors_service_1 = require("../../real-estate-agents-advisors/admin/real-estate-agents-advisors.service");
const channel_real_estate_service_1 = require("../../channel-real-estate/app/channel-real-estate.service");
const chat_real_estate_service_1 = require("../../chat-real-estate/app/chat-real-estate.service");
const RealEstateAgentsPostgresqlRepository_1 = require("../../real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository");
const Transformer_3 = require("../../real-estate-agents-advisors/admin/Transformer");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Transformer_4 = require("../../chat-real-estate/app/Transformer");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../../real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
const RealEstateAdsPostgresqlRepository_1 = require("../../real-estate-ads/repositories/RealEstateAdsPostgresqlRepository");
const users_module_1 = require("../../users/admin/users.module");
const users_service_1 = require("../../users/admin/users.service");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const jwt_1 = require("@nestjs/jwt");
const real_estate_ads_service_1 = require("../../real-estate-ads/admin/real-estate-ads.service");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
const real_estate_ads_module_1 = require("../../real-estate-ads/app/real-estate-ads.module");
const Transformer_5 = require("../../event-rooms/app/Transformer");
const messenger_channels_service_1 = require("../../messenger_channels/app/messenger-channels.service");
const messenger_channel_module_1 = require("../../messenger_channels/app/messenger-channel.module");
const UploadService_1 = require("../../../services/UploadService");
let ReportAdminModule = ReportAdminModule_1 = class ReportAdminModule {
};
ReportAdminModule = ReportAdminModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            client_module_1.ClientModule,
            users_module_1.UsersModule,
            real_estate_ads_module_1.RealEstateAdsModuleApp,
            messenger_channel_module_1.MessengerChannelAppModule,
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => ({
                    store: redisStore.redisStore,
                    host: "localhost",
                    port: 6379,
                    database: 12,
                    ttl: 60,
                    password: process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
                }),
            }),
        ],
        controllers: [report_controller_1.ReportController],
        providers: [
            client_service_1.ClientService,
            users_service_1.UsersService,
            jwt_1.JwtService,
            report_service_1.ReportService,
            Transformer_1.default,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_2.default,
            UserPrismaRepository_1.default,
            webinar_service_1.WebinarService,
            event_rooms_service_1.EventRoomsService,
            event_groups_service_1.eventGroupsService,
            real_estate_agents_service_1.RealEstateAgentsService,
            RealEstateAgentsPostgresqlRepository_1.default,
            RealEstateAgentsCommentsPostgresqlRepository_1.default,
            real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService,
            channel_real_estate_service_1.ChannelRealEstateService,
            chat_real_estate_service_1.ChatRealEstateService,
            Transformer_3.default,
            SmsService_1.default,
            Transformer_4.default,
            RealEstateAdsPostgresqlRepository_1.default,
            real_estate_ads_service_1.RealEstateAdsService,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            Transformer_5.default,
            messenger_channels_service_1.MessengerChannelsService,
            UploadService_1.default,
        ],
        exports: [ReportAdminModule_1, report_service_1.ReportService, Transformer_1.default],
    })
], ReportAdminModule);
exports.ReportAdminModule = ReportAdminModule;
//# sourceMappingURL=report.module.js.map