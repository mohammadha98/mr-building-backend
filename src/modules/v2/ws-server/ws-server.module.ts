import { Module } from "@nestjs/common";
import { WsServerService } from "./ws-server.service";
import { WsServerGateway } from "./ws-server.gateway";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { RedisClientOptions } from "redis";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import ClientTransformer from "src/modules/v2/client/app/Transformer";
import MessageTransformer from "src/modules/v2/chat-real-estate/app/Transformer";
import MessengerAppTransformer from "src/modules/v2/messenger/app/Transformer";
import { MessengerChannelsService } from "src/modules/v2/messenger_channels/app/messenger-channels.service";
import UploadService from "src/modules/services/UploadService";
import MessengerChannelTransformer from "src/modules/v2/messenger_channels/app/Transformer";
import { MessengerGroupsService } from "src/modules/v2/messenger_groups/app/messenger-groups.service";
import MessengerGroupsTransformer from "src/modules/v2/messenger_groups/app/Transformer";
import { MessengerService } from "../messenger/app/messenger.service";
import GoogleFCM from "src/modules/services/notifications/fcm/providers/GoogleFCM";
import { NotificationsService } from "../notifications/app/notifications.service";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import MrBuildingMailerService from "src/modules/services/notifications/mailer/providers/MrBuildingMailerService";
import { JwtStrategy } from "../auth/strategies/jwt.staregry";
import { TokenService } from "../jwt-auth/services/TokenService";
import { MessengerSaveMessageAppModule } from "../messenger-save-message/app/save-message-app.module";
import { MessengerSaveMessageService } from "../messenger-save-message/app/save-message.service";
import { RealEstateAgentsAdvisorsService } from "../real-estate-agents-advisors/app/real-estate-agents-advisors.service";
import RealEstateAdvisorTransformer from "../real-estate-agents-advisors/app/Transformer";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import { MarketplaceChatAppModule } from "../marketplace-messenger/app/marketplace-messenger.module";
import { WebsocketFactoryClass } from "./factory/WsFactory";
import { MarketplaceMessengerService } from "../marketplace-messenger/app/marketplace-messenger.service";
import { MarketplaceMessengerFactory } from "../marketplace-messenger/app/factory/MarketplaceMessenger-factory";

@Module({
  imports: [
    MessengerSaveMessageAppModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: () => ({
        store: redisStore.redisStore as any,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          ...(process.env.REDIS_TLS === 'true' && { tls: true }),
        },
        database: 0,
        ttl: null,
        password:
          process.env.APP_MODE !== 'development'
            ? process.env.REDIS_PASSWORD
            : undefined,
      }),
    }),
    MarketplaceChatAppModule,
  ],
  providers: [
    WsServerGateway,
    WsServerService,
    JwtStrategy,
    JwtService,
    TokenService,
    ClientService,
    ClientTransformer,
    MessageTransformer,
    MessengerAppTransformer,
    MessengerChannelsService,
    MessengerGroupsService,
    MessengerChannelTransformer,
    MessengerGroupsTransformer,
    MessengerService,
    UploadService,
    NotificationsService,
    FcmNotificationService,
    GoogleFCM,
    MailerService,
    MrBuildingMailerService,
    MessengerSaveMessageService,
    RealEstateAgentsAdvisorsService,
    RealEstateAdvisorTransformer,
    MarketplaceMessengerService,
    MarketplaceMessengerFactory,
    SmsService,
  ],
  exports: [WsServerGateway, WsServerService, WsServerModule],
})
export class WsServerModule {}
