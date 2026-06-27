"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RealEstateAgentsModuleApp_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsModuleApp = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_service_1 = require("./real-estate-agents.service");
const real_estate_agents_controller_1 = require("./real-estate-agents.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../../client/app/client.service");
const Transformer_1 = require("./Transformer");
const RealEstateAgentsPostgresqlRepository_1 = require("../repositories/RealEstateAgentsPostgresqlRepository");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const UploadService_1 = require("../../../services/UploadService");
const messenger_channel_module_1 = require("../../messenger_channels/app/messenger-channel.module");
let RealEstateAgentsModuleApp = RealEstateAgentsModuleApp_1 = class RealEstateAgentsModuleApp {
};
RealEstateAgentsModuleApp = RealEstateAgentsModuleApp_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, messenger_channel_module_1.MessengerChannelAppModule],
        controllers: [real_estate_agents_controller_1.RealEstateAgentsController],
        providers: [
            real_estate_agents_service_1.RealEstateAgentsService,
            httpResponsehandler_1.HttpResponsehandler,
            RealEstateAgentsPostgresqlRepository_1.default,
            client_service_1.ClientService,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            UploadService_1.default,
        ],
        exports: [
            RealEstateAgentsModuleApp_1,
            real_estate_agents_service_1.RealEstateAgentsService,
            Transformer_1.default,
            RealEstateAgentsPostgresqlRepository_1.default,
        ],
    })
], RealEstateAgentsModuleApp);
exports.RealEstateAgentsModuleApp = RealEstateAgentsModuleApp;
//# sourceMappingURL=real-estate-agents.module.js.map