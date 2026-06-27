import { Injectable } from "@nestjs/common";
import * as jmoment from "jalali-moment";
import { DateToPersian } from "src/modules/services/DateService";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class ChannelTransformer {
  public transform(item: any) {
    if (!item) {
      return null;
    }

    console.log("number_of_messages", item.number_of_messages);

    return {
      id: item.id,
      key: item.key,
      ...this.getChannelInfo(item.real_estate_agent),
      number_of_unread_messages: item.members[0]
        ? item.number_of_messages - item.members[0].number_of_read_messages
        : 0,
      last_message: item.messages
        ? this.messageTransformer(item.messages[0])
        : null,
      last_message_time: item.last_message_time
        ? DateToPersian(item.last_message_time)
        : null,
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  public getChannelInfo(item: any) {
    return {
      agent_id: item.id,
      name: item.name,
      profile: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
        : "",
    };
  }

  public messageTransformer(item: any) {
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      channel_id: item.channel_id,
      key: item.key,
      type: item.type,
      content: item.content,
      size: item.size,
      length: item.length,
      thumbnail: item.thumbnail,
      // seen_number: item.seen_number,
      created_at: DateToPersian(item.created_at),
    };
  }

  public messageCollection(items: any[]) {
    return items.map((item) => this.messageTransformer(item));
  }
}
