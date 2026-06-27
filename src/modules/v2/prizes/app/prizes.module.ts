import { Module } from "@nestjs/common";
import { PrizesService } from "./prizes.service";
import { PrizesController } from "./prizes.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import PrizesTransformer from "./transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { JwtService } from "@nestjs/jwt";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { ClientModule } from "src/modules/v2/client/app/client.module";
import { MissionsAdminService } from "src/modules/v2/missions/admin/missions.service";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UsersModule } from "src/modules/v2/users/admin/users.module";
import { UsersService } from "src/modules/v2/users/admin/users.service";
import UserPrismaRepository from "src/modules/v2/users/admin/repositories/UserPrismaRepository";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [NestjsFormDataModule, ClientModule, UsersModule],
  controllers: [PrizesController],
  providers: [
    PrizesService,
    PrizesTransformer,
    MissionsAdminService,
    HttpResponsehandler,
    ClientService,
    JwtService,
    UsersService,
    UserPrismaRepository,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class PrizesAppModule {}
