"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ClientModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("./client.service");
const client_controller_1 = require("./client.controller");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("../../real-estate-agents/app/Transformer");
const Transformer_2 = require("./Transformer");
const Transformer_3 = require("../../force-update/admin/Transformer");
const UploadService_1 = require("../../../services/UploadService");
const ws_server_module_1 = require("../../ws-server/ws-server.module");
let ClientModule = ClientModule_1 = class ClientModule {
};
ClientModule = ClientModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, ws_server_module_1.WsServerModule],
        controllers: [client_controller_1.ClientController],
        providers: [
            client_service_1.ClientService,
            Transformer_1.default,
            Transformer_2.default,
            Transformer_3.default,
            UploadService_1.default,
        ],
        exports: [client_service_1.ClientService, ClientModule_1, Transformer_2.default],
    })
], ClientModule);
exports.ClientModule = ClientModule;
//# sourceMappingURL=client.module.js.map