import { Module } from "@nestjs/common";
import { MessengerChannelsService } from "./messenger-channels.service";
import { MessengerChannelsController } from "./messenger-channels.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import MessageTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [MessengerChannelsController],
  providers: [
    MessengerChannelsService,
    HttpResponsehandler,
    MessageTransformer,
    UploadService,
  ],
  exports: [MessengerChannelsService],
})
export class MessengerChannelAdminModule {}
