"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorefrontModule = void 0;
const common_1 = require("@nestjs/common");
const storefront_service_1 = require("./storefront.service");
const storefront_controller_1 = require("./storefront.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../../client/admin/client.service");
const Transformer_1 = require("./Transformer");
const StorefrontPostgresqlRepository_1 = require("../repositories/StorefrontPostgresqlRepository");
const real_estate_agents_comments_module_1 = require("../../real-estate-agents-comments/app/real-estate-agents-comments.module");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../../real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository");
const channel_real_estate_service_1 = require("../../channel-real-estate/app/channel-real-estate.service");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
let StorefrontModule = class StorefrontModule {
};
StorefrontModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, real_estate_agents_comments_module_1.RealEstateAgentsCommentsModuleApp],
        controllers: [storefront_controller_1.StorefrontController],
        providers: [
            storefront_service_1.StorefrontService,
            httpResponsehandler_1.HttpResponsehandler,
            StorefrontPostgresqlRepository_1.default,
            RealEstateAgentsCommentsPostgresqlRepository_1.default,
            client_service_1.ClientService,
            Transformer_1.default,
            channel_real_estate_service_1.ChannelRealEstateService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], StorefrontModule);
exports.StorefrontModule = StorefrontModule;
//# sourceMappingURL=storefront.module.js.map