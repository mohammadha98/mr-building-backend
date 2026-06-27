import { Module } from "@nestjs/common";
import { MarketplaceCategoriesService } from "./marketplace-categories.service";
import { MarketplaceCategoriesController } from "./marketplace-categories.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { PrismaService } from "src/../prisma/prisma.service";
import MarketplaceCategoriesTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [MarketplaceCategoriesController],
  providers: [
    MarketplaceCategoriesService,
    HttpResponsehandler,
    MarketplaceCategoriesTransformer,
    UploadService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class MarketplaceCategoriesModule {}
