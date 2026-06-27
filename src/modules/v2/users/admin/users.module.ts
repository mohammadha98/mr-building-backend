import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import UserPrismaRepository from "./repositories/UserPrismaRepository";
import UserTransformer from "./Transformer";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "src/modules/v2/auth/strategies/jwt.staregry";
import { PrismaService } from "../../../../../prisma/prisma.service";
import adminUserRolesTransformer from "../../admin-users-roles/public/Transformer";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    NestjsFormDataModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    HttpResponsehandler,
    UserPrismaRepository,
    UserTransformer,
    JwtService,
    JwtStrategy,
    adminUserRolesTransformer,
    MailerService,
    MrBuildingMailerService,
  ],
  exports: [UsersModule, UsersService],
})
export class UsersModule {}
