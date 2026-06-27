"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const Statuses_1 = require("../../../commons/contracts/Statuses");
const UserTypes_1 = require("../../../commons/contracts/UserTypes");
const transformer_app_1 = require("../slider/contracts/transformer-app");
const InstalledVersionTypes_1 = require("../../../commons/contracts/InstalledVersionTypes");
const client_service_1 = require("../client/app/client.service");
const MissionTypes_1 = require("../../../commons/contracts/MissionTypes");
const slider_enum_1 = require("../slider/enums/slider.enum");
const transformer_admin_1 = require("../slider/contracts/transformer-admin");
const messenger_channels_service_1 = require("../messenger_channels/app/messenger-channels.service");
const transformer_app_2 = require("../banners/contracts/transformer-app");
const FcmNotificationService_1 = require("../../services/notifications/fcm/FcmNotificationService");
const notifications_service_1 = require("../notifications/app/notifications.service");
const FCM_Notification_enum_1 = require("../notifications/enums/FCM-Notification.enum");
let HomePageService = class HomePageService {
    constructor(prisma, sliderTransformer, clientService, sliderTransformerAdmin, bannerTransformer, messengerChannelsService, fcmNotificationService, notificationsService) {
        this.prisma = prisma;
        this.sliderTransformer = sliderTransformer;
        this.clientService = clientService;
        this.sliderTransformerAdmin = sliderTransformerAdmin;
        this.bannerTransformer = bannerTransformer;
        this.messengerChannelsService = messengerChannelsService;
        this.fcmNotificationService = fcmNotificationService;
        this.notificationsService = notificationsService;
    }
    async homePage(query) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { id: query.client_id }
            });
            if (!client) {
                return { status: 403 };
            }
            const roles = client.roles;
            const generalNotificationSettings = await this.prisma.generalNotificationSettings.findFirst({
                where: { enabled: true }
            });
            if (generalNotificationSettings && generalNotificationSettings.enabled && client.has_update_general_notification) {
                const tokens = await this.notificationsService.getClientNotificationToken(client.id);
                await this.fcmNotificationService.subscribeToTopic(tokens, FCM_Notification_enum_1.default.GeneralNotification);
                await this.prisma.client.update({ where: { id: client.id }, data: { has_update_general_notification: false } });
            }
            let estate_agent_info = null;
            let advisor_info = null;
            const operator = {};
            if (roles.includes(UserTypes_1.default.estate_agent)) {
                estate_agent_info = (await this.prisma.realEstateAgents.findFirst({
                    where: { client_id: query.client_id },
                    select: {
                        id: true,
                        phone: true,
                        validate_phone: true,
                        name: true,
                        avatar: true,
                        license: true,
                        license_status: true,
                        status: true,
                        score: true,
                        number_of_ads: true,
                        client_id: true,
                        province: { select: { id: true, name: true } },
                        city: { select: { id: true, name: true } }
                    }
                }));
                const channel = await this.messengerChannelsService.findChannelByClientId(estate_agent_info.client_id, client.id, "real_estate");
                estate_agent_info.channel = channel;
            }
            else if (roles.includes(UserTypes_1.default.advisor)) {
                advisor_info = await this.prisma.realEstateAdvisors.findFirst({
                    where: { client_id: query.client_id },
                    select: {
                        id: true,
                        avatar: true,
                        biography: true,
                        comment_visibility: true,
                        status: true,
                        score: true,
                        total_score: true,
                        number_of_ads: true,
                        total_customers: true,
                        phone: true,
                        validate_phone: true,
                        permissions: true,
                        color: true,
                        client: {
                            select: { id: true, name: true, surname: true, avatar: true }
                        },
                        real_estate_agent: {
                            select: { id: true, name: true, score: true }
                        }
                    }
                });
            }
            if (roles.includes(UserTypes_1.default.operator_estate_agent)) {
                const operatorPermisions = await this.prisma.operator_realEstateAgents.findFirst({
                    where: { client_id: query.client_id },
                    select: {
                        provinces: true,
                        cities: true
                    }
                });
                const number_of_approved_ads = await this.prisma.realEstateAdApproval.count({
                    where: {
                        user_id: Number(query.client_id),
                        user_type: client.roles[client.roles.indexOf(UserTypes_1.default.client) + 1]
                    }
                });
                operatorPermisions.provinces = [client.provincesId];
                operatorPermisions.cities = [client.citiesId];
                operator.real_estate_agent = operatorPermisions;
                operator.real_estate_agent.number_of_approved_ads =
                    number_of_approved_ads;
            }
            let forceUpdate = null;
            if (!query.installed_version_type) {
                query.installed_version_type = InstalledVersionTypes_1.default.direct;
            }
            if (query.installed_version_type == InstalledVersionTypes_1.default.direct &&
                client.has_update_direct) {
                forceUpdate = await this.prisma.forceUpdate.findFirst({
                    where: {
                        status: Statuses_1.default.active,
                        installed_version_type: query.installed_version_type
                    },
                    orderBy: { id: "desc" },
                    select: {
                        id: true,
                        installed_version_type: true,
                        version: true,
                        required: true,
                        file_name: true,
                        indirect_link: true,
                        content: true,
                        items: true
                    }
                });
            }
            else if (query.installed_version_type == InstalledVersionTypes_1.default.cafebazar &&
                client.has_update_cafebazar) {
                forceUpdate = await this.prisma.forceUpdate.findFirst({
                    where: {
                        status: Statuses_1.default.active,
                        installed_version_type: query.installed_version_type
                    },
                    orderBy: { id: "desc" },
                    select: {
                        id: true,
                        installed_version_type: true,
                        version: true,
                        required: true,
                        file_name: true,
                        indirect_link: true,
                        content: true,
                        items: true
                    }
                });
            }
            else if (query.installed_version_type == InstalledVersionTypes_1.default.myket &&
                client.has_update_myket) {
                forceUpdate = await this.prisma.forceUpdate.findFirst({
                    where: {
                        status: Statuses_1.default.active,
                        installed_version_type: query.installed_version_type
                    },
                    orderBy: { id: "desc" },
                    select: {
                        id: true,
                        installed_version_type: true,
                        version: true,
                        required: true,
                        file_name: true,
                        indirect_link: true,
                        content: true,
                        items: true
                    }
                });
            }
            const slider = await this.getSlider();
            const missionInfo = await this.prisma.missions.findFirst({
                where: { key: MissionTypes_1.default.daily_score }
            });
            await this.clientService.saveMission(missionInfo, client);
            const blockedHistory = await this.prisma.messengerBlockHistory.findMany({
                where: {
                    OR: [{ clientId: client.id }, { targetId: client.id }]
                }
            });
            const blocked_account_ids = [];
            const blocked_participant_ids = [];
            const number_of_unread_messages = await this.prisma.chatMessengerMessages.count({
                where: { destination_id: client.id, seen: false }
            });
            blockedHistory.map((item) => {
                if (client.id === item.clientId) {
                    blocked_account_ids.push(item.targetId);
                }
                else if (client.id !== item.clientId) {
                    blocked_participant_ids.push(item.clientId);
                }
            });
            const slider_services = await this.getServicesSlider();
            const banner_home = await this.getBanners(slider_enum_1.SliderEnum.home);
            const banner_services = await this.getBanners(slider_enum_1.SliderEnum.services);
            return {
                status: 200,
                result: {
                    total_score: client.score,
                    token: client.token,
                    number_of_unread_messages,
                    user_key: client.key,
                    blocked_account_ids,
                    blocked_participant_ids,
                    has_update: query.installed_version_type === InstalledVersionTypes_1.default.direct
                        ? client.has_update_direct
                        : client.has_update_cafebazar,
                    force_update: forceUpdate,
                    roles,
                    estate_agent_info,
                    advisor_info,
                    operator,
                    slider,
                    slider_services,
                    banner_home,
                    banner_services
                }
            };
        }
        catch (error) {
            console.log("*** Error in Get HomePage Items ***");
            console.log(error);
            return { status: 500 };
        }
    }
    async getServicesSlider() {
        const slider = await this.prisma.slider.findMany({
            where: { tag: slider_enum_1.SliderEnum.services },
            select: {
                id: true,
                thumbnail: true
            }
        });
        return this.sliderTransformerAdmin.collection(slider);
    }
    async getBanners(tag) {
        const slider = await this.prisma.banners.findFirst({
            where: { tag },
            select: {
                id: true,
                thumbnail: true,
                url: true
            }
        });
        return this.bannerTransformer.transform(slider);
    }
    async getSlider() {
        const slider = await this.prisma.slider.findMany({
            where: {
                status: Statuses_1.default.active,
                tag: slider_enum_1.SliderEnum.home
            }
        });
        return this.sliderTransformer.collection(slider);
    }
};
HomePageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transformer_app_1.default,
        client_service_1.ClientService,
        transformer_admin_1.default,
        transformer_app_2.default,
        messenger_channels_service_1.MessengerChannelsService,
        FcmNotificationService_1.default,
        notifications_service_1.NotificationsService])
], HomePageService);
exports.HomePageService = HomePageService;
//# sourceMappingURL=home-page.service.js.map