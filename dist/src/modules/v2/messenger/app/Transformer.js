"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jmoment = require("jalali-moment");
const DateService_1 = require("../../../services/DateService");
const process = require("process");
jmoment().locale("fa").format("YYYY/M/D");
let MessengerAppTransformer = class MessengerAppTransformer {
    transform(item) {
        return {
            id: item.id,
            key: item.key,
            type: item.type,
            notification: item.notification ? item.notification : false,
            is_blocked: item.is_blocked,
            is_forwarded: item.is_forwarded,
            action_type: item.action_type,
            chat_blocking_status: item.chat_blocking_status,
            blocked_account_ids: item.blocked_account_ids,
            blocked_participant: item.blocked_participant,
            blocked_by_participant: item.blocked_by_participant,
            message_type: item.message_type ? item.message_type : "chat",
            number_of_unread_messages: item.number_of_unread_messages
                ? item.number_of_unread_messages
                : 0,
            starter_info: this.getClientInfo(item.starter),
            participant_info: this.getClientInfo(item.participant),
            last_message: this.messageTransformer(item.messages),
            last_message_time: (0, DateService_1.DateToPersian)(item.last_message_time),
            message_time: item.last_message_time,
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    getFileInfo(file) {
        if (!file) {
            return null;
        }
        return {
            id: file.id,
            size: file.size,
            length: file.length,
        };
    }
    getClientInfo(item) {
        if (item) {
            return {
                id: item.id,
                name: item.name + " " + item.surname,
                phone: item.phone,
                avatar: item.avatar
                    ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${item.avatar}`
                    : "",
            };
        }
    }
    messageTransformer(item) {
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
                }
                else {
                    forward_from = {
                        id: item.forward_from_client.id,
                        key: item.forward_from_client.key,
                        type: "user",
                        title: item.forward_from_client.title,
                        avatar: item.forward_from_client.avatar
                            ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${item.forward_from_client.avatar}`
                            : "",
                    };
                }
            }
            else if (item.forward_from === "channel") {
                if (!item.forward_from_channel) {
                    forward_from = {
                        id: 0,
                        key: "",
                        type: "channel",
                        title: "",
                        avatar: "",
                    };
                }
                else {
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
            key: item.chat_key,
            action_type: item.action_type,
            is_forwarded: item.is_forwarded,
            forward_from,
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
            created_at: (0, DateService_1.DateToPersian)(item.created_at),
            date: item.created_at,
        };
    }
    messageCollection(items) {
        return items.map((item) => this.messageTransformer(item));
    }
};
MessengerAppTransformer = __decorate([
    (0, common_1.Injectable)()
], MessengerAppTransformer);
exports.default = MessengerAppTransformer;
//# sourceMappingURL=Transformer.js.map