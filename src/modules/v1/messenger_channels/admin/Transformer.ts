import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import * as jmoment from "jalali-moment";
import { DateToPersian } from "src/modules/services/DateService";
import { MessengerChannelsRequestTheOfficial } from "@prisma/client";
import * as process from "process";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class MessengerChannelTransformer {
  public transform(item: any) {
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      owner_id: item.owner_id,
      key: item.key,
      title: item.title,
      requested: item.request ? true : false,
      verified_channel: this.officialRequest(item.request),
      member_count: item.member_count ? item.member_count : 0,
      description: item.description,
      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/messenger/channels/${item.key}/avatar/${item.avatar}`
        : "",
      type: item.type,
      username: item.username,
      last_message_time: item.last_message_time
        ? DateToPersian(item.last_message_time)
        : null,
      message_time: item.last_message_time,
      client_info: this.clientInfo(item.owner),
      created_at: this.calculCreatedAt(item.created_at),
    };
  }

  public collection(items: any[]) {
    return items.map((item) => this.transform(item));
  }

  private clientInfo(client: any) {
    return {
      id: client.id,
      name: client.name + " " + client.surname,
      phone: client.phone,
    };
  }
  private officialRequest(request: MessengerChannelsRequestTheOfficial) {
    if (!request) {
      return null;
    }

    return {
      id: request.id,
      verified_channel: request.verified_channel,
      description: request.description,
      status: request.status,
    };
  }

  public transformOfficialChannel(item: any) {
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      verified_channel: item.verified_channel,
      description: item.description,
      status: item.status,
      created_at: item.createdAt,
      updatedAt: item.updatedAt,
      channel: this.transform(item.channel),
    };
  }

  public collectionOfficialChannel(items: any[]) {
    return items.map((item) => this.transformOfficialChannel(item));
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
      content,
      channel_id: item.channel_id,
      key: item.key,
      type: item.type,
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

  private memberTransform(items: any) {
    return {
      role: items.role,
      client_id: items.client.id,
      user_key: items.client.key,
      name: items.client.name + " " + items.client.surname,
      avatar: items.client.avatar
        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${items.client.avatar}`
        : "",
    };
  }

  public memberCollection(items: any[]) {
    return items.map((item) => this.memberTransform(item));
  }

  private calculCreatedAt(created_at: string) {
    const currentYear = Number(
      jmoment(new Date(Date.now())).locale("fa").format("YYYY")
    );

    const day = Number(jmoment(created_at).locale("fa").format("DD"));
    const month = jmoment(created_at).locale("fa").format("MMMM");
    const year = Number(jmoment(created_at).locale("fa").format("YYYY"));

    let info = "";
    if (Number(currentYear) === Number(year)) {
      info = month + " " + day.toString();
    } else {
      info = ` ${year} ${month} ${day} `;
    }
    return info;
  }
}
