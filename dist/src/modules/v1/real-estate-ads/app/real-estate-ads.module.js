"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RealEstateAdsModuleApp_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAdsModuleApp = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_service_app_service_1 = require("./real-estate-ads-service-app.service");
const real_estate_ads_controller_1 = require("./real-estate-ads.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const RealEstateAdsPostgresqlRepository_1 = require("../repositories/RealEstateAdsPostgresqlRepository");
const client_module_1 = require("../../client/app/client.module");
const client_service_1 = require("../../client/app/client.service");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const real_estate_ads_service_1 = require("../robotScraper/real-estate-ads.service");
const Transformer_2 = require("../robotScraper/Transformer");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
let RealEstateAdsModuleApp = RealEstateAdsModuleApp_1 = class RealEstateAdsModuleApp {
};
RealEstateAdsModuleApp = RealEstateAdsModuleApp_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => ({
                    store: redisStore.redisStore,
                    host: "localhost",
                    port: 6379,
                    database: 10,
                    ttl: 60,
                    password: process.env.APP_MODE !== "development" && process.env.REDIS_PASSWORD,
                }),
            }),
            client_module_1.ClientModule,
            nestjs_form_data_1.NestjsFormDataModule,
        ],
        controllers: [real_estate_ads_controller_1.RealEstateAdsSettingsController],
        providers: [
            httpResponsehandler_1.HttpResponsehandler,
            real_estate_ads_service_app_service_1.RealEstateAdsServiceApp,
            RealEstateAdsPostgresqlRepository_1.default,
            Transformer_1.default,
            client_service_1.ClientService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            real_estate_ads_service_1.RealEstateAdsService_robotScraper,
            Transformer_2.default,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            SmsService_1.default,
        ],
        exports: [
            RealEstateAdsModuleApp_1,
            real_estate_ads_service_app_service_1.RealEstateAdsServiceApp,
            RealEstateAdsPostgresqlRepository_1.default,
            Transformer_1.default,
            cache_manager_1.CacheModule,
            client_module_1.ClientModule,
            real_estate_ads_service_1.RealEstateAdsService_robotScraper,
            Transformer_2.default,
            SmsService_1.default,
        ],
    })
], RealEstateAdsModuleApp);
exports.RealEstateAdsModuleApp = RealEstateAdsModuleApp;
//# sourceMappingURL=real-estate-ads.module.js.map