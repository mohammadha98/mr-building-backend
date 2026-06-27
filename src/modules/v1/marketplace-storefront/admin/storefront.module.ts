import { Module } from "@nestjs/common";
import { StorefrontService } from "./storefront.service";
import { StorefrontController } from "./storefront.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientService } from "src/modules/v1/client/admin/client.service";
import StorefrontAdminTransformer from "./Transformer";
import StorefrontPostgresqlRepository from "../repositories/StorefrontPostgresqlRepository";
import { RealEstateAgentsCommentsModuleApp } from "src/modules/v1/real-estate-agents-comments/app/real-estate-agents-comments.module";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v1/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { ChannelRealEstateService } from "src/modules/v1/channel-real-estate/app/channel-real-estate.service";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";

@Module({
  imports: [NestjsFormDataModule, RealEstateAgentsCommentsModuleApp],
  controllers: [StorefrontController],
  providers: [
    StorefrontService,
    HttpResponsehandler,
    StorefrontPostgresqlRepository,
    RealEstateAgentsCommentsPostgresqlRepository,
    ClientService,
    StorefrontAdminTransformer,
    ChannelRealEstateService,
    MailerService,
    MrBuildingMailerService,
  ],
})
export class StorefrontModule {}
