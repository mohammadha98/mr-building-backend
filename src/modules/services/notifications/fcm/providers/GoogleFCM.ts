import { INotificationProvider } from "../contracts/INotificationProvider";
import { Injectable } from "@nestjs/common";
import { INotification } from "../contracts/INotification";
import { IBulkNotification } from "../contracts/IBulkNotification";
import * as firebase from "firebase-admin";
import * as path from "path";
import { INotificationTopic } from "../contracts/INotificationTopic";

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, "../../../../../../../", "firebase-adminsdk.json")
  )
});


@Injectable()
export default class GoogleFCM implements INotificationProvider {
  constructor() {
  } // private readonly notificationsRepo: Notifications,

  async send(data: INotification): Promise<void> {
    // save notification in db

    await firebase
      .messaging()
      .send({
        // notification: { title: data.title, body: data.body },
        data: {
          body: data.body,
          key: data.key
        },
        token: data.notification_token,
        android: { priority: "high" }
      })
      .catch((error: any) => {
        console.log("Failed To Send FCM");
        // console.error(error);
      });
  }

  async sendToTopic(data: INotificationTopic): Promise<void> {
    console.log('sendToTopic ', data.topic);

    await firebase
      .messaging()
      .send(
        {
          topic: data.topic,
          // notification: { title: data.title, body: data.body },
          data: { body: data.body, key: data.key }
        }
      )
      .catch((error: any) => {
        console.log("Failed To Topic FCM");
        console.error(error);
      });
  }

  async subscribeToTopic(notification_tokens: string[], topic: string) {
    // TODO: test log in Notification FCM Service

    console.log('subscribeToTopic');
    console.log({topic});
    await firebase
      .messaging()
      .subscribeToTopic(notification_tokens, topic)
      .then((response) => {
        console.log("Successfully subscribed to topic");
      })
      .catch((error) => {
        console.log("Error subscribing to topic:", error);
      });
  }

  async unSubscribeToTopic(notification_tokens: string[], topic: string) {
    // TODO: test log in Notification FCM Service

    await firebase
      .messaging()
      .unsubscribeFromTopic(notification_tokens, topic)
      .then((response) => {
        console.log("Successfully unSubscribe to topic:", response);
        console.log({ response });
      })
      .catch((error) => {
        console.log("Error unSubscribe to topic:", error);
      });
  }
}
