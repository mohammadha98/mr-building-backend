import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { JwtStrategy } from "./strategies/jwt.staregry";
import { JwtModule } from "@nestjs/jwt";
import { NestjsFormDataModule } from "nestjs-form-data";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import { ClientService } from "src/modules/v1//client/app/client.service";
import { ClientModule } from "src/modules/v1//client/app/client.module";
import ClientTransformer from "src/modules/v1//client/app/Transformer";
import { ReferralCodeService } from "src/modules/v1//referral-code/app/referral-code.service";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import UploadService from "src/modules/services/UploadService";
import { MessengerChannelAppModule } from "../messenger_channels/app/messenger-channel.module";

@Module({
  imports: [
    MessengerChannelAppModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    NestjsFormDataModule,
    ClientModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SmsService,
    ClientService,
    ClientTransformer,
    ReferralCodeService,
    MailerService,
    MrBuildingMailerService,
    UploadService,
    HttpResponsehandler,
  ],
})
export class AuthModule {}
