import { Module } from "@nestjs/common";
import { RealEstateAgentsAdvisorsService } from "./real-estate-agents-advisors.service";
import { RealEstateAgentsAdvisorsController } from "./real-estate-agents-advisors.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import ClientTransformer from "src/modules/v2/client/app/Transformer";
import RealEstateAdvisorTransformer from "./Transformer";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [RealEstateAgentsAdvisorsController],
  providers: [
    RealEstateAgentsAdvisorsService,
    RealEstateAdvisorTransformer,
    ClientService,
    HttpResponsehandler,
    ClientTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class RealEstateAgentsAdvisorsAdminModule {}
