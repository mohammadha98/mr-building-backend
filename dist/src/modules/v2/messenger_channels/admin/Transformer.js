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
let MessengerChannelTransformer = class MessengerChannelTransformer {
    transform(item) {
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
                ? (0, DateService_1.DateToPersian)(item.last_message_time)
                : null,
            message_time: item.last_message_time,
            client_info: this.clientInfo(item.owner),
            created_at: this.calculCreatedAt(item.created_at),
        };
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    clientInfo(client) {
        return {
            id: client.id,
            name: client.name + " " + client.surname,
            phone: client.phone,
        };
    }
    officialRequest(request) {
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
    transformOfficialChannel(item) {
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
    collectionOfficialChannel(items) {
        return items.map((item) => this.transformOfficialChannel(item));
    }
    messageTransformer(item) {
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
            created_at: (0, DateService_1.DateToPersian)(item.created_at),
        };
    }
    messageCollection(items) {
        return items.map((item) => this.messageTransformer(item));
    }
    memberTransform(items) {
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
    memberCollection(items) {
        return items.map((item) => this.memberTransform(item));
    }
    calculCreatedAt(created_at) {
        const currentYear = Number(jmoment(new Date(Date.now())).locale("fa").format("YYYY"));
        const day = Number(jmoment(created_at).locale("fa").format("DD"));
        const month = jmoment(created_at).locale("fa").format("MMMM");
        const year = Number(jmoment(created_at).locale("fa").format("YYYY"));
        let info = "";
        if (Number(currentYear) === Number(year)) {
            info = month + " " + day.toString();
        }
        else {
            info = ` ${year} ${month} ${day} `;
        }
        return info;
    }
};
MessengerChannelTransformer = __decorate([
    (0, common_1.Injectable)()
], MessengerChannelTransformer);
exports.default = MessengerChannelTransformer;
//# sourceMappingURL=Transformer.js.map