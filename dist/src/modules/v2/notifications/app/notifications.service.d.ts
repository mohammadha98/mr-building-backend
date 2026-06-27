import { CreateNotificationForUserDto } from "./dto/create-user-notification.dto";
import { PrismaService } from "prisma/prisma.service";
import { TestSendClientNotificationDto } from "./dto/test-send-client-notification.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
export declare class NotificationsService {
    private readonly prismaService;
    private readonly fcmNotificationService;
    constructor(prismaService: PrismaService, fcmNotificationService: FcmNotificationService);
    testSendClientNotificationDto(body: TestSendClientNotificationDto): Promise<{
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            notification_token: string;
            device_info: string;
            client_id: number;
            created_at: Date;
        }, unknown, never> & {};
    } | {
        status: number;
        result?: undefined;
    }>;
    saveNotificationFoClient(body: SaveNotificationTokenDto): Promise<{
        status: number;
    }>;
    saveNotificationForAdminUser(body: SaveNotificationTokenDto): Promise<{
        status: number;
    }>;
    findAllClientNotifications(): Promise<string>;
    saveNotificationFoAdminUsers(body: CreateNotificationForUserDto): Promise<string>;
    findAllAdminUsersNotifications(): Promise<string>;
    getClientNotificationToken(client_id: number): Promise<string[]>;
    getAdminUserNotificationToken(client_id: number): Promise<any[]>;
}
