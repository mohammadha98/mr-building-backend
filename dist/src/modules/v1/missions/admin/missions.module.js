"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionsAdminModule = void 0;
const common_1 = require("@nestjs/common");
const missions_service_1 = require("./missions.service");
const missions_controller_1 = require("./missions.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const transformer_1 = require("./transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const users_service_1 = require("../../users/admin/users.service");
const users_module_1 = require("../../users/admin/users.module");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const jwt_1 = require("@nestjs/jwt");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
let MissionsAdminModule = class MissionsAdminModule {
};
MissionsAdminModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_form_data_1.NestjsFormDataModule, users_module_1.UsersModule],
        controllers: [missions_controller_1.MissionsController],
        providers: [
            missions_service_1.MissionsAdminService,
            httpResponsehandler_1.HttpResponsehandler,
            transformer_1.default,
            users_service_1.UsersService,
            UserPrismaRepository_1.default,
            jwt_1.JwtService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], MissionsAdminModule);
exports.MissionsAdminModule = MissionsAdminModule;
//# sourceMappingURL=missions.module.js.map