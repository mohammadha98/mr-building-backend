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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessengerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const crypto_1 = require("crypto");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const Transformer_1 = require("./Transformer");
const client_service_1 = require("../../client/app/client.service");
const UploadService_1 = require("../../../services/UploadService");
const UploaderSources_1 = require("../../../../commons/contracts/UploaderSources");
const cache_manager_1 = require("@nestjs/cache-manager");
const save_message_service_1 = require("../../messenger-save-message/app/save-message.service");
let MessengerService = class MessengerService {
    constructor(cacheManager, prismaService, messageTransformer, clientService, uploadService, saveMessageService) {
        this.cacheManager = cacheManager;
        this.prismaService = prismaService;
        this.messageTransformer = messageTransformer;
        this.clientService = clientService;
        this.uploadService = uploadService;
        this.saveMessageService = saveMessageService;
    }
    async storeChatRequest(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const participantInfo = await this.clientService.validateWithID(Number(body.destination_id));
            if (!participantInfo) {
                return { status: 400 };
            }
            const isDuplicateChat = await this.prismaService.chatMessengerHistory.findFirst({
                where: {
                    OR: [
                        {
                            client_id: Number(body.client_id),
                            type: "starter",
                            starter_id: Number(body.client_id),
                            participant_id: Number(participantInfo.id),
                        },
                        {
                            client_id: Number(body.client_id),
                            type: "participant",
                            starter_id: Number(participantInfo.id),
                            participant_id: Number(body.client_id),
                        },
                    ],
                },
                select: {
                    id: true,
                    key: true,
                    last_message_time: true,
                    created_at: true,
                    type: true,
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
                },
            });
            console.log("isDuplicateChat ", isDuplicateChat ? true : false);
            if (!isDuplicateChat) {
                const key = await this.generateChatKey();
                const result = await this.prismaService.chatMessengerHistory.create({
                    data: {
                        client_id: Number(body.client_id),
                        key: key,
                        type: "starter",
                        starter: {
                            connect: { id: Number(body.client_id) },
                        },
                        participant: {
                            connect: { id: Number(participantInfo.id) },
                        },
                    },
                    select: {
                        id: true,
                        key: true,
                        last_message_time: true,
                        created_at: true,
                        type: true,
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
                    },
                });
                await this.prismaService.chatMessengerHistory.create({
                    data: {
                        client_id: Number(participantInfo.id),
                        key: key,
                        type: "participant",
                        starter: {
                            connect: { id: Number(body.client_id) },
                        },
                        participant: {
                            connect: { id: Number(participantInfo.id) },
                        },
                    },
                    select: {
                        id: true,
                        key: true,
                        last_message_time: true,
                        created_at: true,
                        type: true,
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
                    },
                });
                return { status: 201, result };
            }
            return { status: 200, result: isDuplicateChat };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findMyChats(query) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(query.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const { private_messages, blocked_account_ids, blocked_participant_ids } = await this.getPrivateChats(client.id);
            return {
                status: 200,
                chatList: private_messages,
                blocked_account_ids,
                blocked_participant_ids,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getPrivateChats(client_id) {
        const chatList = await this.prismaService.chatMessengerHistory.findMany({
            where: {
                status: Statuses_1.default.active,
                OR: [
                    {
                        client_id: Number(client_id),
                        type: "starter",
                    },
                    {
                        client_id: Number(client_id),
                        type: "participant",
                    },
                ],
            },
            select: {
                id: true,
                key: true,
                last_message_time: true,
                created_at: true,
                type: true,
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
            },
            orderBy: { last_message_time: "desc" },
        });
        const private_messages = await this.presentedChatList(chatList, client_id);
        const blockedHistory = await this.prismaService.messengerBlockHistory.findMany({
            where: {
                OR: [{ clientId: client_id }, { targetId: client_id }],
            },
        });
        const sourceAccountBlocked = [];
        blockedHistory.map((item) => {
            if (client_id !== item.clientId) {
                sourceAccountBlocked.push(item.clientId);
            }
        });
        const blocked_account_ids = [];
        const blocked_participant_ids = [];
        blockedHistory.map((item) => {
            if (client_id === item.clientId) {
                blocked_account_ids.push(item.targetId);
            }
            else if (client_id !== item.clientId) {
                blocked_participant_ids.push(item.clientId);
            }
        });
        private_messages.map((chat) => {
            chat.chat_blocking_status = false;
            chat.blocked_participant = false;
            chat.blocked_by_participant = false;
            if (blocked_account_ids.includes(chat.starter.id)) {
                chat.chat_blocking_status = true;
                chat.blocked_participant = true;
                chat.blocked_by_participant = false;
            }
            if (blocked_account_ids.includes(chat.participant.id)) {
                chat.chat_blocking_status = true;
                chat.blocked_participant = true;
                chat.blocked_by_participant = false;
            }
            if (blocked_participant_ids.includes(chat.starter.id)) {
                chat.chat_blocking_status = true;
                chat.blocked_participant = false;
                chat.blocked_by_participant = true;
            }
            if (blocked_participant_ids.includes(chat.participant.id)) {
                chat.chat_blocking_status = true;
                chat.blocked_participant = false;
                chat.blocked_by_participant = true;
            }
        });
        return { private_messages, blocked_account_ids, blocked_participant_ids };
    }
    async presentedChatList(chatList, client_id) {
        return await Promise.all(chatList.map(async (item) => {
            let last_message = (await this.prismaService.chatMessengerMessages.findFirst({
                where: { chat_key: item.key },
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    reaction: true,
                    chat_key: true,
                    content: true,
                    caption: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                    created_at: true,
                    seen: true,
                    is_edited: true,
                    is_blocked: true,
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
                    is_replied: true,
                    reply_to: {
                        select: {
                            id: true,
                            reaction: true,
                            chat_key: true,
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
                    replied_by: {
                        select: {
                            id: true,
                            reaction: true,
                            chat_key: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            created_at: true,
                            seen: true,
                            is_edited: true,
                            is_replied: true,
                            have_reaction: true,
                            type: true,
                        },
                    },
                },
            }));
            if (last_message) {
                if (last_message.is_forwarded) {
                    if (last_message.forward_from === "user") {
                        const forwarderInfo = await this.prismaService.client.findFirst({
                            where: { id: last_message.forward_from_client_id },
                        });
                        const forward_from_client = {
                            id: forwarderInfo.id,
                            key: forwarderInfo.key,
                            title: forwarderInfo.name + " " + forwarderInfo.surname,
                            avatar: forwarderInfo.avatar,
                        };
                        last_message.forward_from_client = forward_from_client;
                    }
                    else {
                        last_message.forward_from_client = null;
                    }
                }
                item.messages = last_message;
            }
            else {
                console.log("my chat: lastMessage Nadare");
                item.messages = null;
            }
            const number_of_unread_messages = await this.prismaService.chatMessengerMessages.count({
                where: {
                    NOT: { client_id },
                    chat_key: item.key,
                    seen: false,
                },
            });
            item.number_of_unread_messages = number_of_unread_messages;
            return item;
        }));
    }
    async getChatKeys(client_id) {
        return await this.prismaService.chatMessengerHistory.findMany({
            where: {
                status: Statuses_1.default.active,
                OR: [
                    {
                        client_id: Number(client_id),
                        type: "starter",
                    },
                    {
                        client_id: Number(client_id),
                        type: "participant",
                    },
                ],
            },
            select: {
                id: true,
                key: true,
            },
            orderBy: { last_message_time: "desc" },
        });
    }
    async blockUser(clientId, participantId) {
        const checkDupplicatedItem = await this.prismaService.messengerBlockHistory.findFirst({
            where: {
                clientId,
                targetId: participantId,
            },
        });
        if (!checkDupplicatedItem) {
            await this.prismaService.messengerBlockHistory.create({
                data: {
                    clientId,
                    targetId: participantId,
                },
            });
        }
        return;
    }
    async deleteMessageInChat({ message_ids, type, room, isOnline, client_id, }) {
        try {
            let deleted_messages = [];
            for (let index = 0; index < message_ids.length; index++) {
                const message_id = message_ids[index];
                const messageInfo = await this.prismaService.chatMessengerMessages.findFirst({
                    where: { id: message_id },
                });
                if (messageInfo) {
                    if (type === "me") {
                        await this.prismaService.chatMessengerMessages.updateMany({
                            where: { id: message_id },
                            data: { is_deleted: true },
                        });
                    }
                    else {
                        if (!isOnline) {
                            await this.prismaService.chatMessengerMessageDeleted.create({
                                data: {
                                    client_id,
                                    message_id,
                                    chat_key: room,
                                },
                            });
                        }
                        await this.prismaService.chatMessengerMessages.delete({
                            where: { id: message_id },
                        });
                        if (messageInfo.type !== "text") {
                            const filename = messageInfo.content.split("/").slice(7)[0];
                            this.uploadService.removeFile(filename, `uploader/${UploaderSources_1.default.messenger}/${messageInfo.chat_key}/`);
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
            const last_message = await this.prismaService.chatMessengerMessages.findFirst({
                where: {
                    chat_key: room,
                },
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    reaction: true,
                    chat_key: true,
                    content: true,
                    caption: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                    created_at: true,
                    seen: true,
                    is_edited: true,
                    is_replied: true,
                    is_blocked: true,
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
                            chat_key: true,
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
                    replied_by: {
                        select: {
                            id: true,
                            reaction: true,
                            chat_key: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            created_at: true,
                            seen: true,
                            is_edited: true,
                            is_replied: true,
                            have_reaction: true,
                            type: true,
                        },
                    },
                },
            });
            if (last_message) {
                await this.prismaService.chatMessengerHistory.updateMany({
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
        catch (e) {
            console.log(e);
        }
    }
    async unblockUser(clientId, participantId) {
        await this.prismaService.messengerBlockHistory.deleteMany({
            where: {
                clientId,
                targetId: participantId,
            },
        });
    }
    async findMessages(query) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(query.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            let condition = {};
            let total = 1;
            if (query.type === get_messages_dto_1.GetMessagesTypes.pagination) {
                const count = await this.prismaService.chatMessengerMessages.count({
                    where: { chat_key: query.key },
                });
                total = this.getTotalPageNumber(Number(count), Number(query.per_page));
                const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
                condition = {
                    where: { chat_key: query.key },
                    skip: paginationValue.offset,
                    take: paginationValue.per_page,
                };
            }
            else if (query.type === get_messages_dto_1.GetMessagesTypes.before_date) {
                const count = await this.prismaService.chatMessengerMessages.count({
                    where: { chat_key: query.key, created_at: { lt: query.date } },
                });
                total = this.getTotalPageNumber(Number(count), Number(query.per_page));
                const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
                condition = {
                    where: { chat_key: query.key, created_at: { lt: query.date } },
                    skip: paginationValue.offset,
                    take: paginationValue.per_page,
                };
            }
            else if (query.type === get_messages_dto_1.GetMessagesTypes.after_date) {
                const count = await this.prismaService.chatMessengerMessages.count({
                    where: { chat_key: query.key, created_at: { gt: query.date } },
                });
                total = this.getTotalPageNumber(Number(count), Number(query.per_page));
                const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
                condition = {
                    where: { chat_key: query.key, created_at: { gt: query.date } },
                    skip: paginationValue.offset,
                    take: paginationValue.per_page,
                };
            }
            else if (query.type === get_messages_dto_1.GetMessagesTypes.unseen) {
                condition = {
                    where: {
                        chat_key: query.key,
                        seen: false,
                        NOT: { client_id: client.id },
                    },
                };
            }
            const result = await this.prismaService.chatMessengerMessages.findMany(Object.assign(Object.assign({}, condition), { orderBy: { id: "desc" }, select: {
                    id: true,
                    reaction: true,
                    chat_key: true,
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
                            chat_key: true,
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
                    replied_by: {
                        select: {
                            id: true,
                            reaction: true,
                            chat_key: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            created_at: true,
                            seen: true,
                            is_blocked: true,
                            is_edited: true,
                            is_replied: true,
                            is_forwarded: true,
                            have_reaction: true,
                            type: true,
                        },
                    },
                } }));
            const presentedMessages = await Promise.all(result.map(async (item) => {
                let message = item;
                if (message.forward_from === "user") {
                    const forwarderInfo = await this.prismaService.client.findFirst({
                        where: { id: message.forward_from_client_id },
                    });
                    const forward_from_client = {
                        id: forwarderInfo.id,
                        key: "",
                        title: forwarderInfo.name + " " + forwarderInfo.surname,
                        avatar: forwarderInfo.avatar,
                    };
                    message.forward_from_client = forward_from_client;
                }
                else {
                    message.forward_from_client = null;
                }
                return message;
            }));
            const edited = await this.prismaService.chatMessengerMessages.findMany({
                where: {
                    chat_key: query.key,
                    destination_id: client.id,
                    seen: false,
                    is_edited: true,
                },
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    reaction: true,
                    chat_key: true,
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
                    is_forwarded: true,
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
                            chat_key: true,
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
                    replied_by: {
                        select: {
                            id: true,
                            reaction: true,
                            chat_key: true,
                            content: true,
                            caption: true,
                            size: true,
                            length: true,
                            created_at: true,
                            seen: true,
                            is_blocked: true,
                            is_edited: true,
                            is_replied: true,
                            is_forwarded: true,
                            have_reaction: true,
                            type: true,
                        },
                    },
                },
            });
            const deletedResult = await this.prismaService.chatMessengerMessageDeleted.findMany({
                where: {
                    client_id: client.id,
                    chat_key: query.key,
                },
            });
            await this.prismaService.chatMessengerMessageDeleted.deleteMany({
                where: {
                    client_id: client.id,
                    chat_key: query.key,
                },
            });
            let deleted = [];
            deletedResult.map(async (item) => {
                deleted.push(item.message_id);
            });
            return {
                status: 200,
                result: presentedMessages,
                edited,
                deleted,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async AllDataInMessenger(client_id) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const getPrivateChats = await this.getPrivateChats(client_id);
            const getMessengerChannels = await this.getMessengerChannels(client_id);
            const getMessengerGroups = await this.getMessengerGroups(client_id);
            const saveMessageService = await this.saveMessageService.getSaveMessage(client_id);
            return {
                status: 200,
                saveMessageService,
                blocked_account_ids: getPrivateChats.blocked_account_ids,
                blocked_participant_ids: getPrivateChats.blocked_participant_ids,
                getPrivateChats: getPrivateChats.private_messages,
                getMessengerGroups,
                getMessengerChannels,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async sortChatsByDate(list) {
        const compareMessageTime = (a, b) => {
            const dateA = new Date(a.message_time);
            const dateB = new Date(b.message_time);
            return dateA - dateB;
        };
        const sortedData = list.sort(compareMessageTime);
        sortedData.reverse();
        return sortedData;
    }
    async getMessengerGroups(client_id) {
        const groups = await this.prismaService.messengerGroups.findMany({
            where: {
                OR: [
                    { owner_id: client_id },
                    { members: { some: { client_id: client_id } } },
                ],
            },
            select: {
                id: true,
                key: true,
                title: true,
                description: true,
                avatar: true,
                type: true,
                username: true,
                notification: true,
                owner_id: true,
                number_of_messages: true,
                last_message_time: true,
                messages: {
                    take: 1,
                    orderBy: { created_at: "desc" },
                    select: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                                avatar: true,
                                phone: true,
                            },
                        },
                        id: true,
                        size: true,
                        length: true,
                        thumbnail: true,
                        type: true,
                        content: true,
                        caption: true,
                        key: true,
                        created_at: true,
                        group_id: true,
                        is_forwarded: true,
                        action_type: true,
                        forward_from: true,
                        forward_from_client_id: true,
                        forward_message_id: true,
                        forward_from_channel_id: true,
                        forward_from_channel: {
                            select: {
                                id: true,
                                title: true,
                                key: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
                members: {
                    where: { client_id },
                    select: {
                        id: true,
                        parent_ids: true,
                        number_of_read_messages: true,
                        permissions: true,
                        role: true,
                    },
                    take: 1,
                },
            },
            orderBy: { last_message_time: "desc" },
        });
        let presentedData = await Promise.all(groups.map(async (item) => {
            let data = item;
            let message = [];
            if (data.messages.length > 0) {
                message = data.messages;
            }
            if (message.length > 0) {
                if (message[0].is_forwarded) {
                    let forward_from_client = null;
                    let forward_from_channel = null;
                    if (message[0].forward_from === "user") {
                        const clientInfo = await this.prismaService.client.findFirst({
                            where: { id: message[0].forward_from_client_id },
                        });
                        if (clientInfo) {
                            forward_from_client = {
                                id: clientInfo.id,
                                key: clientInfo.key,
                                name: clientInfo.name,
                                surname: clientInfo.surname,
                                avatar: clientInfo.avatar,
                            };
                        }
                    }
                    else if (message[0].forward_from === "channel") {
                        forward_from_channel = {
                            id: message[0].forward_from_channel.id,
                            title: message[0].forward_from_channel.title,
                            key: message[0].forward_from_channel.username,
                            avatar: message[0].forward_from_channel.avatar,
                        };
                    }
                    message[0].forward_from_client = forward_from_client;
                    message[0].forward_from_channel = forward_from_channel;
                }
            }
            data.messages = message;
            return data;
        }));
        return await this.getGroupsInfo(presentedData);
    }
    async getMessengerChannels(client_id) {
        const channels = await this.prismaService.messengerChannels.findMany({
            where: {
                OR: [
                    { owner_id: Number(client_id) },
                    { members: { some: { client_id: Number(client_id) } } },
                ],
            },
            select: {
                id: true,
                key: true,
                tag: true,
                title: true,
                verified_channel: true,
                request: true,
                description: true,
                avatar: true,
                type: true,
                username: true,
                notification: true,
                owner_id: true,
                number_of_messages: true,
                last_message_time: true,
                messages: {
                    take: 1,
                    orderBy: { created_at: "desc" },
                    select: {
                        id: true,
                        size: true,
                        length: true,
                        thumbnail: true,
                        type: true,
                        content: true,
                        owner_id: true,
                        caption: true,
                        key: true,
                        created_at: true,
                        channel_id: true,
                        is_forwarded: true,
                        action_type: true,
                        forward_from: true,
                        forward_from_client_id: true,
                        forward_message_id: true,
                        forward_from_channel_id: true,
                        forward_from_client: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                                avatar: true,
                            },
                        },
                    },
                },
                members: {
                    where: { client_id: client_id },
                    select: {
                        id: true,
                        parent_ids: true,
                        number_of_read_messages: true,
                        permissions: true,
                        role: true,
                        member_is_muted: true,
                    },
                    take: 1,
                },
            },
            orderBy: { last_message_time: "desc" },
        });
        const presentedChannelsData = await Promise.all(channels.map(async (item) => {
            let data = item;
            let message = null;
            if (data.messages.length > 0) {
                message = data.messages[0];
                const client_info = await this.getClientInfo(message.owner_id);
                message.client_info = client_info;
                let forward_from_client = null;
                let forward_from_channel = null;
                if (message.is_forwarded) {
                    if (message.forward_from === "user") {
                        forward_from_client = {
                            id: message.forward_from_client.id,
                            name: message.forward_from_client.name,
                            key: message.forward_from_client.key,
                            surname: message.forward_from_client.surname,
                            avatar: message.forward_from_client.avatar,
                        };
                    }
                    else if (message.forward_from === "channel") {
                        const channelInfo = await this.prismaService.messengerChannels.findFirst({
                            where: { id: message.forward_from_channel_id },
                        });
                        if (channelInfo) {
                            forward_from_channel = {
                                id: channelInfo.id,
                                key: channelInfo.key,
                                title: channelInfo.title,
                                avatar: channelInfo.avatar,
                            };
                        }
                    }
                    message.forward_from_client = forward_from_client;
                    message.forward_from_channel = forward_from_channel;
                }
                data.messages[0] = message;
            }
            else {
                data.messages = [];
            }
            return data;
        }));
        const presentedChannels = await this.getChannelsInfo(presentedChannelsData);
        return presentedChannels;
    }
    async getClientInfo(clientId) {
        return await this.prismaService.client.findFirst({
            where: { id: clientId },
            select: {
                id: true,
                name: true,
                surname: true,
                key: true,
                phone: true,
                avatar: true,
            },
        });
    }
    async getGroupsInfo(groups) {
        return await Promise.all(groups.map(async (item) => {
            const members = await this.prismaService.messengerGroupsMembers.findMany({
                where: { group_id: item.id },
            });
            item.member_count = members.length + 1;
            item.message_type = "group";
            const membersList = [];
            members.map((item) => membersList.push(item.client_id));
            item.member_ids = membersList;
            return item;
        }));
    }
    async getChannelsInfo(channels) {
        return await Promise.all(channels.map(async (item) => {
            const count = await this.prismaService.messengerChannlesMembers.count({
                where: { channel_id: item.id },
            });
            item.member_count = count + 1;
            item.message_type = "channel";
            return item;
        }));
    }
    async generateChatKey() {
        const key = (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateChatId = await this.prismaService.chatMessengerHistory.findFirst({
            where: { key },
        });
        if (isDuplicateChatId) {
            await this.generateChatKey();
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
MessengerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default,
        client_service_1.ClientService,
        UploadService_1.default,
        save_message_service_1.MessengerSaveMessageService])
], MessengerService);
exports.MessengerService = MessengerService;
//# sourceMappingURL=messenger.service.js.map