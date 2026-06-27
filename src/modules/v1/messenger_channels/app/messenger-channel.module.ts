import { Module } from "@nestjs/common";
import { MessengerChannelsService } from "./messenger-channels.service";
import { MessengerChannelsController } from "./messenger-channels.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import UploadService from "src/modules/services/UploadService";
import MessengerChannelTransformer from "./Transformer";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [MessengerChannelsController],
  providers: [
    MessengerChannelsService,
    HttpResponsehandler,
    MessengerChannelTransformer,
    UploadService,
  ],
  exports: [
    MessengerChannelTransformer,
    MessengerChannelsService,
    MessengerChannelAppModule,
  ],
})
export class MessengerChannelAppModule {}
