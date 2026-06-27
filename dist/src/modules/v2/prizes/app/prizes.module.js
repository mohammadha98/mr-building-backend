"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizesAppModule = void 0;
const common_1 = require("@nestjs/common");
const prizes_service_1 = require("./prizes.service");
const prizes_controller_1 = require("./prizes.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const jwt_1 = require("@nestjs/jwt");
const client_service_1 = require("../../client/app/client.service");
const client_module_1 = require("../../client/app/client.module");
const missions_service_1 = require("../../missions/admin/missions.service");
const users_module_1 = require("../../users/admin/users.module");
const users_service_1 = require("../../users/admin/users.service");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
let PrizesAppModule = class PrizesAppModule {
};
PrizesAppModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, client_module_1.ClientModule, users_module_1.UsersModule],
        controllers: [prizes_controller_1.PrizesController],
        providers: [
            prizes_service_1.PrizesService,
            transformer_1.default,
            missions_service_1.MissionsAdminService,
            httpResponsehandler_1.HttpResponsehandler,
            client_service_1.ClientService,
            jwt_1.JwtService,
            users_service_1.UsersService,
            UserPrismaRepository_1.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], PrizesAppModule);
exports.PrizesAppModule = PrizesAppModule;
//# sourceMappingURL=prizes.module.js.map