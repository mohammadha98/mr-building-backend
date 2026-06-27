import { Module } from "@nestjs/common";
import { eventGroupsService } from "./event-groups.service";
 import { NestjsFormDataModule } from "nestjs-form-data";
import { EventsGroupController } from "./event-groups.controller";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import { PrismaService } from "../../../../../../prisma/prisma.service";

@Module({
  controllers: [EventsGroupController],
  imports: [NestjsFormDataModule],
  providers: [
    eventGroupsService,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [eventGroupsService],
})
export class EventGroupsModule {}
