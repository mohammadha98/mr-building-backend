import { Module } from "@nestjs/common";
import { ProductFeatureFormsService } from "./product-feature-forms.service";
import { ProductFeatureFormsController } from "./product-feature-forms.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MarketplaceProductFeatureFormsPostgresqlRepository from "../repositories/MarketplaceProductFeatureFormsPostgresqlRepository";
import { ClientModule } from "src/modules/v2//client/admin/client.module";
import { ClientService } from "src/modules/v2//client/admin/client.service";
import ProductFeatureFormsTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [ClientModule, NestjsFormDataModule],
  controllers: [ProductFeatureFormsController],
  providers: [
    ProductFeatureFormsService,
    HttpResponsehandler,
    MarketplaceProductFeatureFormsPostgresqlRepository,
    ProductFeatureFormsTransformer,
    ClientService,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [
    RealEstateAdsFormsModuleAdmin,
    ProductFeatureFormsService,
    MarketplaceProductFeatureFormsPostgresqlRepository,
    RealEstateAdsFormsModuleAdmin,
  ],
})
export class RealEstateAdsFormsModuleAdmin {}
