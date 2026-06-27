"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ForceUpdateAdminModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceUpdateAdminModule = void 0;
const common_1 = require("@nestjs/common");
const force_update_service_1 = require("./force-update.service");
const force_update_controller_1 = require("./force-update.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const users_service_1 = require("../../users/admin/users.service");
const users_module_1 = require("../../users/admin/users.module");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const jwt_1 = require("@nestjs/jwt");
const client_service_1 = require("../../client/app/client.service");
const client_module_1 = require("../../client/app/client.module");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const GoogleFCM_1 = require("../../../services/notifications/fcm/providers/GoogleFCM");
let ForceUpdateAdminModule = ForceUpdateAdminModule_1 = class ForceUpdateAdminModule {
};
ForceUpdateAdminModule = ForceUpdateAdminModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, users_module_1.UsersModule, client_module_1.ClientModule],
        controllers: [force_update_controller_1.RealEstateAgentsCommentsController],
        providers: [
            force_update_service_1.ForceUpdateService,
            Transformer_1.default,
            httpResponsehandler_1.HttpResponsehandler,
            users_service_1.UsersService,
            UserPrismaRepository_1.default,
            jwt_1.JwtService,
            client_service_1.ClientService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
            FcmNotificationService_1.default,
            GoogleFCM_1.default
        ],
        exports: [ForceUpdateAdminModule_1, force_update_service_1.ForceUpdateService, Transformer_1.default]
    })
], ForceUpdateAdminModule);
exports.ForceUpdateAdminModule = ForceUpdateAdminModule;
//# sourceMappingURL=force-update.module.js.map