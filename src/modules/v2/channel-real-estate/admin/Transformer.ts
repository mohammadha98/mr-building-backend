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
    return {
      id: item.id,
      key: item.key,
      tag: item.tag,
      number_of_members: item._count.members,
      ...this.getChannelInfo(item.real_estate_agent),
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
      // seen_number: item.seen_number,
      created_at: DateToPersian(item.created_at),
    };
  }

  public messageCollection(items: any[]) {
    return items.map((item) => this.messageTransformer(item));
  }
}
