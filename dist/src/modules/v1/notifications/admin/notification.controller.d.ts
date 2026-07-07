import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NotificationsService } from "./notifications.service";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
import { CreateGeneralNotificationDto } from "./dto/create-client-notification.dto";
export declare class NotificationController {
    private readonly notificationsService;
    private readonly responseHandler;
    constructor(notificationsService: NotificationsService, responseHandler: HttpResponsehandler);
    saveNotificationForAdminUser(body: SaveNotificationTokenDto, req: any, res: Response): Promise<any>;
    sendGeneralNotification(body: CreateGeneralNotificationDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {};
    }>;
    GetGeneralNotification(): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: (import("@prisma/client/runtime").GetResult<{
            id: number;
            title: string;
            content: string;
            link: string;
            created_at: Date;
        }, unknown, never> & {})[];
    }>;
}
