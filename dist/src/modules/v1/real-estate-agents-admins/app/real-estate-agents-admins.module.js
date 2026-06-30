"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsAdminsAppModule = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_admins_service_1 = require("./real-estate-agents-admins.service");
const real_estate_agents_admins_controller_1 = require("./real-estate-agents-admins.controller");
const client_service_1 = require("../../client/app/client.service");
const client_module_1 = require("../../client/app/client.module");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const Transformer_1 = require("../../client/app/Transformer");
const Transformer_2 = require("./Transformer");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = require("cache-manager-redis-store");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
let RealEstateAgentsAdminsAppModule = class RealEstateAgentsAdminsAppModule {
};
RealEstateAgentsAdminsAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: () => ({
                    store: redisStore.redisStore,
                    socket: Object.assign({ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT || '6379', 10) }, (process.env.REDIS_TLS === 'true' && { tls: true })),
                    database: 13,
                    ttl: 60,
                    password: process.env.APP_MODE !== 'development'
                        ? process.env.REDIS_PASSWORD
                        : undefined,
                }),
            }),
            client_module_1.ClientModule,
            nestjs_form_data_1.NestjsFormDataModule,
        ],
        controllers: [real_estate_agents_admins_controller_1.RealEstateAgentsAdminsController],
        providers: [
            real_estate_agents_admins_service_1.RealEstateAgentsAdminsService,
            Transformer_2.default,
            client_service_1.ClientService,
            httpResponsehandler_1.HttpResponsehandler,
            Transformer_1.default,
            SmsService_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], RealEstateAgentsAdminsAppModule);
exports.RealEstateAgentsAdminsAppModule = RealEstateAgentsAdminsAppModule;
//# sourceMappingURL=real-estate-agents-admins.module.js.map