"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const httpResponsehandler_1 = require("../../services/httpResponseHandler/httpResponsehandler");
const jwt_staregry_1 = require("./strategies/jwt.staregry");
const jwt_1 = require("@nestjs/jwt");
const nestjs_form_data_1 = require("nestjs-form-data");
const SmsService_1 = require("../../services/notifications/sms/SmsService");
const client_service_1 = require("../client/app/client.service");
const client_module_1 = require("../client/app/client.module");
const Transformer_1 = require("../client/app/Transformer");
const referral_code_service_1 = require("../referral-code/app/referral-code.service");
const MrBuildingMailerService_1 = require("../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../services/notifications/mailer/mailerService");
const UploadService_1 = require("../../services/UploadService");
const messenger_channel_module_1 = require("../messenger_channels/app/messenger-channel.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            messenger_channel_module_1.MessengerChannelAppModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
            }),
            nestjs_form_data_1.NestjsFormDataModule,
            client_module_1.ClientModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_staregry_1.JwtStrategy,
            SmsService_1.default,
            client_service_1.ClientService,
            Transformer_1.default,
            referral_code_service_1.ReferralCodeService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            UploadService_1.default,
            httpResponsehandler_1.HttpResponsehandler,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map