"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModulesAdmin = void 0;
const common_1 = require("@nestjs/common");
const service_modules_service_1 = require("./service-modules.service");
const service_modules_controller_1 = require("./service-modules.controller");
const jwt_1 = require("@nestjs/jwt");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
let ServiceModulesAdmin = class ServiceModulesAdmin {
};
ServiceModulesAdmin = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [service_modules_controller_1.ServiceModulesController],
        providers: [
            service_modules_service_1.ServiceModulesService,
            jwt_1.JwtService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
        ],
    })
], ServiceModulesAdmin);
exports.ServiceModulesAdmin = ServiceModulesAdmin;
//# sourceMappingURL=service-modules.module.js.map