import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { NotificationsService } from "./notifications.service";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
export declare class NotificationController {
    private readonly notificationsService;
    private readonly responseHandler;
    constructor(notificationsService: NotificationsService, responseHandler: HttpResponsehandler);
    saveNotificationFoClient(body: SaveNotificationTokenDto, req: any, res: Response): Promise<any>;
}
