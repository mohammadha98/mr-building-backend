import { Injectable } from "@nestjs/common";
import * as jmoment from "jalali-moment";
import { DateToPersian } from "src/modules/services/DateService";
import * as process from "process";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class MarketplaceMessengerTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      key: item.key,
      type: item.type,
      notification: item.notification ? item.notification : false,
      action_type: item.action_type,
      message_type: item.message_type,
      number_of_unread_messages: item.number_of_unread_messages
        ? item.number_of_unread_messages
        : 0,
      starter_info: this.getClientInfo(item.starter),
      participant_info: this.getClientInfo(item.participant),
      last_message: this.messageTransformer(item.messages),
      last_message_time: DateToPersian(item.last_message_time),
      message_time: item.last_message_time,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public getFileInfo(file: any) {
    if (!file) {
      return null;
    }

    return {
      id: file.id,
      size: file.size,
      length: file.length,
    };
  }

  public getClientInfo(item: any) {
    if (item) {
      return {
        id: item.id,
        name: item.name + " " + item.surname,
        phone: item.phone,
        // is_blocked: item.is_blocked,
        avatar: item.avatar
          ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${item.avatar}`
          : "",
      };
    }
  }

  public messageTransformer(item: any) {
    if (!item) {
      return null;
    }

    let content = item.content;
    if (item.type !== "text") {
      content = process.env.APP_CONTENT_PATH + item.content;
    }

    return {
      id: item.id,
      key: item.key,
      action_type: item.action_type,
      client_id: item.client_id,
      client_info: this.getClientInfo(item.client),
      type: item.type,
      content,
      caption: item.caption,
      size: item.size,
      length: item.length,
      thumbnail: item.thumbnail,
      seen: item.seen,
      is_blocked: item.is_blocked,
      is_edited: item.is_edited,
      is_deleted: item.is_deleted,
      have_reaction: item.have_reaction,
      reaction: item.reaction,
      is_replied: item.is_replied,
      replied_to: item.reply_to ? this.messageTransformer(item.reply_to) : null,
      replied_by: item.replied_by
        ? this.messageTransformer(item.replied_by[0])
        : null,
      created_at: DateToPersian(item.created_at),
      date: item.created_at,
    };
  }

  public messageCollection(items: any[]) {
    return items.map((item) => this.messageTransformer(item));
  }
}
