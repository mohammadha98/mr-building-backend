"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralCodeAppModule = void 0;
const common_1 = require("@nestjs/common");
const referral_code_service_1 = require("./referral-code.service");
const referral_code_controller_1 = require("./referral-code.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const client_service_1 = require("../../client/admin/client.service");
const client_module_1 = require("../../client/app/client.module");
const nestjs_form_data_1 = require("nestjs-form-data");
let ReferralCodeAppModule = class ReferralCodeAppModule {
};
ReferralCodeAppModule = __decorate([
    (0, common_1.Module)({
        imports: [client_module_1.ClientModule, nestjs_form_data_1.NestjsFormDataModule],
        controllers: [referral_code_controller_1.ReferralCodeController],
        providers: [
            referral_code_service_1.ReferralCodeService,
            httpResponsehandler_1.HttpResponsehandler,
            transformer_1.default,
            client_service_1.ClientService,
        ],
    })
], ReferralCodeAppModule);
exports.ReferralCodeAppModule = ReferralCodeAppModule;
//# sourceMappingURL=referral-code.module.js.map