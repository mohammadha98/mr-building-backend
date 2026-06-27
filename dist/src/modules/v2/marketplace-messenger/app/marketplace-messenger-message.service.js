"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceMessenger_MessageSection = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const Transformer_1 = require("./Transformer");
const MessengerActionTypes_1 = require("../../ws-server/enums/MessengerActionTypes");
const process = require("process");
const UploaderSources_1 = require("../../../../commons/contracts/UploaderSources");
const UploadService_1 = require("../../../services/UploadService");
let MarketplaceMessenger_MessageSection = class MarketplaceMessenger_MessageSection {
    constructor(prismaService, messageTransformer, uploadService) {
        this.prismaService = prismaService;
        this.messageTransformer = messageTransformer;
        this.uploadService = uploadService;
        this.messageSelector = {
            id: true,
            reaction: true,
            key: true,
            content: true,
            caption: true,
            size: true,
            length: true,
            thumbnail: true,
            created_at: true,
            seen: true,
            is_blocked: true,
            is_deleted: true,
            is_edited: true,
            is_replied: true,
            action_type: true,
            have_reaction: true,
            type: true,
            client_id: true,
            client: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    avatar: true,
                    phone: true,
                },
            },
            reply_to: {
                select: {
                    id: true,
                    reaction: true,
                    key: true,
                    content: true,
                    caption: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                    created_at: true,
                    type: true,
                    action_type: true,
                    client_id: true,
                    client: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            avatar: true,
                            phone: true,
                        },
                    },
                },
            },
        };
        this.chatSelector = {
            id: true,
            key: true,
            last_message_time: true,
            created_at: true,
            type: true,
            chat_type: true,
            starter: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    phone: true,
                    avatar: true,
                },
            },
            participant: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    phone: true,
                    avatar: true,
                },
            },
        };
    }
    async getChatInfoByKey(chatKey) {
        const chatList = await this.prismaService.marketplaceMessengerHistory.findFirst({
            where: {
                key: chatKey,
            },
            select: this.chatSelector,
        });
        const result = await this.presentedChat([chatList]);
        return result[0];
    }
    async presentedChat(chatList) {
        return await Promise.all(chatList.map(async (item) => {
            let isStorefront = await this.storefrontInfoByClientId(item.starter.id);
            item.starter = (await this.starterInfo(item.starter, !!isStorefront));
            isStorefront = await this.storefrontInfoByClientId(item.participant.id);
            item.participant = (await this.starterInfo(item.participant, !!isStorefront));
            return item;
        }));
    }
    async getLastMessage(chatKey) {
        return this.prismaService.marketplaceMessages.findFirst({
            where: { key: chatKey },
            select: this.messageSelector,
            orderBy: { created_at: "desc" },
        });
    }
    async storefrontInfoByClientId(client_id) {
        return this.prismaService.storefront.findFirst({
            where: { client_id },
            select: {
                id: true,
                name: true,
                avatar: true,
                phone: true,
            },
        });
    }
    async starterInfo(client, isStorefront = false) {
        let info;
        if (isStorefront) {
            info = await this.storefrontInfoByClientId(client.id);
            info = {
                name: info.name,
                avatar: info.avatar
                    ? `${process.env.APP_CONTENT_PATH}/storefront/${info.id}/avatars/${info.avatar}`
                    : "",
                phone: info.phone,
            };
        }
        else {
            info = await this.getClientInfo(client.id);
            info = {
                name: info.name + " " + info.surname,
                avatar: info.avatar
                    ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${info.avatar}`
                    : "",
                phone: info.phone,
            };
        }
        return {
            name: info.name,
            avatar: info.avatar,
            phone: info.phone,
        };
    }
    async getClientInfo(clientId) {
        return this.prismaService.client.findFirst({
            where: { id: clientId },
        });
    }
    async getMessageInfoById(messageId) {
        return this.prismaService.marketplaceMessages.findFirst({
            where: { id: messageId },
            select: this.messageSelector,
        });
    }
    async saveMessage(body) {
        console.log("save Message In Marketplace");
        if (body.action_type === MessengerActionTypes_1.MessengerActionTypes.edit && body.is_edited) {
            await this.prismaService.marketplaceMessages.update({
                where: {
                    id: body.message_id,
                },
                data: {
                    action_type: body.action_type,
                    content: body.content,
                    is_edited: true,
                    thumbnail: body.thumbnail,
                    size: body.size,
                    length: body.length,
                    type: body.type,
                    caption: body.caption,
                },
            });
            const chatInfo = await this.getChatInfoByKey(body.key);
            const message = await this.getMessageInfoById(body.message_id);
            chatInfo.messages = message;
            return this.messageTransformer.transform(chatInfo);
        }
        else {
            const data = {
                client_id: body.client_id,
                action_type: body.action_type,
                content: body.content,
                thumbnail: body.thumbnail,
                size: body.size,
                length: body.length,
                type: body.type,
                caption: body.caption,
                key: body.key,
                is_replied: body.is_reply,
            };
            if (body.is_reply && body.action_type === "reply") {
                data.reply_to_id = +body.reply_to;
            }
            const result = await this.prismaService.marketplaceMessages.create({
                data,
            });
            const chatInfo = await this.getChatInfoByKey(body.key);
            const message = await this.getMessageInfoById(result.id);
            chatInfo.messages = message;
            return this.messageTransformer.transform(chatInfo);
        }
    }
    async deleteMessage({ message_ids, type, room, client_id, isOnline }) {
        try {
            let deleted_messages = [];
            for (let index = 0; index < message_ids.length; index++) {
                const message_id = message_ids[index];
                const messageInfo = await this.prismaService.marketplaceMessages.findFirst({
                    where: { id: message_id },
                });
                if (messageInfo) {
                    if (type === "me") {
                        await this.prismaService.marketplaceMessages.updateMany({
                            where: { id: message_id },
                            data: { is_deleted: true },
                        });
                    }
                    else {
                        if (!isOnline) {
                            await this.prismaService.marketplaceChatMessengerMessageDeleted.create({
                                data: {
                                    message_id,
                                    chat_key: room,
                                    client_id,
                                },
                            });
                        }
                        await this.prismaService.marketplaceMessages.delete({
                            where: { id: message_id },
                        });
                        if (messageInfo.type !== "text") {
                            const filename = messageInfo.content.split("/").slice(7)[0];
                            this.uploadService.removeFile(filename, `uploader/${UploaderSources_1.default.marketplace_chat}/${messageInfo.key}/`);
                        }
                    }
                    deleted_messages.push({
                        message_id: message_id,
                        type,
                        room,
                        owner_id: messageInfo.client_id,
                        seen: messageInfo.seen,
                    });
                }
            }
            const last_message = await this.prismaService.marketplaceMessages.findFirst({
                where: {
                    key: room,
                },
                orderBy: { id: "desc" },
                select: this.messageSelector,
            });
            if (last_message) {
                await this.prismaService.chatMessengerHistory.updateMany({
                    where: {
                        key: room,
                    },
                    data: {
                        last_message_time: last_message === null || last_message === void 0 ? void 0 : last_message.created_at,
                    },
                });
            }
            const transform = this.messageTransformer.messageTransformer(last_message);
            return {
                last_message: transform,
                deleted_messages,
            };
        }
        catch (e) {
            console.log(e);
        }
    }
    async seenMessages(body) {
        await this.prismaService.marketplaceMessages.updateMany({
            where: {
                OR: body.message_ids.map((id) => ({
                    id: id,
                    key: body.key,
                    NOT: { client_id: body.client_id },
                })),
            },
            data: { seen: true },
        });
    }
};
MarketplaceMessenger_MessageSection = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        Transformer_1.default,
        UploadService_1.default])
], MarketplaceMessenger_MessageSection);
exports.MarketplaceMessenger_MessageSection = MarketplaceMessenger_MessageSection;
//# sourceMappingURL=marketplace-messenger-message.service.js.map