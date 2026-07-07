"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MyCityAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCityAppModule = void 0;
const common_1 = require("@nestjs/common");
const my_city_service_1 = require("./my-city.service");
const my_city_controller_1 = require("./my-city.controller");
const UploadService_1 = require("../../../services/UploadService");
const Transformer_1 = require("./Transformer");
let MyCityAppModule = MyCityAppModule_1 = class MyCityAppModule {
};
MyCityAppModule = MyCityAppModule_1 = __decorate([
    (0, common_1.Module)({
        controllers: [my_city_controller_1.MyCityController],
        providers: [my_city_service_1.MyCityService, UploadService_1.default, Transformer_1.default],
        exports: [my_city_service_1.MyCityService, MyCityAppModule_1, UploadService_1.default, Transformer_1.default],
    })
], MyCityAppModule);
exports.MyCityAppModule = MyCityAppModule;
//# sourceMappingURL=my-city.module.js.map