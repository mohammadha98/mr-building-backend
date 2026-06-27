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
exports.MessengerSaveMessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const crypto_1 = require("crypto");
const Transformer_1 = require("./Transformer");
const UploaderSources_1 = require("../../../../commons/contracts/UploaderSources");
const UploadService_1 = require("../../../services/UploadService");
let MessengerSaveMessageService = class MessengerSaveMessageService {
    constructor(prismaService, saveMessageTransformer, uploadService) {
        this.prismaService = prismaService;
        this.saveMessageTransformer = saveMessageTransformer;
        this.uploadService = uploadService;
    }
    async storeSaveMessage(client_id) {
        const key = await this.generateKey();
        return await this.prismaService.messengerSaveMessageHistory.create({
            data: {
                client_id,
                key: key,
            },
            select: {
                id: true,
                key: true,
                created_at: true,
                client_id: true,
                last_message_time: true,
                messages: {
                    take: 1,
                    orderBy: { created_at: "desc" },
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
                        is_edited: true,
                        is_replied: true,
                        have_reaction: true,
                        type: true,
                        is_forwarded: true,
                        action_type: true,
                        forward_from: true,
                        forward_from_client_id: true,
                        forward_message_id: true,
                        forward_from_channel: {
                            select: {
                                id: true,
                                key: true,
                                username: true,
                                title: true,
                                avatar: true,
                            },
                        },
                        forward_from_client: {
                            select: {
                                id: true,
                                key: true,
                                name: true,
                                surname: true,
                                avatar: true,
                                phone: true,
                            },
                        },
                        replied_by: {
                            select: {
                                id: true,
                                reaction: true,
                                key: true,
                                content: true,
                                caption: true,
                                size: true,
                                length: true,
                                created_at: true,
                                is_edited: true,
                                is_replied: true,
                                have_reaction: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async saveNewMessage(body) {
        try {
            let result;
            let saveMessage;
            if (body.is_edited && body.message_id) {
                result = await this.prismaService.messengerSaveMessageMessages.update({
                    where: { id: Number(body.message_id) },
                    data: {
                        is_edited: true,
                        type: body.type,
                        content: body.content,
                        caption: body.caption,
                        size: body.size,
                        length: body.length,
                        thumbnail: body.thumbnail,
                    },
                    select: {
                        save_message_id: true,
                    },
                });
                saveMessage =
                    await this.prismaService.messengerSaveMessageHistory.findFirst({
                        where: { id: result.save_message_id },
                        select: {
                            id: true,
                            key: true,
                            created_at: true,
                            client_id: true,
                            last_message_time: true,
                            messages: {
                                where: { id: body.message_id },
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
                                    is_edited: true,
                                    have_reaction: true,
                                    type: true,
                                    is_forwarded: true,
                                    action_type: true,
                                    forward_from: true,
                                    forward_from_client_id: true,
                                    forward_message_id: true,
                                    forward_from_channel: {
                                        select: {
                                            id: true,
                                            key: true,
                                            username: true,
                                            title: true,
                                            avatar: true,
                                        },
                                    },
                                    forward_from_client: {
                                        select: {
                                            id: true,
                                            key: true,
                                            name: true,
                                            surname: true,
                                            avatar: true,
                                            phone: true,
                                        },
                                    },
                                    is_replied: true,
                                    reply_to: {
                                        select: {
                                            id: true,
                                            reaction: true,
                                            key: true,
                                            type: true,
                                            action_type: true,
                                            content: true,
                                            caption: true,
                                            size: true,
                                            length: true,
                                            thumbnail: true,
                                            created_at: true,
                                        },
                                    },
                                    replied_by: {
                                        select: {
                                            id: true,
                                            reaction: true,
                                            key: true,
                                            content: true,
                                            caption: true,
                                            size: true,
                                            length: true,
                                            created_at: true,
                                            is_edited: true,
                                            is_replied: true,
                                            have_reaction: true,
                                            type: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
            }
            else {
                let data = {
                    key: body.key,
                    action_type: body.action_type,
                    is_replied: body.is_reply,
                    save_message_id: body.save_message_id,
                    type: body.type,
                    content: body.content,
                    caption: body.caption,
                    size: body.size,
                    length: body.length,
                    thumbnail: body.thumbnail,
                };
                if (body.is_reply && body.action_type === "reply") {
                    data.reply_to_id = +body.reply_to;
                }
                console.log({ data });
                result = await this.prismaService.messengerSaveMessageMessages.create({
                    data,
                    select: {
                        save_message_id: true,
                    },
                });
                saveMessage =
                    await this.prismaService.messengerSaveMessageHistory.findFirst({
                        where: { id: result.save_message_id },
                        select: {
                            id: true,
                            key: true,
                            created_at: true,
                            client_id: true,
                            last_message_time: true,
                            messages: {
                                orderBy: { created_at: "desc" },
                                take: 1,
                                select: {
                                    id: true,
                                    reaction: true,
                                    key: true,
                                    type: true,
                                    action_type: true,
                                    content: true,
                                    caption: true,
                                    size: true,
                                    length: true,
                                    thumbnail: true,
                                    created_at: true,
                                    is_edited: true,
                                    have_reaction: true,
                                    is_forwarded: true,
                                    forward_from: true,
                                    forward_from_client_id: true,
                                    forward_message_id: true,
                                    forward_from_channel: {
                                        select: {
                                            id: true,
                                            key: true,
                                            username: true,
                                            title: true,
                                            avatar: true,
                                        },
                                    },
                                    forward_from_client: {
                                        select: {
                                            id: true,
                                            key: true,
                                            name: true,
                                            surname: true,
                                            avatar: true,
                                            phone: true,
                                        },
                                    },
                                    is_replied: true,
                                    reply_to: {
                                        select: {
                                            id: true,
                                            reaction: true,
                                            key: true,
                                            type: true,
                                            action_type: true,
                                            content: true,
                                            caption: true,
                                            size: true,
                                            length: true,
                                            thumbnail: true,
                                            created_at: true,
                                        },
                                    },
                                    replied_by: {
                                        select: {
                                            id: true,
                                            reaction: true,
                                            key: true,
                                            content: true,
                                            caption: true,
                                            size: true,
                                            length: true,
                                            created_at: true,
                                            is_edited: true,
                                            is_replied: true,
                                            have_reaction: true,
                                            type: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
            }
            await this.prismaService.messengerSaveMessageHistory.updateMany({
                where: { key: body.key },
                data: { last_message_time: new Date(Date.now()) },
            });
            const presentedMessage = await this.prepaireMessage(saveMessage.messages[0]);
            saveMessage.messages = presentedMessage;
            return this.saveMessageTransformer.transform(saveMessage);
        }
        catch (e) {
            console.log(e);
        }
    }
    async copyFileForForward(content, key, enumSource) {
        const sourcePath = content.split("/").slice(4).join("/");
        const destinationPath = `uploader/${enumSource}/${key}`;
        const filename = content.split("/").slice(4)[3];
        console.log({ filename });
        return await this.uploadService.copyFile(sourcePath, destinationPath, filename);
    }
    async forwardMessage(messageBody) {
        let messages = messageBody.messages;
        for (let index = 0; index < messageBody.messages.length; index++) {
            let body = messageBody.messages[index];
            if (body.type !== "text") {
                body.content = await this.copyFileForForward(body.content, messageBody.key, UploaderSources_1.default.messenger_save_message);
            }
            let data = {
                is_forwarded: body.is_forwarded,
                forward_message_id: body.forward_message_id,
                action_type: body.action_type,
                forward_from: body.forward_from,
                key: messageBody.key,
                save_message_id: messageBody.save_message_id,
                type: body.type,
                content: body.content,
                caption: body.caption,
                size: body.size,
                length: body.length,
                thumbnail: body.thumbnail,
            };
            if (body.forward_from === "user") {
                data.forward_from_client_id = body.forward_from_id;
            }
            else if (body.forward_from === "channel") {
                data.forward_from_channel_id = body.forward_from_id;
            }
            let newMessage = (await this.prismaService.messengerSaveMessageMessages.create({
                data,
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
                    is_edited: true,
                    is_replied: true,
                    have_reaction: true,
                    type: true,
                    is_forwarded: true,
                    action_type: true,
                    forward_from: true,
                    forward_from_client_id: true,
                    forward_message_id: true,
                    forward_from_channel: {
                        select: {
                            id: true,
                            key: true,
                            username: true,
                            title: true,
                            avatar: true,
                        },
                    },
                    forward_from_client: {
                        select: {
                            id: true,
                            key: true,
                            name: true,
                            surname: true,
                            avatar: true,
                            phone: true,
                        },
                    },
                    replied_by: {
                        select: {
                            id: true,
                            reaction: true,
                            key: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            created_at: true,
                            is_edited: true,
                            is_replied: true,
                            have_reaction: true,
                            type: true,
                        },
                    },
                },
            }));
            const prepaireMessage = await this.prepaireMessage(newMessage);
            const transformMessage = this.saveMessageTransformer.messageTransformer(prepaireMessage);
            transformMessage.private_id = messageBody.private_id;
            messages[index] = transformMessage;
        }
        await this.prismaService.messengerSaveMessageHistory.updateMany({
            where: { id: messageBody.save_message_id },
            data: { last_message_time: new Date(Date.now()) },
        });
        let saveMessageInfo = (await this.prismaService.messengerSaveMessageHistory.findFirst({
            where: { id: messageBody.save_message_id },
        }));
        saveMessageInfo = this.saveMessageTransformer.transform(saveMessageInfo);
        saveMessageInfo.messages = messages;
        return saveMessageInfo;
    }
    async deleteMessage({ room, message_ids }) {
        let deleted_messages = [];
        await Promise.all(message_ids.map(async (message_id) => {
            const messageInfo = await this.prismaService.messengerSaveMessageMessages.findFirst({
                where: { id: message_id },
            });
            await this.prismaService.messengerSaveMessageMessages.delete({
                where: { id: message_id },
            });
            if (messageInfo.type !== "text") {
                this.uploadService.removeFile(messageInfo.content, `uploader/${UploaderSources_1.default.messenger_save_message}/${messageInfo.key}/`);
            }
            deleted_messages.push({
                message_id: message_id,
                room,
            });
        }));
        const last_message = await this.prismaService.messengerSaveMessageMessages.findFirst({
            where: { key: room },
            orderBy: { created_at: "desc" },
        });
        if (last_message) {
            await this.prismaService.messengerSaveMessageHistory.updateMany({
                where: {
                    key: room,
                },
                data: {
                    last_message_time: last_message.created_at,
                },
            });
        }
        return {
            last_message,
            deleted_messages,
        };
    }
    async getSaveMessage(client_id) {
        let saveMessage = await this.prismaService.messengerSaveMessageHistory.findFirst({
            where: { client_id },
            select: {
                id: true,
                key: true,
                created_at: true,
                client_id: true,
                last_message_time: true,
                messages: {
                    take: 1,
                    orderBy: { created_at: "desc" },
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
                        is_edited: true,
                        is_replied: true,
                        have_reaction: true,
                        type: true,
                        is_forwarded: true,
                        action_type: true,
                        forward_from: true,
                        forward_from_client_id: true,
                        forward_message_id: true,
                        forward_from_channel: {
                            select: {
                                id: true,
                                key: true,
                                username: true,
                                title: true,
                                avatar: true,
                            },
                        },
                        forward_from_client: {
                            select: {
                                id: true,
                                key: true,
                                name: true,
                                surname: true,
                                avatar: true,
                                phone: true,
                            },
                        },
                        replied_by: {
                            select: {
                                id: true,
                                reaction: true,
                                key: true,
                                content: true,
                                caption: true,
                                size: true,
                                length: true,
                                created_at: true,
                                is_edited: true,
                                is_replied: true,
                                have_reaction: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        });
        if (!saveMessage) {
            saveMessage = await this.storeSaveMessage(client_id);
        }
        const result = await this.presentedMessage(saveMessage);
        return this.saveMessageTransformer.transform(result);
    }
    async presentedMessage(saveMessage) {
        let saveMessageItem = saveMessage;
        let last_message = (await this.prismaService.messengerSaveMessageMessages.findFirst({
            where: { key: saveMessageItem.key },
            orderBy: { created_at: "desc" },
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
                is_edited: true,
                is_replied: true,
                have_reaction: true,
                type: true,
                is_forwarded: true,
                action_type: true,
                forward_from: true,
                forward_from_client_id: true,
                forward_message_id: true,
                forward_from_channel: {
                    select: {
                        id: true,
                        key: true,
                        username: true,
                        title: true,
                        avatar: true,
                    },
                },
                forward_from_client: {
                    select: {
                        id: true,
                        key: true,
                        name: true,
                        surname: true,
                        avatar: true,
                        phone: true,
                    },
                },
                replied_by: {
                    select: {
                        id: true,
                        reaction: true,
                        key: true,
                        content: true,
                        caption: true,
                        size: true,
                        length: true,
                        created_at: true,
                        is_edited: true,
                        is_replied: true,
                        have_reaction: true,
                        type: true,
                    },
                },
            },
        }));
        if (last_message) {
            last_message = await this.prepaireMessage(last_message);
        }
        else {
            saveMessage.messages = null;
        }
        saveMessageItem.messages = last_message;
        return saveMessageItem;
    }
    async prepaireMessage(last_message) {
        if (last_message.is_forwarded) {
            if (last_message.forward_from === "user") {
                const forward_from_client = {
                    id: last_message.forward_from_client.id,
                    key: last_message.forward_from_client.key,
                    title: last_message.forward_from_client.name +
                        " " +
                        last_message.forward_from_client.surname,
                    avatar: last_message.forward_from_client.avatar,
                };
                last_message.forward_from_client = forward_from_client;
                last_message.forward_from = last_message.forward_from;
            }
            else {
                let forward_from_channel = {
                    id: 0,
                    key: "",
                    title: "",
                    avatar: "",
                };
                if (last_message.forward_from_channel) {
                    forward_from_channel = {
                        id: last_message.forward_from_channel.id,
                        key: last_message.forward_from_channel.key,
                        title: last_message.forward_from_channel.title,
                        avatar: last_message.forward_from_channel.avatar,
                    };
                }
                last_message.forward_from_channel = forward_from_channel;
                last_message.forward_from = last_message.forward_from;
            }
        }
        return last_message;
    }
    async findMessages(query) {
        try {
            const { condition, total } = await this.generateQuery(query);
            const result = await this.prismaService.messengerSaveMessageMessages.findMany(Object.assign(Object.assign({}, condition), { orderBy: { created_at: "desc" }, select: {
                    id: true,
                    reaction: true,
                    key: true,
                    content: true,
                    caption: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                    created_at: true,
                    is_edited: true,
                    have_reaction: true,
                    type: true,
                    is_forwarded: true,
                    action_type: true,
                    forward_from: true,
                    forward_from_client_id: true,
                    forward_message_id: true,
                    forward_from_channel: {
                        select: {
                            id: true,
                            key: true,
                            username: true,
                            title: true,
                            avatar: true,
                        },
                    },
                    forward_from_client: {
                        select: {
                            id: true,
                            key: true,
                            name: true,
                            surname: true,
                            avatar: true,
                            phone: true,
                        },
                    },
                    is_replied: true,
                    reply_to: {
                        select: {
                            id: true,
                            reaction: true,
                            key: true,
                            type: true,
                            action_type: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            thumbnail: true,
                            created_at: true,
                        },
                    },
                    replied_by: {
                        select: {
                            id: true,
                            reaction: true,
                            key: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            created_at: true,
                            is_edited: true,
                            is_replied: true,
                            have_reaction: true,
                            type: true,
                        },
                    },
                } }));
            const presentedMessages = await Promise.all(result.map(async (item) => {
                return this.prepaireMessage(item);
            }));
            const transformer = this.saveMessageTransformer.messageCollection(presentedMessages);
            return {
                statusCode: 200,
                data: {
                    data: transformer,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                },
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async generateQuery(query) {
        let condition = {};
        let total = 1;
        if (query.type === get_messages_dto_1.GetMessagesTypes.pagination) {
            const count = await this.prismaService.messengerSaveMessageMessages.count({
                where: { key: query.key },
            });
            total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            condition = {
                where: { key: query.key },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            };
        }
        else if (query.type === get_messages_dto_1.GetMessagesTypes.before_date) {
            const count = await this.prismaService.messengerSaveMessageMessages.count({
                where: { key: query.key, created_at: { lt: query.date } },
            });
            total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            condition = {
                where: { key: query.key, created_at: { lt: query.date } },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            };
        }
        else if (query.type === get_messages_dto_1.GetMessagesTypes.after_date) {
            const count = await this.prismaService.messengerSaveMessageMessages.count({
                where: { key: query.key, created_at: { gt: query.date } },
            });
            total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            condition = {
                where: { key: query.key, created_at: { gt: query.date } },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            };
        }
        return { condition, total };
    }
    async generateKey() {
        const key = "MSG_SM_" + (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateChatId = await this.prismaService.messengerSaveMessageHistory.findFirst({
            where: { key },
        });
        if (isDuplicateChatId) {
            await this.generateKey();
        }
        return key;
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
};
MessengerSaveMessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        Transformer_1.default,
        UploadService_1.default])
], MessengerSaveMessageService);
exports.MessengerSaveMessageService = MessengerSaveMessageService;
//# sourceMappingURL=save-message.service.js.map