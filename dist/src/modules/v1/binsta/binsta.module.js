"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinstaModule = void 0;
const common_1 = require("@nestjs/common");
const binsta_service_1 = require("./binsta.service");
const binsta_controller_1 = require("./binsta.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const client_service_1 = require("../client/app/client.service");
const MrBuildingMailerService_1 = require("../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../services/notifications/mailer/mailerService");
let BinstaModule = class BinstaModule {
};
BinstaModule = __decorate([
    (0, common_1.Module)({
        controllers: [binsta_controller_1.BinstaController],
        providers: [binsta_service_1.BinstaService],
        imports: [
            httpResponsehandler_1.HttpResponsehandler,
            client_service_1.ClientService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], BinstaModule);
exports.BinstaModule = BinstaModule;
//# sourceMappingURL=binsta.module.js.map