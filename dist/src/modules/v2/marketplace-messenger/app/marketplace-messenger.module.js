"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MarketplaceChatAppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceChatAppModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_messenger_service_1 = require("./marketplace-messenger.service");
const marketplace_messenger_controller_1 = require("./marketplace-messenger.controller");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("./Transformer");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MarketplaceMessenger_factory_1 = require("./factory/MarketplaceMessenger-factory");
const marketplace_messenger_message_service_1 = require("./marketplace-messenger-message.service");
const UploadService_1 = require("../../../services/UploadService");
let MarketplaceChatAppModule = MarketplaceChatAppModule_1 = class MarketplaceChatAppModule {
};
MarketplaceChatAppModule = MarketplaceChatAppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [marketplace_messenger_controller_1.MarketplaceMessengerController],
        providers: [
            marketplace_messenger_service_1.MarketplaceMessengerService,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            MarketplaceMessenger_factory_1.MarketplaceMessengerFactory,
            marketplace_messenger_message_service_1.MarketplaceMessenger_MessageSection,
            UploadService_1.default,
        ],
        exports: [
            MarketplaceChatAppModule_1,
            marketplace_messenger_service_1.MarketplaceMessengerService,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            MarketplaceMessenger_factory_1.MarketplaceMessengerFactory,
            marketplace_messenger_message_service_1.MarketplaceMessenger_MessageSection,
        ],
    })
], MarketplaceChatAppModule);
exports.MarketplaceChatAppModule = MarketplaceChatAppModule;
//# sourceMappingURL=marketplace-messenger.module.js.map