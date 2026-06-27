import { Injectable } from "@nestjs/common";
import * as jmoment from "jalali-moment";
import { DateToPersian } from "src/modules/services/DateService";
import * as process from "process";

jmoment().locale("fa").format("YYYY/M/D");

@Injectable()
export default class MessengerGroupsTransformer {
  public transform(item: any, client_id: number) {
    if (!item) {
      return null;
    }

    let role;
    let permissions;
    let user_member_id = 0;
    let parent_ids = [];

    if (item.owner_id === client_id) {
      role = "owner";
      permissions = ["owner"];
      user_member_id = 1;
    } else {
      if (item.members.length > 0) {
        role = item.members[0].role;
        permissions = item.members[0].permissions;
        user_member_id = item.members[0].id;
        parent_ids = item.members[0].parent_ids;
      } else {
        role = "member";
        permissions = [];
        user_member_id = 0;
      }
    }

    let member_is_muted = false;
    if (item.members.length > 0) {
      member_is_muted = item.members[0].member_is_muted;
    }

    return {
      id: item.id,
      owner_id: item.owner_id,
      is_owner: item.owner_id === client_id,
      member_is_muted,
      notification: item.notification ? item.notification : false,
      role,
      permissions,
      user_member_id,
      parent_ids,
      key: item.key,
      title: item.title,
      member_count: item.member_count ? item.member_count : 1,
      member_ids: item.member_ids ? item.member_ids : [],
      description: item.description,

      avatar: item.avatar
        ? `${process.env.APP_CONTENT_PATH}/messenger/groups/${item.key}/avatar/${item.avatar}`
        : "",
      type: item.type,
      message_type: item.message_type ? item.message_type : null,
      link: item.username,
      // notification: item.notification,
      number_of_unread_messages: item.members[0]
        ? item.number_of_messages - item.members[0].number_of_read_messages
        : item.number_of_messages,
      last_message: item.messages
        ? this.messageCollection(item.messages)
        : null,
      last_message_time: item.last_message_time
        ? DateToPersian(item.last_message_time)
        : null,
      message_time: item.last_message_time,
    };
  }

  public collection(items: any[], client_id: number) {
    return items.map((item) => this.transform(item, client_id));
  }

  public messageTransformer(item: any) {
    if (!item) {
      return null;
    }

    let forward_from = null;
    if (item.action_type === "forward") {
      if (item.forward_from === "user") {
        if (!item.forward_from_client) {
          forward_from = {
            id: 0,
            key: "",
            type: "user",
            title: "",
            avatar: "",
          };
        } else {
          forward_from = {
            id: item.forward_from_client.id,
            key: item.key,
            type: "user",
            title:
              item.forward_from_client.name +
              " " +
              item.forward_from_client.surname,
            avatar: item.forward_from_client.avatar
              ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${item.forward_from_client.avatar}`
              : "",
          };
        }
      } else if (item.forward_from === "channel") {
        if (!item.forward_from_channel) {
          forward_from = {
            id: 0,
            key: "",
            type: "channel",
            title: "",
            avatar: "",
          };
        } else {
          forward_from = {
            id: item.forward_from_channel.id,
            key: item.forward_from_channel.key,
            type: "channel",
            title: item.forward_from_channel.title,
            avatar: item.forward_from_channel.avatar
              ? `${process.env.APP_CONTENT_PATH}/messenger/channels/${item.forward_from_channel.key}/avatar/${item.forward_from_channel.avatar}`
              : "",
          };
        }
      }
    }

    let content = item.content;
    if (item.type !== "text") {
      content = process.env.APP_CONTENT_PATH + item.content;
    }

    return {
      id: item.id,
      action_type: item.action_type,
      is_forwarded: item.is_forwarded,
      forward_from,
      client_info: this.clientInfo(item.owner),
      content,
      caption: item.caption,
      group_id: item.group_id,
      key: item.key,
      type: item.type,
      size: item.size,
      length: item.length,
      thumbnail: item.thumbnail,
      is_reply: item.is_replied,
      reply_to: this.messageTransformer(item.reply_to),
      // seen_number: item.seen_number,
      created_at: DateToPersian(item.created_at),
    };
  }

  public messageCollection(items: any[]) {
    return items.map((item) => this.messageTransformer(item));
  }

  private clientInfo(client: any) {
    return {
      id: client.id,
      name: client.name + " " + client.surname,
      avatar: client.avatar
        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${client.avatar}`
        : "",
      phone: client.phone,
      key: client.key,
    };
  }

  public memberTransform(items: any) {
    return {
      member_id: items.id,
      creator_id: items.creator_id,
      parent_ids: items.parent_ids,
      role: items.role, // owner, member, admin
      permissions: items.permissions, // owner | permission list
      client_id: items.client.id,
      user_key: items.client.key,
      phone: items.client.phone,
      name: items.client.name + " " + items.client.surname,
      avatar: items.client.avatar
        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${items.client.avatar}`
        : "",
    };
  }

  public memberCollection(items: any[]) {
    return items.map((item) => this.memberTransform(item));
  }
}
