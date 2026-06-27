"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAdsModuleAdmin = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_service_1 = require("./real-estate-ads.service");
const real_estate_ads_controller_1 = require("./real-estate-ads.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const RealEstateAdsPostgresqlRepository_1 = require("../repositories/RealEstateAdsPostgresqlRepository");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const users_service_1 = require("../../users/admin/users.service");
const users_module_1 = require("../../users/admin/users.module");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const jwt_1 = require("@nestjs/jwt");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
const report_module_1 = require("../../reports/admin/report.module");
const real_estate_ads_module_1 = require("../app/real-estate-ads.module");
const real_estate_ads_service_app_service_1 = require("../app/real-estate-ads-service-app.service");
const UploadService_1 = require("../../../services/UploadService");
let RealEstateAdsModuleAdmin = class RealEstateAdsModuleAdmin {
};
RealEstateAdsModuleAdmin = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            nestjs_form_data_1.NestjsFormDataModule,
            report_module_1.ReportAdminModule,
            real_estate_ads_module_1.RealEstateAdsModuleApp,
        ],
        controllers: [real_estate_ads_controller_1.RealEstateAdsSettingsController],
        providers: [
            real_estate_ads_service_1.RealEstateAdsService,
            httpResponsehandler_1.HttpResponsehandler,
            RealEstateAdsPostgresqlRepository_1.default,
            users_service_1.UsersService,
            UserPrismaRepository_1.default,
            jwt_1.JwtService,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
            real_estate_ads_service_app_service_1.RealEstateAdsServiceApp,
            UploadService_1.default,
        ],
    })
], RealEstateAdsModuleAdmin);
exports.RealEstateAdsModuleAdmin = RealEstateAdsModuleAdmin;
//# sourceMappingURL=real-estate-ads.module.js.map