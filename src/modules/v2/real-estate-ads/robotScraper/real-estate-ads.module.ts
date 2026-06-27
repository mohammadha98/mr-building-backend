import { Module } from "@nestjs/common";
import { RealEstateAdsService_robotScraper } from "./real-estate-ads.service";
import { RealEstateAdsRobotScraperController } from "./real-estate-ads.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import { ClientModule } from "src/modules/v2/client/app/client.module";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import RealEstateAdsTransformer from "./Transformer";

@Module({
  imports: [ClientModule, NestjsFormDataModule],
  controllers: [RealEstateAdsRobotScraperController],
  providers: [
    RealEstateAdsService_robotScraper,
    HttpResponsehandler,
    RealEstateAdsPostgresqlRepository,
    ClientService,
    RealEstateAdsTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class RealEstateAdsModuleRobotScraper {}
