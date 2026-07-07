"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessengerSaveMessageAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerSaveMessageAppModule = void 0;
const common_1 = require("@nestjs/common");
const save_message_controller_1 = require("./save-message.controller");
const save_message_service_1 = require("./save-message.service");
const Transformer_1 = require("./Transformer");
const UploadService_1 = require("../../../services/UploadService");
let MessengerSaveMessageAppModule = MessengerSaveMessageAppModule_1 = class MessengerSaveMessageAppModule {
};
MessengerSaveMessageAppModule = MessengerSaveMessageAppModule_1 = __decorate([
    (0, common_1.Module)({
        controllers: [save_message_controller_1.MessengerSaveMessageController],
        providers: [
            save_message_service_1.MessengerSaveMessageService,
            Transformer_1.default,
            UploadService_1.default,
        ],
        exports: [
            MessengerSaveMessageAppModule_1,
            save_message_service_1.MessengerSaveMessageService,
            Transformer_1.default,
        ],
    })
], MessengerSaveMessageAppModule);
exports.MessengerSaveMessageAppModule = MessengerSaveMessageAppModule;
//# sourceMappingURL=save-message-app.module.js.map