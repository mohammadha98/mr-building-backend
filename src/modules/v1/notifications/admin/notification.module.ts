import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import { NotificationsService } from "./notifications.service";
import { NotificationController } from "./notification.controller";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [NotificationController],
  providers: [
    NotificationsService,
    FcmNotificationService,
    HttpResponsehandler,
    GoogleFCM,
  ],
  exports: [NotificationAdminModule],
})
export class NotificationAdminModule {}
