import { Module } from "@nestjs/common";
import { HomePageService } from "./home-page.service";
import { HomePageController } from "./home-page.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import SliderTransformerApp from "src/modules/v1//slider/contracts/transformer-app";
import { RealEstateAgentsModuleApp } from "src/modules/v1//real-estate-agents/app/real-estate-agents.module";
import { RealEstateAgentsService } from "src/modules/v1//real-estate-agents/app/real-estate-agents.service";
import RealEstateAgentsTransformer from "src/modules/v1//real-estate-agents/app/Transformer";
import { ClientModule } from "src/modules/v1//client/app/client.module";
import { ClientService } from "src/modules/v1//client/app/client.service";
import RealEstateAgentsPostgresqlRepository from "src/modules/v1//real-estate-agents/repositories/RealEstateAgentsPostgresqlRepository";
import { ForceUpdateAdminModule } from "src/modules/v1//force-update/admin/force-update.module";
import { ForceUpdateService } from "src/modules/v1//force-update/admin/force-update.service";
import ForceUpdateTransformer from "src/modules/v1//force-update/admin/Transformer";
import UserPrismaRepository from "src/modules/v1//users/admin/repositories/UserPrismaRepository";
import HomePageTransformer from "./Transformer";
import RealEstateAdvisorTransformer from "src/modules/v1//real-estate-agents-advisors/app/Transformer";
import RealEstateAdminsTransformer from "src/modules/v1//real-estate-agents-admins/app/Transformer";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import SliderTransformerAdmin from "../slider/contracts/transformer-admin";
import { MessengerChannelAppModule } from "../messenger_channels/app/messenger-channel.module";
import { MessengerChannelsService } from "../messenger_channels/app/messenger-channels.service";
import UploadService from "src/modules/services/UploadService";
import BannerTransformerApp from "../banners/contracts/transformer-app";
import { NotificationsService } from "../notifications/app/notifications.service";

@Module({
  imports: [ClientModule, RealEstateAgentsModuleApp, MessengerChannelAppModule],
  controllers: [HomePageController],
  providers: [
    HomePageService,
    HomePageTransformer,
    HttpResponsehandler,
    SliderTransformerApp,
    ClientService,
    RealEstateAgentsService,
    RealEstateAgentsTransformer,
    RealEstateAgentsPostgresqlRepository,
    ForceUpdateAdminModule,
    ForceUpdateService,
    NotificationsService,
    ForceUpdateTransformer,
    RealEstateAdvisorTransformer,
    UserPrismaRepository,
    RealEstateAdminsTransformer,
    MailerService,
    MrBuildingMailerService,
    FcmNotificationService,
    FcmNotificationService,
    GoogleFCM,
    SliderTransformerAdmin,
    BannerTransformerApp,
    MessengerChannelsService,
    UploadService,
  ],
})
export class HomePageModule {}
