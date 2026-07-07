import { PrismaService } from "src/../prisma/prisma.service";
import { TestSendClientNotificationDto } from "./dto/test-send-client-notification.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
import { HttpStatusCode } from "axios";
import { PublicMessage } from "src/commons/enums/messages";
import { CreateGeneralNotificationDto } from "./dto/create-client-notification.dto";
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
    sendGeneralNotification(body: CreateGeneralNotificationDto): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {};
    }>;
    getGeneralNotification(): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: (import("@prisma/client/runtime").GetResult<{
            id: number;
            title: string;
            content: string;
            link: string;
            created_at: Date;
        }, unknown, never> & {})[];
    }>;
    saveNotificationForAdminUser(body: SaveNotificationTokenDto): Promise<{
        status: number;
    }>;
    getClientNotificationToken(client_id: number): Promise<string[]>;
    getAdminUserNotificationToken(client_id: number): Promise<any[]>;
}
