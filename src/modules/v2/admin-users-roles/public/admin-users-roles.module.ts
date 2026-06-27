import { Module } from "@nestjs/common";
import { AdminUsersRolesService } from "./admin-users-roles.service";
import { AdminUsersRolesController } from "./admin-users-roles.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PrismaService } from "../../../../../prisma/prisma.service";
import adminUserRolesTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [AdminUsersRolesController],
  providers: [
    AdminUsersRolesService,
    AdminUsersRolesService,
    HttpResponsehandler,
    adminUserRolesTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class AdminUsersRolesPublicModule {}
