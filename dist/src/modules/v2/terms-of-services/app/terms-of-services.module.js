"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsOfServicesAppModule = void 0;
const common_1 = require("@nestjs/common");
const terms_of_services_service_1 = require("./terms-of-services.service");
const terms_of_services_controller_1 = require("./terms-of-services.controller");
const client_service_1 = require("../../client/app/client.service");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const swagger_1 = require("@nestjs/swagger");
const Transformer_1 = require("./Transformer");
let TermsOfServicesAppModule = class TermsOfServicesAppModule {
};
TermsOfServicesAppModule = __decorate([
    (0, swagger_1.ApiTags)("terms-of-services"),
    (0, common_1.Module)({
        controllers: [terms_of_services_controller_1.TermsOfServicesController],
        providers: [
            terms_of_services_service_1.TermsOfServicesService,
            Transformer_1.default,
            client_service_1.ClientService,
            httpResponsehandler_1.HttpResponsehandler,
        ],
    })
], TermsOfServicesAppModule);
exports.TermsOfServicesAppModule = TermsOfServicesAppModule;
//# sourceMappingURL=terms-of-services.module.js.map