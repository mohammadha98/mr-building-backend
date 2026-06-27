"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsModule = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_service_1 = require("./real-estate-agents.service");
const real_estate_agents_controller_1 = require("./real-estate-agents.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../../client/admin/client.service");
const Transformer_1 = require("./Transformer");
const RealEstateAgentsPostgresqlRepository_1 = require("../repositories/RealEstateAgentsPostgresqlRepository");
const real_estate_agents_comments_module_1 = require("../../real-estate-agents-comments/app/real-estate-agents-comments.module");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../../real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository");
const channel_real_estate_service_1 = require("../../channel-real-estate/app/channel-real-estate.service");
const RealEstateAdsPostgresqlRepository_1 = require("../../real-estate-ads/repositories/RealEstateAdsPostgresqlRepository");
const Transformer_2 = require("../../real-estate-ads/admin/Transformer");
const Transformer_3 = require("../../real-estate-agents-comments/admin/Transformer");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const messenger_channel_module_1 = require("../../messenger_channels/app/messenger-channel.module");
const UploadService_1 = require("../../../services/UploadService");
let RealEstateAgentsModule = class RealEstateAgentsModule {
};
RealEstateAgentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_form_data_1.NestjsFormDataModule,
            real_estate_agents_comments_module_1.RealEstateAgentsCommentsModuleApp,
            messenger_channel_module_1.MessengerChannelAppModule,
        ],
        controllers: [real_estate_agents_controller_1.RealEstateAgentsController],
        providers: [
            real_estate_agents_service_1.RealEstateAgentsService,
            httpResponsehandler_1.HttpResponsehandler,
            RealEstateAgentsPostgresqlRepository_1.default,
            RealEstateAgentsCommentsPostgresqlRepository_1.default,
            client_service_1.ClientService,
            Transformer_1.default,
            channel_real_estate_service_1.ChannelRealEstateService,
            RealEstateAdsPostgresqlRepository_1.default,
            Transformer_2.default,
            Transformer_3.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            UploadService_1.default,
        ],
    })
], RealEstateAgentsModule);
exports.RealEstateAgentsModule = RealEstateAgentsModule;
//# sourceMappingURL=real-estate-agents.module.js.map