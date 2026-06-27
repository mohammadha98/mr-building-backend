"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StorefrontModuleApp_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorefrontModuleApp = void 0;
const common_1 = require("@nestjs/common");
const storefront_service_1 = require("./storefront.service");
const storefront_controller_1 = require("./storefront.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../../client/app/client.service");
const Transformer_1 = require("./Transformer");
const StorefrontPostgresqlRepository_1 = require("../repositories/StorefrontPostgresqlRepository");
const UploadService_1 = require("../../../services/UploadService");
const marketplace_categories_service_1 = require("../../marketplace-categories/marketplace-categories.service");
const Transformer_2 = require("../../marketplace-categories/Transformer");
const marketplace_brands_service_1 = require("../../marketplace-brands/marketplace-brands.service");
const Transformer_3 = require("../../marketplace-brands/Transformer");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const Transformer_4 = require("./Transformer");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
let StorefrontModuleApp = StorefrontModuleApp_1 = class StorefrontModuleApp {
};
StorefrontModuleApp = StorefrontModuleApp_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [storefront_controller_1.StorefrontController],
        providers: [
            Transformer_4.default,
            storefront_service_1.StorefrontService,
            Transformer_2.default,
            Transformer_3.default,
            httpResponsehandler_1.HttpResponsehandler,
            StorefrontPostgresqlRepository_1.default,
            client_service_1.ClientService,
            Transformer_1.default,
            UploadService_1.default,
            Transformer_2.default,
            marketplace_brands_service_1.MarketplaceBrandsService,
            Transformer_3.default,
            marketplace_categories_service_1.MarketplaceCategoriesService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            FcmNotificationService_1.default,
            GoogleFCM_1.default,
        ],
        exports: [
            StorefrontModuleApp_1,
            storefront_service_1.StorefrontService,
            Transformer_1.default,
            StorefrontPostgresqlRepository_1.default,
            Transformer_2.default,
            marketplace_brands_service_1.MarketplaceBrandsService,
            Transformer_3.default,
            marketplace_categories_service_1.MarketplaceCategoriesService,
            client_service_1.ClientService,
            UploadService_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], StorefrontModuleApp);
exports.StorefrontModuleApp = StorefrontModuleApp;
//# sourceMappingURL=storefront.module.js.map