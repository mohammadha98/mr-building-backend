"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UsersModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const nestjs_form_data_1 = require("nestjs-form-data");
const UserPrismaRepository_1 = require("./repositories/UserPrismaRepository");
const Transformer_1 = require("./Transformer");
const jwt_1 = require("@nestjs/jwt");
const jwt_staregry_1 = require("../../auth/strategies/jwt.staregry");
const Transformer_2 = require("../../admin-users-roles/public/Transformer");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
let UsersModule = UsersModule_1 = class UsersModule {
};
UsersModule = UsersModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY,
            }),
            nestjs_form_data_1.NestjsFormDataModule,
        ],
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            httpResponsehandler_1.HttpResponsehandler,
            UserPrismaRepository_1.default,
            Transformer_1.default,
            jwt_1.JwtService,
            jwt_staregry_1.JwtStrategy,
            Transformer_2.default,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
        exports: [UsersModule_1, users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map