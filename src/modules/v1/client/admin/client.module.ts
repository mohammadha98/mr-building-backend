import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import ReportsTransformer from "../../reports/admin/Transformer";
import PrizesTransformer from "../../prizes/app/transformer";
import RealEstateAdsTransformer from "../../real-estate-ads/admin/Transformer";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ClientController],
  providers: [
    ClientService,
    ReportsTransformer,
    PrizesTransformer,
    RealEstateAdsTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [ClientService],
})
export class ClientModule {}
