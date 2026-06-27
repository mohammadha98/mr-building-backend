import { Module } from "@nestjs/common";
import { MessengerSaveMessageController } from "./save-message.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { MessengerSaveMessageService } from "./save-message.service";
import MessengerSaveMessageTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";

@Module({
  controllers: [MessengerSaveMessageController],
  providers: [
    MessengerSaveMessageService,
    MessengerSaveMessageTransformer,
    UploadService,
  ],
  exports: [
    MessengerSaveMessageAppModule,
    MessengerSaveMessageService,
    MessengerSaveMessageTransformer,
  ],
})
export class MessengerSaveMessageAppModule {}
