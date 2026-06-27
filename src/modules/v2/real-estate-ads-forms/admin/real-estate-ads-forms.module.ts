import { Module } from "@nestjs/common";
import { RealEstateAdsFormsService } from "./real-estate-ads-forms.service";
import { RealEstateAdsFormsController } from "./real-estate-ads-forms.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdsFormsPostgresqlRepository from "../repositories/RealEstateAdsFormsPostgresqlRepository";
import { ClientModule } from "src/modules/v2/client/admin/client.module";
import { ClientService } from "src/modules/v2/client/admin/client.service";
import RealEstateAdFormsTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [ClientModule, NestjsFormDataModule],
  controllers: [RealEstateAdsFormsController],
  providers: [
    RealEstateAdsFormsService,
    HttpResponsehandler,
    RealEstateAdsFormsPostgresqlRepository,
    RealEstateAdFormsTransformer,
    ClientService,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [
    RealEstateAdsFormsModuleAdmin,
    RealEstateAdsFormsService,
    RealEstateAdsFormsPostgresqlRepository,
    RealEstateAdsFormsModuleAdmin,
  ],
})
export class RealEstateAdsFormsModuleAdmin {}
