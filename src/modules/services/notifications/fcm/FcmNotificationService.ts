import { INotificationProvider } from "./contracts/INotificationProvider";
import GoogleFCM from "./providers/GoogleFCM";
import { INotification } from "./contracts/INotification";
import { INotificationTopic } from "./contracts/INotificationTopic";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class FcmNotificationService implements INotificationProvider {
  constructor(private readonly defaultProvider: GoogleFCM) {}

  public async send(body: INotification) {
    await this.defaultProvider.send(body);
  }

  public async sendToTopic(body: INotificationTopic) {
    await this.defaultProvider.sendToTopic(body);
  }

  public async subscribeToTopic(notification_tokens: string[], topic: string) {
    await this.defaultProvider.subscribeToTopic(notification_tokens, topic);
  }

  public async unSubscribeToTopic(
    notification_tokens: string[],
    topic: string
  ) {
    await this.defaultProvider.unSubscribeToTopic(notification_tokens, topic);
  }
}
