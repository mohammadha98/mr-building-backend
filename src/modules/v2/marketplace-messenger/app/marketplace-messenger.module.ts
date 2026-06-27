import { Module } from "@nestjs/common";
import { MarketplaceMessengerService } from "./marketplace-messenger.service";
import { MarketplaceMessengerController } from "./marketplace-messenger.controller";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { NestjsFormDataModule } from "nestjs-form-data";
import MarketplaceMessengerTransformer from "./Transformer";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { MarketplaceMessengerFactory } from "./factory/MarketplaceMessenger-factory";
import { MarketplaceMessenger_MessageSection } from "./marketplace-messenger-message.service";
import UploadService from "src/modules/services/UploadService";

@Module({
  imports: [NestjsFormDataModule],
  controllers: [MarketplaceMessengerController],
  providers: [
    MarketplaceMessengerService,
    MarketplaceMessengerTransformer,
    MailerService,
    MrBuildingMailerService,
    MarketplaceMessengerFactory,
    MarketplaceMessenger_MessageSection,
    UploadService,
  ],
  exports: [
    MarketplaceChatAppModule,
    MarketplaceMessengerService,
    MarketplaceMessengerTransformer,
    MailerService,
    MrBuildingMailerService,
    MarketplaceMessengerFactory,
    MarketplaceMessenger_MessageSection,
  ],
})
export class MarketplaceChatAppModule {}
