import { Module } from "@nestjs/common";
import { RealEstateAdsService } from "./real-estate-ads.service";
import { RealEstateAdsSettingsController } from "./real-estate-ads.controller";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import RealEstateAdsTransformer from "./Transformer";
import { NestjsFormDataModule } from "nestjs-form-data";
import { UsersService } from "src/modules/v2/users/admin/users.service";
import { UsersModule } from "src/modules/v2/users/admin/users.module";
import UserPrismaRepository from "src/modules/v2/users/admin/repositories/UserPrismaRepository";
import { JwtService } from "@nestjs/jwt";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import { ReportAdminModule } from "../../reports/admin/report.module";
import { RealEstateAdsModuleApp } from "../app/real-estate-ads.module";
import { RealEstateAdsServiceApp } from "../app/real-estate-ads-service-app.service";
import UploadService from "src/modules/services/UploadService";

@Module({
  imports: [
    UsersModule,
    NestjsFormDataModule,
    ReportAdminModule,
    RealEstateAdsModuleApp,
  ],
  controllers: [RealEstateAdsSettingsController],
  providers: [
    RealEstateAdsService,
    HttpResponsehandler,
    RealEstateAdsPostgresqlRepository,
    UsersService,
    UserPrismaRepository,
    JwtService,
    RealEstateAdsTransformer,
    MailerService,
    MrBuildingMailerService,
    FcmNotificationService,
    GoogleFCM,
    RealEstateAdsServiceApp,
    UploadService,
  ],
})
export class RealEstateAdsModuleAdmin {}
