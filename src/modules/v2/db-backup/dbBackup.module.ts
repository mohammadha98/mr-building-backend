import { Module } from "@nestjs/common";
import { DbBackupService } from "./dbBackup.service";
import { DbBackupController } from "./dbBackup.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import BackupTransformer from "./Transformer";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  controllers: [DbBackupController],
  providers: [
    DbBackupService,
    HttpResponsehandler,
    BackupTransformer,
    // MailerService,
    // MrBuildingMailerService,
  ],
})
export class DbBackupModule {}
