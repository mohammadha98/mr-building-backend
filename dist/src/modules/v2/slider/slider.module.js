"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SliderModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderModule = void 0;
const common_1 = require("@nestjs/common");
const slider_service_1 = require("./slider.service");
const slider_controller_1 = require("./slider.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const transformer_admin_1 = require("./contracts/transformer-admin");
const transformer_app_1 = require("./contracts/transformer-app");
let SliderModule = SliderModule_1 = class SliderModule {
};
SliderModule = SliderModule_1 = __decorate([
    (0, common_1.Module)({
        controllers: [slider_controller_1.SliderController],
        providers: [
            slider_service_1.SliderService,
            httpResponsehandler_1.HttpResponsehandler,
            transformer_admin_1.default,
            transformer_app_1.default,
        ],
        exports: [
            SliderModule_1,
            slider_service_1.SliderService,
            transformer_admin_1.default,
            transformer_app_1.default,
        ],
    })
], SliderModule);
exports.SliderModule = SliderModule;
//# sourceMappingURL=slider.module.js.map