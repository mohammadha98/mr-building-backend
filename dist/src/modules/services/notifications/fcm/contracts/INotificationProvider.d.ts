import { INotification } from "./INotification";
import { INotificationTopic } from "./INotificationTopic";
export interface INotificationProvider {
    send(data: INotification): Promise<void>;
    sendToTopic(data: INotificationTopic): Promise<void>;
}
