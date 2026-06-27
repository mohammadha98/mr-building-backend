"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateClientsModule = void 0;
const common_1 = require("@nestjs/common");
const validate_clients_service_1 = require("./validate-clients.service");
const validate_clients_controller_1 = require("./validate-clients.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const SmsService_1 = require("../../services/notifications/sms/SmsService");
let ValidateClientsModule = class ValidateClientsModule {
};
ValidateClientsModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [validate_clients_controller_1.ValidateClientsController],
        providers: [
            validate_clients_service_1.ValidateClientsService,
            httpResponsehandler_1.HttpResponsehandler,
            SmsService_1.default,
        ],
    })
], ValidateClientsModule);
exports.ValidateClientsModule = ValidateClientsModule;
//# sourceMappingURL=validate-clients.module.js.map