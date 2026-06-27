import { Module } from "@nestjs/common";
import { MissionsAdminService } from "./missions.service";
import { MissionsController } from "./missions.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MissionsTransformer from "./transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UsersService } from "src/modules/v1/users/admin/users.service";
import { UsersModule } from "src/modules/v1/users/admin/users.module";
import UserPrismaRepository from "src/modules/v1/users/admin/repositories/UserPrismaRepository";
import { JwtService } from "@nestjs/jwt";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  imports: [NestjsFormDataModule, UsersModule],
  controllers: [MissionsController],
  providers: [
    MissionsAdminService,
    HttpResponsehandler,
    MissionsTransformer,
    UsersService,
    UserPrismaRepository,
    JwtService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class MissionsAdminModule {}
