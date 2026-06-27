"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsAdvisorsAdminModule = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_advisors_service_1 = require("./real-estate-agents-advisors.service");
const real_estate_agents_advisors_controller_1 = require("./real-estate-agents-advisors.controller");
const client_service_1 = require("../../client/app/client.service");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("../../client/app/Transformer");
const Transformer_2 = require("./Transformer");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
let RealEstateAgentsAdvisorsAdminModule = class RealEstateAgentsAdvisorsAdminModule {
};
RealEstateAgentsAdvisorsAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [real_estate_agents_advisors_controller_1.RealEstateAgentsAdvisorsController],
        providers: [
            real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService,
            Transformer_2.default,
            client_service_1.ClientService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], RealEstateAgentsAdvisorsAdminModule);
exports.RealEstateAgentsAdvisorsAdminModule = RealEstateAgentsAdvisorsAdminModule;
//# sourceMappingURL=real-estate-agents-advisors.module.js.map