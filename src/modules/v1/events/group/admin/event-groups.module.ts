import { Module } from "@nestjs/common";
import { eventGroupsService } from "./event-groups.service";
import { PrismaService } from "../../../../../../prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import { EventsGroupController } from "./event-groups.controller";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  controllers: [EventsGroupController],
  imports: [NestjsFormDataModule],
  providers: [
    eventGroupsService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class EventGroupsModule {}
