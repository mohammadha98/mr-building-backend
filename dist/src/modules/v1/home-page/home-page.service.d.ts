import { PrismaService } from "../../../../prisma/prisma.service";
import SliderTransformerApp from "src/modules/v1//slider/contracts/transformer-app";
import { GetHomePageDto } from "./dto/create-home-page.dto";
import { ClientService } from "../client/app/client.service";
import SliderTransformerAdmin from "../slider/contracts/transformer-admin";
import { MessengerChannelsService } from "../messenger_channels/app/messenger-channels.service";
import BannerTransformerApp from "../banners/contracts/transformer-app";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { NotificationsService } from "../notifications/app/notifications.service";
export declare class HomePageService {
    private readonly prisma;
    private readonly sliderTransformer;
    private readonly clientService;
    private readonly sliderTransformerAdmin;
    private readonly bannerTransformer;
    private readonly messengerChannelsService;
    private readonly fcmNotificationService;
    private readonly notificationsService;
    constructor(prisma: PrismaService, sliderTransformer: SliderTransformerApp, clientService: ClientService, sliderTransformerAdmin: SliderTransformerAdmin, bannerTransformer: BannerTransformerApp, messengerChannelsService: MessengerChannelsService, fcmNotificationService: FcmNotificationService, notificationsService: NotificationsService);
    homePage(query: GetHomePageDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            total_score: number;
            token: string;
            number_of_unread_messages: number;
            user_key: string;
            blocked_account_ids: any[];
            blocked_participant_ids: any[];
            has_update: boolean;
            force_update: any;
            roles: string[];
            estate_agent_info: any;
            advisor_info: any;
            operator: any;
            slider: {
                id: any;
                title: any;
                thumbnail: string;
            }[];
            slider_services: {
                id: any;
                title: any;
                tag: any;
                thumbnail: string;
                created_at: any;
            }[];
            banner_home: {
                id: any;
                title: any;
                thumbnail: string;
            };
            banner_services: {
                id: any;
                title: any;
                thumbnail: string;
            };
        };
    }>;
    private getServicesSlider;
    private getBanners;
    private getSlider;
}
