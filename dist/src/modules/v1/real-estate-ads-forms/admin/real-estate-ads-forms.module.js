"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RealEstateAdsFormsModuleAdmin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAdsFormsModuleAdmin = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_forms_service_1 = require("./real-estate-ads-forms.service");
const real_estate_ads_forms_controller_1 = require("./real-estate-ads-forms.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const RealEstateAdsFormsPostgresqlRepository_1 = require("../repositories/RealEstateAdsFormsPostgresqlRepository");
const client_module_1 = require("../../client/admin/client.module");
const client_service_1 = require("../../client/admin/client.service");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
let RealEstateAdsFormsModuleAdmin = RealEstateAdsFormsModuleAdmin_1 = class RealEstateAdsFormsModuleAdmin {
};
RealEstateAdsFormsModuleAdmin = RealEstateAdsFormsModuleAdmin_1 = __decorate([
    (0, common_1.Module)({
        imports: [client_module_1.ClientModule, nestjs_form_data_1.NestjsFormDataModule],
        controllers: [real_estate_ads_forms_controller_1.RealEstateAdsFormsController],
        providers: [
            real_estate_ads_forms_service_1.RealEstateAdsFormsService,
            httpResponsehandler_1.HttpResponsehandler,
            RealEstateAdsFormsPostgresqlRepository_1.default,
            Transformer_1.default,
            client_service_1.ClientService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
        exports: [
            RealEstateAdsFormsModuleAdmin_1,
            real_estate_ads_forms_service_1.RealEstateAdsFormsService,
            RealEstateAdsFormsPostgresqlRepository_1.default,
            RealEstateAdsFormsModuleAdmin_1,
        ],
    })
], RealEstateAdsFormsModuleAdmin);
exports.RealEstateAdsFormsModuleAdmin = RealEstateAdsFormsModuleAdmin;
//# sourceMappingURL=real-estate-ads-forms.module.js.map