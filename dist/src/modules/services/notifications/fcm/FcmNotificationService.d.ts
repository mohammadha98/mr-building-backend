import { INotificationProvider } from "./contracts/INotificationProvider";
import GoogleFCM from "./providers/GoogleFCM";
import { INotification } from "./contracts/INotification";
import { INotificationTopic } from "./contracts/INotificationTopic";
export default class FcmNotificationService implements INotificationProvider {
    private readonly defaultProvider;
    constructor(defaultProvider: GoogleFCM);
    send(body: INotification): Promise<void>;
    sendToTopic(body: INotificationTopic): Promise<void>;
    subscribeToTopic(notification_tokens: string[], topic: string): Promise<void>;
    unSubscribeToTopic(notification_tokens: string[], topic: string): Promise<void>;
}
