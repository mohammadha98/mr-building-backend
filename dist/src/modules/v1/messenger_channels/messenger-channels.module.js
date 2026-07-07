"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerChannelsModule = void 0;
const common_1 = require("@nestjs/common");
const messenger_channel_module_1 = require("./admin/messenger-channel.module");
const messenger_channel_module_2 = require("./app/messenger-channel.module");
let MessengerChannelsModule = class MessengerChannelsModule {
};
MessengerChannelsModule = __decorate([
    (0, common_1.Module)({
        imports: [messenger_channel_module_2.MessengerChannelAppModule, messenger_channel_module_1.MessengerChannelAdminModule],
    })
], MessengerChannelsModule);
exports.MessengerChannelsModule = MessengerChannelsModule;
//# sourceMappingURL=messenger-channels.module.js.map