"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbBackupModule = void 0;
const common_1 = require("@nestjs/common");
const dbBackup_service_1 = require("./dbBackup.service");
const dbBackup_controller_1 = require("./dbBackup.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
let DbBackupModule = class DbBackupModule {
};
DbBackupModule = __decorate([
    (0, common_1.Module)({
        controllers: [dbBackup_controller_1.DbBackupController],
        providers: [
            dbBackup_service_1.DbBackupService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
        ],
    })
], DbBackupModule);
exports.DbBackupModule = DbBackupModule;
//# sourceMappingURL=dbBackup.module.js.map