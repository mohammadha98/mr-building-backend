import MailerService from "./mailerService";
import { Module } from "@nestjs/common";
import MrBuildingMailerService from "./providers/MrBuildingMailerService";

@Module({
  providers: [MrBuildingMailerService, MailerService],
  exports: [MailerService],
})
export class MailerModule {}
