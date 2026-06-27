import { Injectable } from "@nestjs/common";
import * as jmoment from "jalali-moment";
import { DateToPersian } from "src/modules/services/DateService";
import * as process from "process";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class MessageTransformer {
  public transform(item: any) {
    return {
      id: item.id,
      key: item.key,
      type: item.type,
      chat_type: item.chat_type,
      source: item.source,
      number_of_unread_messages: item.number_of_unread_messages
        ? item.number_of_unread_messages
        : 0,
      starter_info: this.getClientInfo(item.starter),
      participant_info: this.getClientInfo(item.participant),
      last_message: this.messageTransformer(item.messages),
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
    return {
      id: item.id,
      name: item.name,
      phone: item.phone,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
        : "",
    };
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
      client_id: item.client_id,
      type: item.type,
      message_side: item.message_side,
      content,
      size: item.size,
      length: item.length,
      thumbnail: item.thumbnail,
      key: item.key,
      seen: item.seen,
      created_at: DateToPersian(item.created_at),
    };
  }

  public messageCollection(items: any[]) {
    return items.map((item) => this.messageTransformer(item));
  }
}
