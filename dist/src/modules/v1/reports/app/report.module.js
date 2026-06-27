"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsAppModule = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const report_controller_1 = require("./report.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const client_service_1 = require("../../client/app/client.service");
const client_module_1 = require("../../client/app/client.module");
let ReportsAppModule = class ReportsAppModule {
};
ReportsAppModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, client_module_1.ClientModule],
        controllers: [report_controller_1.ReportsController],
        providers: [
            report_service_1.ReportsService,
            Transformer_1.default,
            httpResponsehandler_1.HttpResponsehandler,
            client_service_1.ClientService,
        ],
    })
], ReportsAppModule);
exports.ReportsAppModule = ReportsAppModule;
//# sourceMappingURL=report.module.js.map