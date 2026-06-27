import { Module } from "@nestjs/common";
import { RealEstateAgentsService } from "./real-estate-agents.service";
import { RealEstateAgentsController } from "./real-estate-agents.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v1/client/admin/client.service";
import RealEstateAgentsTransformer from "./Transformer";
import RealEstateAgentsPostgresqlRepository from "../repositories/RealEstateAgentsPostgresqlRepository";
import { RealEstateAgentsCommentsModuleApp } from "src/modules/v1/real-estate-agents-comments/app/real-estate-agents-comments.module";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v1/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { ChannelRealEstateService } from "src/modules/v1/channel-real-estate/app/channel-real-estate.service";
import RealEstateAdsPostgresqlRepository from "../../real-estate-ads/repositories/RealEstateAdsPostgresqlRepository";
import RealEstateAdsTransformer from "../../real-estate-ads/admin/Transformer";
import RealEstateAgentsCommentsTransformer from "../../real-estate-agents-comments/admin/Transformer";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import { MessengerChannelAppModule } from "../../messenger_channels/app/messenger-channel.module";
import UploadService from "src/modules/services/UploadService";

@Module({
  imports: [
    NestjsFormDataModule,
    RealEstateAgentsCommentsModuleApp,
    MessengerChannelAppModule,
  ],
  controllers: [RealEstateAgentsController],
  providers: [
    RealEstateAgentsService,
    HttpResponsehandler,
    RealEstateAgentsPostgresqlRepository,
    RealEstateAgentsCommentsPostgresqlRepository,
    ClientService,
    RealEstateAgentsTransformer,
    ChannelRealEstateService,
    RealEstateAdsPostgresqlRepository,
    RealEstateAdsTransformer,
    RealEstateAgentsCommentsTransformer,
    MailerService,
    MrBuildingMailerService,
    UploadService,
  ],
})
export class RealEstateAgentsModule {}
