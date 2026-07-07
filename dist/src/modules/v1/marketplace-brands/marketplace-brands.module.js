"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceBrandsModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_brands_service_1 = require("./marketplace-brands.service");
const marketplace_brands_controller_1 = require("./marketplace-brands.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("./Transformer");
const UploadService_1 = require("../../services/UploadService");
const mailerService_1 = require("../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../services/notifications/mailer/providers/MrBuildingMailerService");
let MarketplaceBrandsModule = class MarketplaceBrandsModule {
};
MarketplaceBrandsModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [marketplace_brands_controller_1.MarketplaceBrandsController],
        providers: [
            marketplace_brands_service_1.MarketplaceBrandsService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
            UploadService_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], MarketplaceBrandsModule);
exports.MarketplaceBrandsModule = MarketplaceBrandsModule;
//# sourceMappingURL=marketplace-brands.module.js.map