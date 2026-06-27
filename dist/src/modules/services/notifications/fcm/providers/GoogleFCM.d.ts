import { INotificationProvider } from "../contracts/INotificationProvider";
import { INotification } from "../contracts/INotification";
import { INotificationTopic } from "../contracts/INotificationTopic";
export default class GoogleFCM implements INotificationProvider {
    constructor();
    send(data: INotification): Promise<void>;
    sendToTopic(data: INotificationTopic): Promise<void>;
    subscribeToTopic(notification_tokens: string[], topic: string): Promise<void>;
    unSubscribeToTopic(notification_tokens: string[], topic: string): Promise<void>;
}
