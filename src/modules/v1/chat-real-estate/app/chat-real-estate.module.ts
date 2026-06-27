import { Module } from "@nestjs/common";
import { ChatRealEstateService } from "./chat-real-estate.service";
import { ChatRealEstateController } from "./chat-real-estate.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import MessageTransformer from "./Transformer";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [ChatRealEstateController],
  providers: [
    ChatRealEstateService,
    HttpResponsehandler,
    MessageTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [ChatRealEstateService],
})
export class ChatRealEstateAppModule {}
