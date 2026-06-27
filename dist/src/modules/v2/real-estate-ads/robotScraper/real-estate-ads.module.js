"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAdsModuleRobotScraper = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_service_1 = require("./real-estate-ads.service");
const real_estate_ads_controller_1 = require("./real-estate-ads.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const RealEstateAdsPostgresqlRepository_1 = require("../repositories/RealEstateAdsPostgresqlRepository");
const client_module_1 = require("../../client/app/client.module");
const client_service_1 = require("../../client/app/client.service");
const nestjs_form_data_1 = require("nestjs-form-data");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const Transformer_1 = require("./Transformer");
let RealEstateAdsModuleRobotScraper = class RealEstateAdsModuleRobotScraper {
};
RealEstateAdsModuleRobotScraper = __decorate([
    (0, common_1.Module)({
        imports: [client_module_1.ClientModule, nestjs_form_data_1.NestjsFormDataModule],
        controllers: [real_estate_ads_controller_1.RealEstateAdsRobotScraperController],
        providers: [
            real_estate_ads_service_1.RealEstateAdsService_robotScraper,
            httpResponsehandler_1.HttpResponsehandler,
            RealEstateAdsPostgresqlRepository_1.default,
            client_service_1.ClientService,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], RealEstateAdsModuleRobotScraper);
exports.RealEstateAdsModuleRobotScraper = RealEstateAdsModuleRobotScraper;
//# sourceMappingURL=real-estate-ads.module.js.map