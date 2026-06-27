import { Module } from "@nestjs/common";
import { MessengerGroupsService } from "./messenger-groups.service";
import { MessengerGroupsController } from "./messenger-groups.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import MessageTransformer from "./Transformer";
import UploadService from "src/modules/services/UploadService";
import { NotificationsService } from "../../notifications/app/notifications.service";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import MessengerGroupsTransformer from "./Transformer";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [MessengerGroupsController],
  providers: [
    MessengerGroupsService,
    MessengerGroupsTransformer,
    HttpResponsehandler,
    MessageTransformer,
    UploadService,
    NotificationsService,
    FcmNotificationService,
    GoogleFCM,
  ],
  exports: [
    MessengerGroupsService,
    MessengerGroupsTransformer,
    MessengerGroupsService,
    MessengerGroupsAppModule,
  ],
})
export class MessengerGroupsAppModule {}
