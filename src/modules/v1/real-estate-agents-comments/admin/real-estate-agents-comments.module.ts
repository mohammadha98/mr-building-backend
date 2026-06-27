import { Module } from "@nestjs/common";
import { RealEstateAgentsCommentsService } from "./real-estate-agents-comments.service";
import { RealEstateAgentsCommentsController } from "./real-estate-agents-comments.controller";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ClientModule } from "src/modules/v1/client/app/client.module";
import RealEstateAgentsCommentsPostgresqlRepository from "../repositories/RealEstateAgentsCommentsPostgresqlRepository";
import RealEstateAgentsCommentsTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { RealEstateAgentsService } from "src/modules/v1/real-estate-agents/app/real-estate-agents.service";
import { RealEstateAgentsModuleApp } from "src/modules/v1/real-estate-agents/app/real-estate-agents.module";
import { UsersService } from "src/modules/v1/users/admin/users.service";
import { UsersModule } from "src/modules/v1/users/admin/users.module";
import UserPrismaRepository from "src/modules/v1/users/admin/repositories/UserPrismaRepository";
import { JwtService } from "@nestjs/jwt";
import RealEstateAgentsPostgresqlRepository from "src/modules/v1/real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import { MessengerChannelAppModule } from "../../messenger_channels/app/messenger-channel.module";

@Module({
  imports: [
    ClientModule,
    NestjsFormDataModule,
    RealEstateAgentsModuleApp,
    UsersModule,
    MessengerChannelAppModule,
  ],
  controllers: [RealEstateAgentsCommentsController],
  providers: [
    RealEstateAgentsCommentsService,
    RealEstateAgentsCommentsPostgresqlRepository,
    RealEstateAgentsCommentsTransformer,
    ClientService,
    RealEstateAgentsService,
    RealEstateAgentsPostgresqlRepository,
    HttpResponsehandler,
    UsersService,
    UserPrismaRepository,
    JwtService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class RealEstateAgentsCommentsModuleAdmin {}
