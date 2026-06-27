import { Module } from "@nestjs/common";
import { MarketplaceBrandsService } from "./marketplace-brands.service";
import { MarketplaceBrandsController } from "./marketplace-brands.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { PrismaService } from "../../../../prisma/prisma.service";
import MarketplaceBrandsTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [MarketplaceBrandsController],
  providers: [
    MarketplaceBrandsService,
    HttpResponsehandler,
    MarketplaceBrandsTransformer,
    UploadService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class MarketplaceBrandsModule {}
