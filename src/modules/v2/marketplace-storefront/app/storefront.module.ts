import { Module } from "@nestjs/common";
import { StorefrontService } from "./storefront.service";
import { StorefrontController } from "./storefront.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v2/client/app/client.service";
import StorefrontAppTransformer from "./Transformer";
import StorefrontPostgresqlRepository from "../repositories/StorefrontPostgresqlRepository";
import UploadService from "src/modules/services/UploadService";
import { MarketplaceCategoriesService } from "../../marketplace-categories/marketplace-categories.service";
import MarketplaceCategoriesTransformer from "../../marketplace-categories/Transformer";
import { MarketplaceBrandsService } from "../../marketplace-brands/marketplace-brands.service";
import MarketplaceBrandsTransformer from "../../marketplace-brands/Transformer";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import storefrontTransformer from "./Transformer";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [StorefrontController],
  providers: [
    storefrontTransformer,
    StorefrontService,
    MarketplaceCategoriesTransformer,
    MarketplaceBrandsTransformer,
    HttpResponsehandler,
    StorefrontPostgresqlRepository,
    ClientService,
    StorefrontAppTransformer,
    UploadService,
    MarketplaceCategoriesTransformer,
    MarketplaceBrandsService,
    MarketplaceBrandsTransformer,
    MarketplaceCategoriesService,
    MailerService,
    MrBuildingMailerService,
    FcmNotificationService,
    GoogleFCM,
  ],
  exports: [
    StorefrontModuleApp,
    StorefrontService,
    StorefrontAppTransformer,
    StorefrontPostgresqlRepository,
    MarketplaceCategoriesTransformer,
    MarketplaceBrandsService,
    MarketplaceBrandsTransformer,
    MarketplaceCategoriesService,
    ClientService,
    UploadService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class StorefrontModuleApp {}
