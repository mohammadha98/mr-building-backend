import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NotificationsService } from "./notifications.service";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
import { CreateGeneralNotificationDto } from "./dto/create-client-notification.dto";
export declare class NotificationController {
    private readonly notificationsService;
    private readonly responseHandler;
    constructor(notificationsService: NotificationsService, responseHandler: HttpResponsehandler);
    saveNotificationFoClient(body: SaveNotificationTokenDto, req: any, res: Response): Promise<any>;
    generalNotification(body: CreateGeneralNotificationDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {};
    }>;
    saveNotificationForAdminUser(body: SaveNotificationTokenDto, req: any, res: Response): Promise<any>;
}
