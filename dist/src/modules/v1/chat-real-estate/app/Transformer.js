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
let MessageTransformer = class MessageTransformer {
    transform(item) {
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
        return {
            id: item.id,
            name: item.name,
            phone: item.phone,
            avatar: item.avatar
                ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
                : "",
        };
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
            client_id: item.client_id,
            type: item.type,
            message_side: item.message_side,
            content,
            size: item.size,
            length: item.length,
            thumbnail: item.thumbnail,
            key: item.key,
            seen: item.seen,
            created_at: (0, DateService_1.DateToPersian)(item.created_at),
        };
    }
    messageCollection(items) {
        return items.map((item) => this.messageTransformer(item));
    }
};
MessageTransformer = __decorate([
    (0, common_1.Injectable)()
], MessageTransformer);
exports.default = MessageTransformer;
//# sourceMappingURL=Transformer.js.map