"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRealEstateAppModule = void 0;
const common_1 = require("@nestjs/common");
const chat_real_estate_service_1 = require("./chat-real-estate.service");
const chat_real_estate_controller_1 = require("./chat-real-estate.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("./Transformer");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
let ChatRealEstateAppModule = class ChatRealEstateAppModule {
};
ChatRealEstateAppModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule],
        controllers: [chat_real_estate_controller_1.ChatRealEstateController],
        providers: [
            chat_real_estate_service_1.ChatRealEstateService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
        exports: [chat_real_estate_service_1.ChatRealEstateService],
    })
], ChatRealEstateAppModule);
exports.ChatRealEstateAppModule = ChatRealEstateAppModule;
//# sourceMappingURL=chat-real-estate.module.js.map