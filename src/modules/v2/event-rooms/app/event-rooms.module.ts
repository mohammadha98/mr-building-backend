import { Module } from "@nestjs/common";
import { EventRoomsService } from "./event-rooms.service";
import { EventRoomsController } from "./event-rooms.controller";
 import { NestjsFormDataModule } from "nestjs-form-data";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import EventRoomsTransformer from "./Transformer";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Module({
  controllers: [EventRoomsController],
  imports: [NestjsFormDataModule],
  providers: [
    EventRoomsService,
    MailerService,
    MrBuildingMailerService,
    EventRoomsTransformer,
  ],
  exports: [EventRoomsService],
})
export class EventRoomsModule {}
