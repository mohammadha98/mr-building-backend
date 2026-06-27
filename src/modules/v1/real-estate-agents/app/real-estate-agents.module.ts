import { Module } from "@nestjs/common";
import { RealEstateAgentsService } from "./real-estate-agents.service";
import { RealEstateAgentsController } from "./real-estate-agents.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v1/client/app/client.service";
import RealEstateAgentsTransformer from "./Transformer";
import RealEstateAgentsPostgresqlRepository from "../repositories/RealEstateAgentsPostgresqlRepository";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import UploadService from "src/modules/services/UploadService";
import { MessengerChannelAppModule } from "../../messenger_channels/app/messenger-channel.module";

@Module({
  imports: [NestjsFormDataModule, MessengerChannelAppModule],
  controllers: [RealEstateAgentsController],
  providers: [
    RealEstateAgentsService,
    HttpResponsehandler,
    RealEstateAgentsPostgresqlRepository,
    ClientService,
    RealEstateAgentsTransformer,
    MailerService,
    MrBuildingMailerService,
    UploadService,
  ],
  exports: [
    RealEstateAgentsModuleApp,
    RealEstateAgentsService,
    RealEstateAgentsTransformer,
    RealEstateAgentsPostgresqlRepository,
  ],
})
export class RealEstateAgentsModuleApp {}
