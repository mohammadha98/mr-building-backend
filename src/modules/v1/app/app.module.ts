import { Module } from "@nestjs/common";
import { AuthModule } from "src/modules/v1/auth/auth.module";
import { ClientModule } from "src/modules/v1/client/client.module";
import { WebinarModule } from "src/modules/v1/webinar/webinar.module";
import { SliderModule } from "src/modules/v1/slider/slider.module";
import { HomePageModule } from "src/modules/v1/home-page/home-page.module";
import { ContactsModule } from "src/modules/v1/contacts/contacts.module";
import { ProvincesModule } from "src/modules/v1/provinces/provinces.module";
import { RealEstateAgentsModule } from "src/modules/v1/real-estate-agents/real-estate-agents.module";
import { EventRoomsModule } from "src/modules/v1/event-rooms/event-rooms.module";
import { EventsModule } from "src/modules/v1/events/events.module";
import { UsersModule } from "src/modules/v1/users/admin/users.module";
import { RealEstateAdsModule } from "src/modules/v1/real-estate-ads/real-estate-ads.module";
import { RealEstateAgentsCommentsModule } from "src/modules/v1/real-estate-agents-comments/real-estate-agents-comments.module";
import { ForceUpdateModule } from "src/modules/v1/force-update/force-update.module";
import { ConfigModule } from "@nestjs/config";
import { RealEstateAgentsAdvisorsAppModule } from "src/modules/v1/real-estate-agents-advisors/app/real-estate-agents-advisors.module";
import { ChatRealEstateModule } from "src/modules/v1/chat-real-estate/chat-real-estate.module";
import { WsServerModule } from "src/modules/v1/ws-server/ws-server.module";
import { UploaderModule } from "src/modules/v1/uploader/uploader.module";
import { ChannelRealEstateModule } from "src/modules/v1/channel-real-estate/channel-real-estate.module";
import { ValidateClientsModule } from "src/modules/v1/validate-clients/validate-clients.module";
import { RealEstateAgentsAdvisorsAdminModule } from "src/modules/v1/real-estate-agents-advisors/admin/real-estate-agents-advisors.module";
import { RealEstateAgentsAdminsModule } from "src/modules/v1/real-estate-agents-admins/real-estate-agents-admins.module";
import { ReportModule } from "src/modules/v1/reports/report.module";
import { MissionsModule } from "src/modules/v1/missions/missions.module";
import { PrizesModule } from "src/modules/v1/prizes/prizes.module";
import { TermsOfServicesModule } from "src/modules/v1/terms-of-services/terms-of-services.module";
import { ReferalCodeModule } from "src/modules/v1/referral-code/referal-code.module";
import { MessengerModule } from "src/modules/v1/messenger/messenger.module";
import { MessengerChannelsModule } from "src/modules/v1/messenger_channels/messenger-channels.module";
import { MessengerGroupsModule } from "src/modules/v1/messenger_groups/messenger-groups.module";
import { AdminUsersRolesModule } from "src/modules/v1/admin-users-roles/channel-real-estate.module";
import { ServiceModulesModule } from "src/modules/v1/service-modules/service-modules.module";
import { RealEstateAdsFormsModule } from "../real-estate-ads-forms/real-estate-ads-forms.module";
import { StorefrontModule } from "../marketplace-storefront/storefront.module";
import { NotificationModule } from "../notifications/notification.module";
import { MarketplaceCategoriesModule } from "../marketplace-categories/marketplace-categories.module";
import { MarketplaceBrandsModule } from "../marketplace-brands/marketplace-brands.module";
import { MarketplaceProductFeatureFormsModule } from "../marketplace-product-features-form/marketplace-product-feature-forms.module";
import { DbBackupModule } from "../db-backup/dbBackup.module";
import { MessengerSaveMessageModule } from "../messenger-save-message/save-message.module";
import { AdminReportsModule } from "../admin-reports/admin-reports.module";
import { InwardMarketStatsModule } from "../inward-market-stats/inward-market-stats.module";
import { BannerModule } from "../banners/banner.module";
import { MarketplaceModule } from "../marketplace/marketplace.module";
import { MyCityModule } from "../my-city/my-city.module";
import { MyCityBookmarksModule } from "../my-city-bookmarks/my-city-bookmarks.module";
import { MarketplaceMessengerModule } from "../marketplace-messenger/marketplace-messenger.module";
// @ts-ignore
import { PrismaModule } from "../../../../prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // WsServerModule,
    PrismaModule,
    MarketplaceMessengerModule,
    MyCityModule,
    MyCityBookmarksModule,
    MarketplaceModule,
    BannerModule,
    InwardMarketStatsModule,
    AdminReportsModule,
    AuthModule,
    MessengerSaveMessageModule,
    NotificationModule,
    ClientModule,
    MarketplaceProductFeatureFormsModule,
    MarketplaceBrandsModule,
    MarketplaceCategoriesModule,
    StorefrontModule,
    RealEstateAdsFormsModule,
    ServiceModulesModule,
    AdminUsersRolesModule,
    UsersModule,
    WebinarModule,
    EventRoomsModule,
    EventsModule,
    HomePageModule,
    SliderModule,
    ContactsModule,
    ProvincesModule,
    RealEstateAgentsModule,
    RealEstateAdsModule,
    RealEstateAgentsCommentsModule,
    ForceUpdateModule,
    RealEstateAgentsAdvisorsAdminModule,
    RealEstateAgentsAdvisorsAppModule,
    ChatRealEstateModule,
    UploaderModule,
    DbBackupModule,
    ChannelRealEstateModule,
    ValidateClientsModule,
    RealEstateAgentsAdminsModule,
    ReportModule,
    MissionsModule,
    PrizesModule,
    TermsOfServicesModule,
    ReferalCodeModule,
    MessengerModule,
    MessengerChannelsModule,
    MessengerGroupsModule,
  ],
})
export class AppV1Module {}
