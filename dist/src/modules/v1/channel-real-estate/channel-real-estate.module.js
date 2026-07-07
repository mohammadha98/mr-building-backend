"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelRealEstateModule = void 0;
const common_1 = require("@nestjs/common");
const channel_real_estate_module_1 = require("./app/channel-real-estate.module");
const channel_real_estate_module_2 = require("./admin/channel-real-estate.module");
let ChannelRealEstateModule = class ChannelRealEstateModule {
};
ChannelRealEstateModule = __decorate([
    (0, common_1.Module)({
        imports: [channel_real_estate_module_2.ChannelRealEstateAdminModule, channel_real_estate_module_1.ChannelRealEstateAppModule],
    })
], ChannelRealEstateModule);
exports.ChannelRealEstateModule = ChannelRealEstateModule;
//# sourceMappingURL=channel-real-estate.module.js.map