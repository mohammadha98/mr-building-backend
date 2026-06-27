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
exports.WsServerService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const Transformer_1 = require("../chat-real-estate/app/Transformer");
const Statuses_1 = require("../../../commons/contracts/Statuses");
const ClientRoles_1 = require("../../../commons/contracts/ClientRoles");
const Transformer_2 = require("../messenger/app/Transformer");
const messenger_channels_service_1 = require("../messenger_channels/app/messenger-channels.service");
const messenger_groups_service_1 = require("../messenger_groups/app/messenger-groups.service");
const Transformer_3 = require("../messenger_channels/app/Transformer");
const Transformer_4 = require("../messenger_groups/app/Transformer");
const messenger_service_1 = require("../messenger/app/messenger.service");
const FcmNotificationService_1 = require("../../services/notifications/fcm/FcmNotificationService");
const notifications_service_1 = require("../notifications/app/notifications.service");
const UploaderSources_1 = require("../../../commons/contracts/UploaderSources");
const UploadService_1 = require("../../services/UploadService");
const save_message_service_1 = require("../messenger-save-message/app/save-message.service");
const real_estate_agents_advisors_service_1 = require("../real-estate-agents-advisors/app/real-estate-agents-advisors.service");
const MarketplaceMessenger_factory_1 = require("../marketplace-messenger/app/factory/MarketplaceMessenger-factory");
let WsServerService = class WsServerService {
    constructor(cacheManager, prismaService, chatRealEstetMessageTransformer, messengerService, messengerTransformer, messengerChannelsService, messengerGroupsService, messengerChannelTransformer, messengerGroupTransformer, notificationsService, fcmNotificationService, saveMessageService, uploadService, advisorsService, marketplaceMessengerFactory) {
        this.cacheManager = cacheManager;
        this.prismaService = prismaService;
        this.chatRealEstetMessageTransformer = chatRealEstetMessageTransformer;
        this.messengerService = messengerService;
        this.messengerTransformer = messengerTransformer;
        this.messengerChannelsService = messengerChannelsService;
        this.messengerGroupsService = messengerGroupsService;
        this.messengerChannelTransformer = messengerChannelTransformer;
        this.messengerGroupTransformer = messengerGroupTransformer;
        this.notificationsService = notificationsService;
        this.fcmNotificationService = fcmNotificationService;
        this.saveMessageService = saveMessageService;
        this.uploadService = uploadService;
        this.advisorsService = advisorsService;
        this.marketplaceMessengerFactory = marketplaceMessengerFactory;
        this.cacheManager.reset();
    }
    async getClientWithID(client_id) {
        return await this.prismaService.client.findUnique({
            where: { id: Number(client_id) },
            select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                key: true,
                token: true,
                roles: true,
                avatar: true,
                status: true,
                province: true,
                city: true,
                notification_tokens: true,
            },
        });
    }
    async getClientWithPhone(phone) {
        return await this.prismaService.client.findUnique({
            where: { phone },
            select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                key: true,
                token: true,
                roles: true,
                avatar: true,
                status: true,
                province: true,
                city: true,
                notification_tokens: true,
            },
        });
    }
    async connectUser(clientInfo, socketId) {
        clientInfo.socket_id = socketId;
        clientInfo.online = true;
        clientInfo.last_online_time = new Date(Date.now());
        await this.cacheManager.set(clientInfo.phone, clientInfo);
    }
    async disconnectUser(clientInfo) {
        try {
            clientInfo.socket_id = clientInfo.key;
            clientInfo.online = false;
            clientInfo.last_online_time = new Date(Date.now());
            await this.cacheManager.set(clientInfo.phone, clientInfo);
            return;
        }
        catch (error) {
            return false;
        }
    }
    async sendMessageInRealEstateAgentSection(body) {
        try {
            const clientInfo = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (clientInfo.roles.includes(ClientRoles_1.default.admin) &&
                body.chat_type === ClientRoles_1.default.estate_agent) {
                const adminInfo = await this.prismaService.realEstateAgentAdmins.findFirst({
                    where: { client_id: clientInfo.id },
                    select: {
                        real_estate_agent: {
                            select: { client: { select: { id: true } } },
                        },
                    },
                });
                body.client_id = adminInfo.real_estate_agent.client.id;
            }
            console.log({ body });
            const destinationClient = (await this.getClientFromDB(body.destination_phone));
            let destinationList = [destinationClient.key];
            const sourceClient = (await this.getClientFromDB(body.source_phone));
            let sourceList = [sourceClient.key];
            if (destinationClient.roles.includes(ClientRoles_1.default.estate_agent)) {
                const adminList = await this.prismaService.realEstateAgents.findFirst({
                    where: { client_id: destinationClient.id },
                    select: {
                        real_estate_agent_admins: {
                            select: { client: { select: { key: true } } },
                        },
                    },
                });
                console.log("*** destination Socket List ***");
                console.log(destinationList);
                const adminKeys = adminList.real_estate_agent_admins.map((item) => item.client.key);
                destinationList = [...destinationList, ...adminKeys];
                console.log("*** destination Socket List ***");
                console.log(destinationList);
            }
            if (sourceClient.roles.includes(ClientRoles_1.default.estate_agent)) {
                const adminList = await this.prismaService.realEstateAgents.findFirst({
                    where: { client_id: sourceClient.id },
                    select: {
                        real_estate_agent_admins: {
                            select: { client: { select: { key: true } } },
                        },
                    },
                });
                console.log("*** Source Socket List ***");
                console.log(sourceList);
                const adminKeys = adminList.real_estate_agent_admins.map((item) => item.client.key);
                sourceList = [...sourceList, ...adminKeys];
                console.log("*** Source Socket List ***");
                console.log(sourceList);
            }
            let message = null;
            const countMessages = await this.prismaService.chatRealEstateHistoryMessages.count({
                where: { key: body.key },
            });
            if (countMessages === 0) {
                await this.prismaService.chatRealEstateHistory.updateMany({
                    where: { key: body.key },
                    data: { status: Statuses_1.default.active },
                });
            }
            body.destination_id = destinationClient.id;
            message = await this.saveMessageInChatRealEstateMessage(body);
            message.size = body.size;
            message.length = body.length;
            const chatInfoForStarter = await this.getChatInfoForStarter(body, message);
            const chatInfoForParticipant = await this.getChatInfoForParticipant(body, message, destinationClient.id);
            console.log("*** message_side ***");
            console.log(message.message_side);
            return {
                chatInfoForStarter,
                chatInfoForParticipant,
                sourceList,
                destinationList,
            };
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async sendMessageInMarketplaceChat(body) {
        try {
            return await this.marketplaceMessengerFactory.saveMessage(body);
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async sendMessageForRealEstateChannelMembers(body, socket) {
        try {
            const members = await this.prismaService.channelRealEstateMembers.findMany({
                where: { channel_id: body.data.last_message.channel_id },
                select: { client: { select: { key: true } } },
            });
            await Promise.all(members.map(async (member) => {
                delete body.data.client_id;
                socket
                    .to(member.client.key)
                    .emit("channel_real_estate", body);
            }));
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async seenChannelRealEstate(body) {
        try {
            const memberInfo = await this.prismaService.channelRealEstateMembers.findFirst({
                where: {
                    client_id: Number(body.client_id),
                    channel_id: Number(body.channel_id),
                },
                select: {
                    number_of_read_messages: true,
                    channel: { select: { number_of_messages: true } },
                },
            });
            let number_of_read_messages = body.number_of_seen + memberInfo.number_of_read_messages;
            if (number_of_read_messages > memberInfo.channel.number_of_messages) {
                number_of_read_messages = memberInfo.channel.number_of_messages;
            }
            await this.prismaService.channelRealEstateMembers.updateMany({
                where: {
                    client_id: Number(body.client_id),
                    channel_id: Number(body.channel_id),
                },
                data: {
                    number_of_read_messages: number_of_read_messages,
                },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async seenMessage(body) {
        const destinationClient = (await this.getClientFromDB(body.destination_phone));
        if (body.source === "chat_real_estate") {
            await this.prismaService.chatRealEstateHistoryMessages.update({
                where: { id: body.message_id },
                data: { seen: true },
            });
        }
        return {
            dest_user_key: destinationClient.key,
            result: {
                source: body.source,
                key: body.key,
                message_id: body.message_id,
                seen: true,
            },
        };
    }
    async seenManyInRealEstetAgentChat(body) {
        const destinationClient = (await this.getClientFromDB(body.destination_phone));
        if (body.source === "chat_real_estate") {
            await this.prismaService.chatRealEstateHistoryMessages.updateMany({
                where: {
                    NOT: { client_id: body.client_id },
                    key: body.key,
                    seen: false,
                },
                data: { seen: true },
            });
        }
        return {
            dest_user_key: destinationClient.key,
            result: {
                source: body.source,
                key: body.key,
                message_id: body.message_id,
                seen: true,
            },
        };
    }
    async getChatInfoForStarter(body, message) {
        const chatInfoForStarter = (await this.prismaService.chatRealEstateHistory.findFirst({
            where: { key: body.key },
            select: {
                id: true,
                key: true,
                type: true,
                chat_type: true,
                starter: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        phone: true,
                        roles: true,
                        avatar: true,
                    },
                },
                participant: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        phone: true,
                        roles: true,
                        avatar: true,
                    },
                },
            },
        }));
        chatInfoForStarter.starter = await this.getRealEstateChatInfo(chatInfoForStarter.starter);
        chatInfoForStarter.participant = await this.getRealEstateChatInfo(chatInfoForStarter.participant);
        const number_of_unread_messages = await this.getNumberOfUnreadMessagesInRealEstateChatHistory(body.key, body.client_id);
        chatInfoForStarter.number_of_unread_messages = number_of_unread_messages;
        chatInfoForStarter.messages = message;
        chatInfoForStarter.source = body.source;
        chatInfoForStarter.size = body.size;
        chatInfoForStarter.length = body.length;
        const transformer = this.chatRealEstetMessageTransformer.transform(chatInfoForStarter);
        return transformer;
    }
    async getChatInfoForParticipant(body, message, client_id) {
        const chatInfoForParticipant = (await this.prismaService.chatRealEstateHistory.findFirst({
            where: { key: body.key, NOT: { client_id: body.client_id } },
            select: {
                id: true,
                key: true,
                type: true,
                chat_type: true,
                starter: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        phone: true,
                        roles: true,
                        avatar: true,
                    },
                },
                participant: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        phone: true,
                        roles: true,
                        avatar: true,
                    },
                },
            },
        }));
        chatInfoForParticipant.starter = await this.getRealEstateChatInfo(chatInfoForParticipant.starter);
        chatInfoForParticipant.participant = await this.getRealEstateChatInfo(chatInfoForParticipant.participant);
        const number_of_unread_messages = await this.getNumberOfUnreadMessagesInRealEstateChatHistory(body.key, client_id);
        chatInfoForParticipant.number_of_unread_messages =
            number_of_unread_messages;
        chatInfoForParticipant.messages = message;
        chatInfoForParticipant.source = body.source;
        chatInfoForParticipant.size = body.size;
        chatInfoForParticipant.length = body.length;
        const transformer = this.chatRealEstetMessageTransformer.transform(chatInfoForParticipant);
        return transformer;
    }
    async getNumberOfUnreadMessagesInRealEstateChatHistory(key, client_id) {
        const count = await this.prismaService.chatRealEstateHistoryMessages.count({
            where: {
                NOT: { client_id },
                key,
                seen: false,
            },
        });
        return count;
    }
    async saveMessageInChatRealEstateMessage(body) {
        try {
            const message = (await this.prismaService.chatRealEstateHistoryMessages.create({
                data: {
                    key: body.key,
                    client_id: body.client_id,
                    message_side: body.message_side,
                    destination_id: Number(body.destination_id),
                    type: body.type,
                    content: body.content,
                    size: body.size,
                    length: body.length,
                    thumbnail: body.thumbnail,
                },
                select: {
                    id: true,
                    client_id: true,
                    type: true,
                    message_side: true,
                    content: true,
                    caption: true,
                    created_at: true,
                    key: true,
                    seen: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                },
            }));
            message.source = body.source;
            await this.prismaService.chatRealEstateHistory.updateMany({
                where: { key: body.key },
                data: { last_message_time: new Date(Date.now()) },
            });
            return message;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async getClientFromDB(phone) {
        try {
            let client_info = (await this.cacheManager.get(phone));
            if (!client_info) {
                client_info = (await this.getClientWithPhone(phone));
                client_info.socket_id = client_info.key;
                client_info.online = false;
                client_info.notification_tokens = client_info.notification_tokens;
                await this.cacheManager.set(phone, client_info);
            }
            return client_info;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getRealEstateChatInfo(client) {
        try {
            if (client.roles.includes(ClientRoles_1.default.estate_agent)) {
                const info = (await this.prismaService.realEstateAgents.findFirst({
                    where: { client_id: client.id },
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        client: { select: { phone: true } },
                    },
                }));
                client = {
                    id: client.id,
                    name: info.name,
                    avatar: info.avatar,
                    phone: client.phone,
                };
            }
            else {
                client = client;
                client.name =
                    client && client.surname
                        ? client.name + " " + client.surname
                        : client.name;
            }
            return client;
        }
        catch (error) {
            return false;
        }
    }
    async sendMessageInMessenger(body) {
        try {
            const sourceClient = (await this.getClientFromDB(body.source_phone));
            body.source_key = sourceClient.key;
            const destinationClient = (await this.getClientFromDB(body.destination_phone));
            body.destination_id = destinationClient.id;
            body.destination_key = destinationClient.key;
            const totalMessage = await this.prismaService.chatMessengerMessages.count({
                where: { chat_key: body.key },
            });
            if (totalMessage === 0) {
                await this.prismaService.chatMessengerHistory.updateMany({
                    where: { key: body.key },
                    data: { status: Statuses_1.default.active },
                });
            }
            const message = await this.saveMessageInMessenger(body);
            return await this.getChatInfoForStarterInMessenger(body, message);
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async sendMessageInSaveMessage(body) {
        try {
            return await this.saveMessageService.saveNewMessage(body);
        }
        catch (error) {
            return false;
        }
    }
    async saveMessageInMessenger(body) {
        try {
            let message;
            if (body.is_edited && body.message_id) {
                message = await this.prismaService.chatMessengerMessages.update({
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
                        forward_from_channel: {
                            select: {
                                id: true,
                                key: true,
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
            }
            else {
                let data = {
                    is_blocked: body.is_blocked,
                    chat_key: body.key,
                    action_type: body.action_type,
                    is_replied: body.is_reply,
                    client: { connect: { id: Number(body.client_id) } },
                    destination_id: Number(body.destination_id),
                    type: body.type,
                    content: body.content,
                    caption: body.caption,
                    size: body.size,
                    length: body.length,
                    thumbnail: body.thumbnail,
                };
                if (body.is_reply && body.action_type === "reply") {
                    data.reply_to = { connect: { id: +body.reply_to } };
                }
                message = await this.prismaService.chatMessengerMessages.create({
                    data,
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
                        forward_from_channel: {
                            select: {
                                id: true,
                                key: true,
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
                });
            }
            await this.prismaService.chatMessengerHistory.updateMany({
                where: { key: body.key },
                data: { last_message_time: new Date(Date.now()) },
            });
            return message;
        }
        catch (error) {
            console.log("****** Error In Save Message In Messenger ******");
            console.log(error);
        }
    }
    async forwardMessageInChat(body) {
        try {
            body.destination_id = body.destination_id;
            return await this.forwardMessageIntoPrivateChat(body);
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async forwardMessageIntoPrivateChat(data) {
        try {
            let messages = data.messages;
            for (let index = 0; index < data.messages.length; index++) {
                const body = data.messages[index];
                if (body.type !== "text") {
                    body.content = await this.copyFileForForward(body.content, data.key, UploaderSources_1.default.messenger);
                }
                let createData = {
                    is_forwarded: body.is_forwarded,
                    forward_message_id: body.forward_message_id,
                    action_type: body.action_type,
                    forward_from: body.forward_from,
                    chat_key: data.key,
                    client_id: Number(data.client_id),
                    destination_id: Number(data.destination_id),
                    type: body.type,
                    content: body.content,
                    caption: body.caption,
                    size: body.size,
                    length: body.length,
                    thumbnail: body.thumbnail,
                };
                let forward_from_client = null;
                if (body.forward_from === "user") {
                    createData.forward_from_client_id = body.forward_from_id;
                    const clientInfo = await this.getClientWithID(body.forward_from_id);
                    if (clientInfo) {
                        forward_from_client = {
                            id: clientInfo.id,
                            key: "",
                            title: clientInfo.name + " " + clientInfo.surname,
                            avatar: clientInfo.avatar,
                        };
                    }
                }
                else if (body.forward_from === "channel") {
                    createData.forward_from_channel_id = body.forward_from_id;
                }
                console.log({ createData });
                let newMessage = (await this.prismaService.chatMessengerMessages.create({
                    data: createData,
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
                newMessage.forward_from_client = forward_from_client;
                const transformer = this.messengerTransformer.messageTransformer(newMessage);
                transformer.private_id = body.private_id;
                transformer.is_blocked = body.chat_blocking_status;
                messages[index] = transformer;
            }
            await this.prismaService.chatMessengerHistory.updateMany({
                where: { key: data.key },
                data: { last_message_time: new Date(Date.now()) },
            });
            const chatInfo = (await this.prismaService.chatMessengerHistory.findFirst({
                where: {
                    key: data.key,
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
            }));
            const transform = this.messengerTransformer.transform(chatInfo);
            transform.messages = messages;
            return transform;
        }
        catch (error) {
            console.log("****** Error In Forward Message in : Private Chat ******");
            console.log(error);
        }
    }
    async getChatInfoForStarterInForwardMessages(body, message) {
        const chatInfoForStarter = (await this.prismaService.chatMessengerHistory.findFirst({
            where: {
                key: body.key,
                client_id: body.client_id,
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
        }));
        const number_of_unread_messages = await this.getNumberOfUnreadMessagesInMessengerHistory(body.key, body.client_id);
        chatInfoForStarter.number_of_unread_messages = number_of_unread_messages;
        chatInfoForStarter.messages = message;
        chatInfoForStarter.size = message.size;
        chatInfoForStarter.length = message.length;
        return this.messengerTransformer.transform(chatInfoForStarter);
    }
    async forwardMessageIntoSaveMessage(body) {
        try {
            return await this.saveMessageService.forwardMessage(body);
        }
        catch (error) {
            console.log("****** Error In Forward Message in : Save Message ******");
            console.log(error);
        }
    }
    async getChatInfoForStarterInMessenger(body, message) {
        const chatInfoForStarter = (await this.prismaService.chatMessengerHistory.findFirst({
            where: {
                key: body.key,
                client_id: body.client_id,
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
        }));
        const number_of_unread_messages = await this.getNumberOfUnreadMessagesInMessengerHistory(body.key, body.client_id);
        console.log("Starter number_of_unread_messages ", number_of_unread_messages);
        chatInfoForStarter.number_of_unread_messages = number_of_unread_messages;
        chatInfoForStarter.messages = message;
        chatInfoForStarter.size = body.size;
        chatInfoForStarter.length = body.length;
        return this.messengerTransformer.transform(chatInfoForStarter);
    }
    async getNumberOfUnreadMessagesInMessengerHistory(chat_key, client_id) {
        const count = await this.prismaService.chatMessengerMessages.count({
            where: {
                destination_id: client_id,
                chat_key,
                seen: false,
            },
        });
        return count;
    }
    async seenMessenger(body) {
        try {
            const destinationClient = (await this.getClientFromDB(body.destination_phone));
            body.destination_key = destinationClient.key;
            await this.prismaService.chatMessengerMessages.updateMany({
                where: {
                    OR: body.message_ids.map((id) => ({
                        id: id,
                        chat_key: body.chat_key,
                        NOT: { client_id: body.client_id },
                    })),
                },
                data: { seen: true },
            });
            return body;
        }
        catch (e) {
            console.log("Error: seenMessenger");
            console.log(e);
        }
    }
    async seenChannelMessenger(body) {
        const userChannel = await this.prismaService.messengerChannlesMembers.findFirst({
            where: {
                client_id: body.client_id,
                channel_id: body.item_id,
            },
        });
        await this.prismaService.messengerChannlesMembers.update({
            where: {
                id: body.item_id,
            },
            data: {
                number_of_read_messages: userChannel.number_of_read_messages + body.number_of_read_messages,
            },
        });
        return {
            result: {
                key: body.key,
                seen: true,
            },
        };
    }
    async seenGroupMessenger(body) {
        const userGroup = await this.prismaService.messengerGroupsMembers.findFirst({
            where: {
                client_id: body.client_id,
                group_id: body.item_id,
            },
        });
        await this.prismaService.messengerGroupsMembers.update({
            where: {
                id: body.item_id,
            },
            data: {
                number_of_read_messages: userGroup.number_of_read_messages + body.number_of_read_messages,
            },
        });
        return {
            result: {
                key: body.key,
                seen: true,
            },
        };
    }
    async deleteChannelMessenger(body) {
        const result = await this.messengerChannelsService.deleteChannel(body);
        console.log({ result });
        const membersNotificationToken = [];
        await Promise.all(result.map(async (member) => {
            const clientInfo = await this.notificationsService.getClientNotificationToken(member.client_id);
            const clientTokens = clientInfo.map((item) => item);
            membersNotificationToken.push(...clientTokens);
        }));
        console.log("membersNotificationToken");
        console.log(membersNotificationToken);
        return result;
    }
    async getClientNotificationToken(clientId) {
        return await this.notificationsService.getClientNotificationToken(clientId);
    }
    async deleteGroupMessenger(body) {
        const result = await this.messengerGroupsService.deleteGroup(body);
        const membersNotificationToken = [];
        await Promise.all(result.map(async (member) => {
            const clientInfo = await this.notificationsService.getClientNotificationToken(member.client_id);
            const clientTokens = clientInfo.map((item) => item);
            membersNotificationToken.push(...clientTokens);
        }));
        return membersNotificationToken;
    }
    async sendMessageInGroupMessenger(body) {
        const newMessege = await this.messengerGroupsService.saveNewMessage(body, body.client_id);
        return this.messengerGroupTransformer.transform(newMessege, body.client_id);
    }
    async forwardMessageIntoGroup(body) {
        return await this.messengerGroupsService.forwardMessage(body);
    }
    async sendMessageInChannelMessenger(body) {
        const newMessage = await this.messengerChannelsService.saveNewMessage(body, body.client_id);
        const transformer = this.messengerChannelTransformer.transform(newMessage, body.client_id);
        transformer.source = "channel_messenger";
        return transformer;
    }
    async copyFileForForward(content, key, enumSource) {
        const sourcePath = content.split("/").slice(4).join("/");
        const destinationPath = `uploader/${enumSource}/${key}`;
        const filename = content.split("/").slice(4)[3];
        console.log({ filename });
        return await this.uploadService.copyFile(sourcePath, destinationPath, filename);
    }
    async forwardMessageToChannel(body) {
        return await this.messengerChannelsService.forwardedMessageHanlder(body);
    }
    async addMembersInGroupMessenger(body) {
        const validationChannel = await this.messengerGroupsService.findOneByID(body.group_info.id);
        if (validationChannel) {
            const result = await this.messengerGroupsService.addMembers(body.members, body.group_info.id);
            let membersNotificationToken = [];
            await Promise.all(body.members.map(async (member) => {
                const clientTokens = await this.notificationsService.getClientNotificationToken(member.client_id);
                membersNotificationToken = [
                    ...membersNotificationToken,
                    ...clientTokens,
                ];
            }));
            return {
                member_count: result.member_count,
                member_ids: result.member_ids,
                notification_tokens: membersNotificationToken,
            };
        }
        return {};
    }
    async addMembersInChannelMessenger(body) {
        const validationChannel = await this.messengerChannelsService.findOneByID(body.channel_info.id);
        if (validationChannel) {
            const result = await this.messengerChannelsService.addMembers(body.members, body.channel_info.id);
            let membersNotificationToken = [];
            await Promise.all(body.members.map(async (member) => {
                const clientTokens = await this.notificationsService.getClientNotificationToken(member.client_id);
                membersNotificationToken = [
                    ...membersNotificationToken,
                    ...clientTokens,
                ];
            }));
            console.log("membersNotificationToken");
            console.log(membersNotificationToken);
            return {
                member_count: result.member_count,
                notification_tokens: membersNotificationToken,
            };
        }
        return {};
    }
    async joinedGroupMessenger(body) {
        const result = await this.messengerGroupsService.joinGroup({
            client_id: body.client_id,
            group_id: body.item_id,
        });
        const membersNotificationToken = [];
        const clientInfo = await this.notificationsService.getClientNotificationToken(body.client_id);
        const clientTokens = clientInfo.map((item) => item);
        membersNotificationToken.push(...clientTokens);
        console.log("memeber NotificationTokens");
        console.log(membersNotificationToken);
        return result;
    }
    async joinedChannelMessenger(body) {
        const result = await this.messengerChannelsService.joinChannel({
            client_id: body.client_id,
            channel_id: body.item_id,
        });
        const membersNotificationToken = [];
        const clientInfo = await this.notificationsService.getClientNotificationToken(body.client_id);
        const clientTokens = clientInfo.map((item) => item);
        membersNotificationToken.push(...clientTokens);
        console.log("memeber NotificationTokens");
        console.log(membersNotificationToken);
        return { status: result.status, member_count: result.member_count };
    }
    async LeftMessenger(body) {
        let result;
        if (body.source_type === "group") {
            result = await this.messengerGroupsService.leaveGroup(body);
        }
        else {
            result = await this.messengerChannelsService.leaveChannel(body);
        }
        const membersNotificationToken = [];
        const clientInfo = await this.notificationsService.getClientNotificationToken(body.client_id);
        const clientTokens = clientInfo.map((item) => item);
        membersNotificationToken.push(...clientTokens);
        console.log("NotificationTokens");
        console.log(membersNotificationToken);
        return result;
    }
    async joinIntoPrivateRoom(body) {
        return await this.getClientWithID(body.client_id);
    }
    async joinToPrivateChat(body) {
        const chatList = await this.messengerService.getChatKeys(body.client_id);
        return chatList;
    }
    async joinTheChannels(body) {
        const channelsKey = await this.messengerChannelsService.getChannelsKey(body.client_id);
        return channelsKey;
    }
    async joinInSaveMessage(body) {
        return await this.saveMessageService.getSaveMessage(body.client_id);
    }
    async joinTheGroups(body) {
        return await this.messengerGroupsService.getGroupsKey(body.client_id);
    }
    async joinTheRealEstateAgentRoom(body) {
        return await this.prismaService.realEstateAgents.findFirst({
            where: {
                client_id: body.client_id,
            },
        });
    }
    async getStorefrontInfo(body) {
        return await this.prismaService.storefront.findFirst({
            where: {
                client_id: body.client_id,
            },
        });
    }
    async getMarketplaceChatList(body) {
        return this.prismaService.marketplaceMessengerHistory.findMany({
            where: {
                OR: [
                    {
                        type: "starter",
                        starter_id: body.client_id,
                    },
                    {
                        type: "participant",
                        participant_id: body.client_id,
                    },
                ],
            },
        });
    }
    async blockUser(body) {
        const participantInfo = await this.getClientWithID(body.destination_id);
        await this.messengerService.blockUser(body.source_id, body.destination_id);
        return { participantKey: participantInfo.key, source_key: body.source_key };
    }
    async unblockUser(body) {
        const participantInfo = await this.getClientWithID(body.destination_id);
        await this.messengerService.unblockUser(body.source_id, body.destination_id);
        return { participantKey: participantInfo.key, source_key: body.source_key };
    }
    async deleteMessageInChat(body) {
        try {
            const Client = await this.getClientFromDB(body.destination_phone);
            const result = await this.messengerService.deleteMessageInChat({
                isOnline: Client.online,
                client_id: Client.id,
                message_ids: body.item_ids,
                type: body.type,
                room: body.room,
            });
            const transformer = this.messengerTransformer.messageTransformer(result.last_message);
            return {
                transformer,
                deleted_messages: result.deleted_messages,
            };
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteMessageInMarketplaceChat(body) {
        try {
            const Client = await this.getClientFromDB(body.destination_phone);
            const result = await this.marketplaceMessengerFactory.deleteMessage({
                isOnline: Client.online,
                client_id: Client.id,
                message_ids: body.item_ids,
                type: body.type,
                room: body.room,
            });
            return {
                transformer: result.last_message,
                deleted_messages: result.deleted_messages,
            };
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async seenMessagesInMarketplaceChat(body) {
        return await this.marketplaceMessengerFactory.seenMessages(body);
    }
    async deleteMessageInChannelMessenger(body) {
        try {
            const result = await this.messengerChannelsService.deleteMessage(body.item_ids, body.type, body.room);
            console.log({ result });
            if (result) {
                let transformer = null;
                if (result.last_message) {
                    transformer = this.messengerChannelTransformer.messageTransformer(result.last_message);
                }
                return {
                    transformer,
                    deleted_messages: result.deleted_messages,
                };
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteMessageInGroupMessenger(body) {
        try {
            const result = await this.messengerGroupsService.deleteMessage(body.item_ids, body.type, body.room);
            console.log({ result });
            if (result) {
                let transformer = null;
                if (result.last_message) {
                    transformer = this.messengerGroupTransformer.messageTransformer(result.last_message);
                }
                return {
                    transformer,
                    deleted_messages: result.deleted_messages,
                };
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteMessageInSaveMessage(body) {
        try {
            return await this.saveMessageService.deleteMessage({
                room: body.room,
                message_ids: body.item_ids,
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async ChangeMemberRoleToAdminChannel(body) {
        return await this.messengerChannelsService.ChangeMemberRoleToAdminChannel(body);
    }
    async ChangeMemberRoleToAdminGroup(body) {
        return await this.messengerGroupsService.ChangeMemberRoleToAdminGroup(body);
    }
    async leaveAdvisorRoleInRealEstate(body) {
        try {
            return await this.advisorsService.removeAdvisorInRealEstate(body);
        }
        catch (error) {
            return false;
        }
    }
    async changeStatusForNotificationAlert(body) {
        try {
            let result = false;
            if (body.target === "channel_messenger") {
                result =
                    await this.messengerChannelsService.changeStatusForNotificationAlert(body);
            }
            return result;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
};
WsServerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default,
        messenger_service_1.MessengerService,
        Transformer_2.default,
        messenger_channels_service_1.MessengerChannelsService,
        messenger_groups_service_1.MessengerGroupsService,
        Transformer_3.default,
        Transformer_4.default,
        notifications_service_1.NotificationsService,
        FcmNotificationService_1.default,
        save_message_service_1.MessengerSaveMessageService,
        UploadService_1.default,
        real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService,
        MarketplaceMessenger_factory_1.MarketplaceMessengerFactory])
], WsServerService);
exports.WsServerService = WsServerService;
//# sourceMappingURL=ws-server.service.js.map