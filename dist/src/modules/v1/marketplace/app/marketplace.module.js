"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceAppModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_service_1 = require("./marketplace.service");
const marketplace_controller_1 = require("./marketplace.controller");
const storefront_module_1 = require("../../marketplace-storefront/app/storefront.module");
const marketplace_factory_1 = require("./fartories/marketplace-factory");
const slider_module_1 = require("../../slider/slider.module");
const slider_service_1 = require("../../slider/slider.service");
const transformer_admin_1 = require("../../slider/contracts/transformer-admin");
let MarketplaceAppModule = class MarketplaceAppModule {
};
MarketplaceAppModule = __decorate([
    (0, common_1.Module)({
        imports: [storefront_module_1.StorefrontModuleApp, slider_module_1.SliderModule],
        controllers: [marketplace_controller_1.MarketplaceAppController],
        providers: [
            marketplace_service_1.MarketplaceService,
            marketplace_factory_1.MarketplaceFactory,
            slider_service_1.SliderService,
            transformer_admin_1.default,
        ],
    })
], MarketplaceAppModule);
exports.MarketplaceAppModule = MarketplaceAppModule;
//# sourceMappingURL=marketplace.module.js.map