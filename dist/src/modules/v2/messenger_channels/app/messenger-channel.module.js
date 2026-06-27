"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessengerChannelAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerChannelAppModule = void 0;
const common_1 = require("@nestjs/common");
const messenger_channels_service_1 = require("./messenger-channels.service");
const messenger_channels_controller_1 = require("./messenger-channels.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const UploadService_1 = require("../../../services/UploadService");
const Transformer_1 = require("./Transformer");
let MessengerChannelAppModule = MessengerChannelAppModule_1 = class MessengerChannelAppModule {
};
MessengerChannelAppModule = MessengerChannelAppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [messenger_channels_controller_1.MessengerChannelsController],
        providers: [
            messenger_channels_service_1.MessengerChannelsService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
            UploadService_1.default,
        ],
        exports: [
            Transformer_1.default,
            messenger_channels_service_1.MessengerChannelsService,
            MessengerChannelAppModule_1,
        ],
    })
], MessengerChannelAppModule);
exports.MessengerChannelAppModule = MessengerChannelAppModule;
//# sourceMappingURL=messenger-channel.module.js.map