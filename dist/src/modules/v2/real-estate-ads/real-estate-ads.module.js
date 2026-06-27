"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAdsModule = void 0;
const common_1 = require("@nestjs/common");
const real_estate_ads_module_1 = require("./app/real-estate-ads.module");
const real_estate_ads_module_2 = require("./admin/real-estate-ads.module");
const real_estate_ads_module_3 = require("./site/real-estate-ads.module");
const real_estate_ads_module_4 = require("./robotScraper/real-estate-ads.module");
let RealEstateAdsModule = class RealEstateAdsModule {
};
RealEstateAdsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            real_estate_ads_module_4.RealEstateAdsModuleRobotScraper,
            real_estate_ads_module_3.RealEstateAdsModuleSite,
            real_estate_ads_module_1.RealEstateAdsModuleApp,
            real_estate_ads_module_2.RealEstateAdsModuleAdmin,
        ],
    })
], RealEstateAdsModule);
exports.RealEstateAdsModule = RealEstateAdsModule;
//# sourceMappingURL=real-estate-ads.module.js.map