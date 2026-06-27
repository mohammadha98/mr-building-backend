"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePageModule = void 0;
const common_1 = require("@nestjs/common");
const home_page_service_1 = require("./home-page.service");
const home_page_controller_1 = require("./home-page.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const transformer_app_1 = require("../slider/contracts/transformer-app");
const real_estate_agents_module_1 = require("../real-estate-agents/app/real-estate-agents.module");
const real_estate_agents_service_1 = require("../real-estate-agents/app/real-estate-agents.service");
const Transformer_1 = require("../real-estate-agents/app/Transformer");
const client_module_1 = require("../client/app/client.module");
const client_service_1 = require("../client/app/client.service");
const RealEstateAgentsPostgresqlRepository_1 = require("../real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository");
const force_update_module_1 = require("../force-update/admin/force-update.module");
const force_update_service_1 = require("../force-update/admin/force-update.service");
const Transformer_2 = require("../force-update/admin/Transformer");
const UserPrismaRepository_1 = require("../users/admin/repositories/UserPrismaRepository");
const Transformer_3 = require("./Transformer");
const Transformer_4 = require("../real-estate-agents-advisors/app/Transformer");
const Transformer_5 = require("../real-estate-agents-admins/app/Transformer");
const mailerService_1 = require("../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../services/notifications/mailer/providers/MrBuildingMailerService");
const FcmNotificationService_1 = require("../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../services/notifications/fcm/providers/GoogleFCM");
const transformer_admin_1 = require("../slider/contracts/transformer-admin");
const messenger_channel_module_1 = require("../messenger_channels/app/messenger-channel.module");
const messenger_channels_service_1 = require("../messenger_channels/app/messenger-channels.service");
const UploadService_1 = require("../../services/UploadService");
const transformer_app_2 = require("../banners/contracts/transformer-app");
let HomePageModule = class HomePageModule {
};
HomePageModule = __decorate([
    (0, common_1.Module)({
        imports: [client_module_1.ClientModule, real_estate_agents_module_1.RealEstateAgentsModuleApp, messenger_channel_module_1.MessengerChannelAppModule],
        controllers: [home_page_controller_1.HomePageController],
        providers: [
            home_page_service_1.HomePageService,
            Transformer_3.default,
            httpResponsehandler_1.HttpResponsehandler,
            transformer_app_1.default,
            client_service_1.ClientService,
            real_estate_agents_service_1.RealEstateAgentsService,
            Transformer_1.default,
            RealEstateAgentsPostgresqlRepository_1.default,
            force_update_module_1.ForceUpdateAdminModule,
            force_update_service_1.ForceUpdateService,
            Transformer_2.default,
            Transformer_4.default,
            UserPrismaRepository_1.default,
            Transformer_5.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            FcmNotificationService_1.default,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            transformer_admin_1.default,
            transformer_app_2.default,
            messenger_channels_service_1.MessengerChannelsService,
            UploadService_1.default,
        ],
    })
], HomePageModule);
exports.HomePageModule = HomePageModule;
//# sourceMappingURL=home-page.module.js.map