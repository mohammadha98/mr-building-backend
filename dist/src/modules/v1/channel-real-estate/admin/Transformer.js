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
jmoment().locale("fa").format("YYYY/M/D");
let ChannelTransformer = class ChannelTransformer {
    transform(item) {
        if (!item) {
            return null;
        }
        return Object.assign({ id: item.id, key: item.key, tag: item.tag, number_of_members: item._count.members }, this.getChannelInfo(item.real_estate_agent));
    }
    collection(items) {
        return items.map((item) => this.transform(item));
    }
    getChannelInfo(item) {
        return {
            agent_id: item.id,
            name: item.name,
            profile: item.avatar
                ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${item.avatar}`
                : "",
        };
    }
    messageTransformer(item) {
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
            created_at: (0, DateService_1.DateToPersian)(item.created_at),
        };
    }
    messageCollection(items) {
        return items.map((item) => this.messageTransformer(item));
    }
};
ChannelTransformer = __decorate([
    (0, common_1.Injectable)()
], ChannelTransformer);
exports.default = ChannelTransformer;
//# sourceMappingURL=Transformer.js.map