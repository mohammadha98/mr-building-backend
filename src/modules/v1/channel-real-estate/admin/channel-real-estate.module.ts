import { Module } from "@nestjs/common";
import { ChannelRealEstateService } from "./channel-real-estate.service";
import { ChannelRealEstateController } from "./channel-real-estate.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import MessageTransformer from "./Transformer";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ChannelRealEstateController],
  providers: [
    ChannelRealEstateService,
    HttpResponsehandler,
    MessageTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [ChannelRealEstateService],
})
export class ChannelRealEstateAdminModule {}
