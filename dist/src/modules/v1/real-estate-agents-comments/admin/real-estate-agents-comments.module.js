"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsCommentsModuleAdmin = void 0;
const common_1 = require("@nestjs/common");
const real_estate_agents_comments_service_1 = require("./real-estate-agents-comments.service");
const real_estate_agents_comments_controller_1 = require("./real-estate-agents-comments.controller");
const client_service_1 = require("../../client/app/client.service");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const client_module_1 = require("../../client/app/client.module");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../repositories/RealEstateAgentsCommentsPostgresqlRepository");
const Transformer_1 = require("./Transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
const real_estate_agents_service_1 = require("../../real-estate-agents/app/real-estate-agents.service");
const real_estate_agents_module_1 = require("../../real-estate-agents/app/real-estate-agents.module");
const users_service_1 = require("../../users/admin/users.service");
const users_module_1 = require("../../users/admin/users.module");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const jwt_1 = require("@nestjs/jwt");
const RealEstateAgentsPostgresqlRepository_1 = require("../../real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const MrBuildingMailerService_1 = require("../../../services/notifications/mailer/providers/MrBuildingMailerService");
const messenger_channel_module_1 = require("../../messenger_channels/app/messenger-channel.module");
let RealEstateAgentsCommentsModuleAdmin = class RealEstateAgentsCommentsModuleAdmin {
};
RealEstateAgentsCommentsModuleAdmin = __decorate([
    (0, common_1.Module)({
        imports: [
            client_module_1.ClientModule,
            nestjs_form_data_1.NestjsFormDataModule,
            real_estate_agents_module_1.RealEstateAgentsModuleApp,
            users_module_1.UsersModule,
            messenger_channel_module_1.MessengerChannelAppModule,
        ],
        controllers: [real_estate_agents_comments_controller_1.RealEstateAgentsCommentsController],
        providers: [
            real_estate_agents_comments_service_1.RealEstateAgentsCommentsService,
            RealEstateAgentsCommentsPostgresqlRepository_1.default,
            Transformer_1.default,
            client_service_1.ClientService,
            real_estate_agents_service_1.RealEstateAgentsService,
            RealEstateAgentsPostgresqlRepository_1.default,
            httpResponsehandler_1.HttpResponsehandler,
            users_service_1.UsersService,
            UserPrismaRepository_1.default,
            jwt_1.JwtService,
            mailerService_1.default,
            MrBuildingMailerService_1.default,
        ],
    })
], RealEstateAgentsCommentsModuleAdmin);
exports.RealEstateAgentsCommentsModuleAdmin = RealEstateAgentsCommentsModuleAdmin;
//# sourceMappingURL=real-estate-agents-comments.module.js.map