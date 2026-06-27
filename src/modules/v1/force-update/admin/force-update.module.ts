import { Module } from "@nestjs/common";
import { ForceUpdateService } from "./force-update.service";
import { RealEstateAgentsCommentsController } from "./force-update.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ForceUpdateTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UsersService } from "src/modules/v1//users/admin/users.service";
import { UsersModule } from "src/modules/v1//users/admin/users.module";
import UserPrismaRepository from "src/modules/v1//users/admin/repositories/UserPrismaRepository";
import { JwtService } from "@nestjs/jwt";
import { ClientService } from "src/modules/v1//client/app/client.service";
import { ClientModule } from "src/modules/v1//client/app/client.module";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import { PrismaService } from "../../../../../prisma/prisma.service";

@Module({
  imports: [NestjsFormDataModule, UsersModule, ClientModule],
  controllers: [RealEstateAgentsCommentsController],
  providers: [
    ForceUpdateService,
    ForceUpdateTransformer,
    HttpResponsehandler,
    UsersService,
    UserPrismaRepository,
    JwtService,
    ClientService,
    MailerService,
    MrBuildingMailerService,
    FcmNotificationService,
    GoogleFCM
  ],
  exports: [ForceUpdateAdminModule, ForceUpdateService, ForceUpdateTransformer]
})
export class ForceUpdateAdminModule {
}
