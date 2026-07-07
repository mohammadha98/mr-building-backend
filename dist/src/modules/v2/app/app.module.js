"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppV2Module = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const client_module_1 = require("../client/client.module");
const webinar_module_1 = require("../webinar/webinar.module");
const slider_module_1 = require("../slider/slider.module");
const home_page_module_1 = require("../home-page/home-page.module");
const contacts_module_1 = require("../contacts/contacts.module");
const provinces_module_1 = require("../provinces/provinces.module");
const real_estate_agents_module_1 = require("../real-estate-agents/real-estate-agents.module");
const event_rooms_module_1 = require("../event-rooms/event-rooms.module");
const events_module_1 = require("../events/events.module");
const users_module_1 = require("../users/admin/users.module");
const real_estate_ads_module_1 = require("../real-estate-ads/real-estate-ads.module");
const real_estate_agents_comments_module_1 = require("../real-estate-agents-comments/real-estate-agents-comments.module");
const force_update_module_1 = require("../force-update/force-update.module");
const config_1 = require("@nestjs/config");
const real_estate_agents_advisors_module_1 = require("../real-estate-agents-advisors/app/real-estate-agents-advisors.module");
const chat_real_estate_module_1 = require("../chat-real-estate/chat-real-estate.module");
const ws_server_module_1 = require("../ws-server/ws-server.module");
const uploader_module_1 = require("../uploader/uploader.module");
const channel_real_estate_module_1 = require("../channel-real-estate/channel-real-estate.module");
const validate_clients_module_1 = require("../validate-clients/validate-clients.module");
const real_estate_agents_advisors_module_2 = require("../real-estate-agents-advisors/admin/real-estate-agents-advisors.module");
const real_estate_agents_admins_module_1 = require("../real-estate-agents-admins/real-estate-agents-admins.module");
const report_module_1 = require("../reports/report.module");
const missions_module_1 = require("../missions/missions.module");
const prizes_module_1 = require("../prizes/prizes.module");
const terms_of_services_module_1 = require("../terms-of-services/terms-of-services.module");
const referal_code_module_1 = require("../referral-code/referal-code.module");
const messenger_module_1 = require("../messenger/messenger.module");
const messenger_channels_module_1 = require("../messenger_channels/messenger-channels.module");
const messenger_groups_module_1 = require("../messenger_groups/messenger-groups.module");
const channel_real_estate_module_2 = require("../admin-users-roles/channel-real-estate.module");
const service_modules_module_1 = require("../service-modules/service-modules.module");
const real_estate_ads_forms_module_1 = require("../real-estate-ads-forms/real-estate-ads-forms.module");
const storefront_module_1 = require("../marketplace-storefront/storefront.module");
const notification_module_1 = require("../notifications/notification.module");
const marketplace_categories_module_1 = require("../marketplace-categories/marketplace-categories.module");
const marketplace_brands_module_1 = require("../marketplace-brands/marketplace-brands.module");
const marketplace_product_feature_forms_module_1 = require("../marketplace-product-features-form/marketplace-product-feature-forms.module");
const dbBackup_module_1 = require("../db-backup/dbBackup.module");
const save_message_module_1 = require("../messenger-save-message/save-message.module");
const admin_reports_module_1 = require("../admin-reports/admin-reports.module");
const inward_market_stats_module_1 = require("../inward-market-stats/inward-market-stats.module");
const banner_module_1 = require("../banners/banner.module");
const marketplace_module_1 = require("../marketplace/marketplace.module");
const my_city_module_1 = require("../my-city/my-city.module");
const my_city_bookmarks_module_1 = require("../my-city-bookmarks/my-city-bookmarks.module");
const marketplace_messenger_module_1 = require("../marketplace-messenger/marketplace-messenger.module");
const prisma_module_1 = require("../../../../prisma/prisma.module");
const database_seeder_module_1 = require("../admin-users-roles/seeds/database-seeder.module");
let AppV2Module = class AppV2Module {
};
AppV2Module = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            ws_server_module_1.WsServerModule,
            prisma_module_1.PrismaModule,
            marketplace_messenger_module_1.MarketplaceMessengerModule,
            my_city_module_1.MyCityModule,
            my_city_bookmarks_module_1.MyCityBookmarksModule,
            marketplace_module_1.MarketplaceModule,
            banner_module_1.BannerModule,
            inward_market_stats_module_1.InwardMarketStatsModule,
            admin_reports_module_1.AdminReportsModule,
            auth_module_1.AuthModule,
            save_message_module_1.MessengerSaveMessageModule,
            notification_module_1.NotificationModule,
            client_module_1.ClientModule,
            marketplace_product_feature_forms_module_1.MarketplaceProductFeatureFormsModule,
            marketplace_brands_module_1.MarketplaceBrandsModule,
            marketplace_categories_module_1.MarketplaceCategoriesModule,
            storefront_module_1.StorefrontModule,
            real_estate_ads_forms_module_1.RealEstateAdsFormsModule,
            service_modules_module_1.ServiceModulesModule,
            channel_real_estate_module_2.AdminUsersRolesModule,
            users_module_1.UsersModule,
            webinar_module_1.WebinarModule,
            event_rooms_module_1.EventRoomsModule,
            events_module_1.EventsModule,
            home_page_module_1.HomePageModule,
            slider_module_1.SliderModule,
            contacts_module_1.ContactsModule,
            provinces_module_1.ProvincesModule,
            real_estate_agents_module_1.RealEstateAgentsModule,
            real_estate_ads_module_1.RealEstateAdsModule,
            real_estate_agents_comments_module_1.RealEstateAgentsCommentsModule,
            force_update_module_1.ForceUpdateModule,
            real_estate_agents_advisors_module_2.RealEstateAgentsAdvisorsAdminModule,
            real_estate_agents_advisors_module_1.RealEstateAgentsAdvisorsAppModule,
            chat_real_estate_module_1.ChatRealEstateModule,
            uploader_module_1.UploaderModule,
            dbBackup_module_1.DbBackupModule,
            channel_real_estate_module_1.ChannelRealEstateModule,
            validate_clients_module_1.ValidateClientsModule,
            real_estate_agents_admins_module_1.RealEstateAgentsAdminsModule,
            report_module_1.ReportModule,
            missions_module_1.MissionsModule,
            prizes_module_1.PrizesModule,
            terms_of_services_module_1.TermsOfServicesModule,
            referal_code_module_1.ReferalCodeModule,
            messenger_module_1.MessengerModule,
            messenger_channels_module_1.MessengerChannelsModule,
            messenger_groups_module_1.MessengerGroupsModule,
            database_seeder_module_1.DatabaseSeederModule
        ],
    })
], AppV2Module);
exports.AppV2Module = AppV2Module;
//# sourceMappingURL=app.module.js.map