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
exports.MessengerChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const crypto_1 = require("crypto");
const UploadService_1 = require("../../../services/UploadService");
const MessengerChannelTypes_1 = require("../../../../commons/contracts/MessengerChannelTypes");
const UploaderSources_1 = require("../../../../commons/contracts/UploaderSources");
const Transformer_1 = require("./Transformer");
let MessengerChannelsService = class MessengerChannelsService {
    constructor(prismaService, uploadService, messengerChannelTransformer) {
        this.prismaService = prismaService;
        this.uploadService = uploadService;
        this.messengerChannelTransformer = messengerChannelTransformer;
    }
    async createChannel(body) {
        try {
            console.log("*** CreateChannel: Messenger ***");
            let key = "";
            let username = "";
            let result;
            let isExistChannel = null;
            if (!body.tag) {
                body.tag = "normal";
            }
            console.log(body.tag);
            if (body.channel_id) {
                isExistChannel = await this.prismaService.messengerChannels.findFirst({
                    where: {
                        id: Number(body.channel_id),
                    },
                    select: {
                        id: true,
                        key: true,
                        title: true,
                        description: true,
                        avatar: true,
                        request: true,
                        verified_channel: true,
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
                            where: { client_id: Number(body.client_id) },
                            select: {
                                number_of_read_messages: true,
                                role: true,
                                permissions: true,
                                member_is_muted: true,
                            },
                            take: 1,
                        },
                    },
                });
            }
            if (isExistChannel) {
                result = await this.prismaService.messengerChannels.update({
                    where: {
                        id: Number(body.channel_id),
                    },
                    data: {
                        key: isExistChannel.key,
                        username: isExistChannel.username,
                        title: body.title,
                        description: body.description,
                        type: body.type,
                        avatar: body.avatar ? body.avatar : isExistChannel.avatar,
                    },
                    select: {
                        id: true,
                        key: true,
                        title: true,
                        description: true,
                        avatar: true,
                        request: true,
                        verified_channel: true,
                        type: true,
                        tag: true,
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
                                caption: true,
                                owner_id: true,
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
                            where: { client_id: Number(body.client_id) },
                            select: {
                                number_of_read_messages: true,
                                role: true,
                                permissions: true,
                                member_is_muted: true,
                            },
                            take: 1,
                        },
                    },
                });
                key = isExistChannel.key;
                username = isExistChannel.username;
            }
            else {
                key = await this.generateKey();
                username = await this.generatePrivateUsername();
                result = await this.prismaService.messengerChannels.create({
                    data: {
                        owner: { connect: { id: Number(body.client_id) } },
                        key,
                        username,
                        title: body.title,
                        description: body.description,
                        type: body.type,
                        tag: body.tag,
                        avatar: body.avatar ? body.avatar : "",
                    },
                    select: {
                        id: true,
                        key: true,
                        title: true,
                        description: true,
                        avatar: true,
                        tag: true,
                        request: true,
                        verified_channel: true,
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
                                caption: true,
                                owner_id: true,
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
                            where: { client_id: Number(body.client_id) },
                            select: {
                                number_of_read_messages: true,
                                role: true,
                                permissions: true,
                                member_is_muted: true,
                            },
                            take: 1,
                        },
                    },
                });
            }
            result.messages = [];
            if (body.avatar) {
                await this.uploadService.moveFile(body.avatar, "temp/files", `messenger/channels/${key}/avatar`);
            }
            const member_count = await this.countChannelMembers(result.id);
            result.member_count = member_count + 1;
            return {
                status: 200,
                result: Object.assign(Object.assign({}, result), { last_message: null }),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async joinChannel(body) {
        try {
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: { id: Number(body.channel_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            const isJoined = await this.prismaService.messengerChannlesMembers.findFirst({
                where: {
                    client_id: Number(body.client_id),
                    channel_id: channelInfo.id,
                },
            });
            if (!isJoined) {
                await this.prismaService.messengerChannlesMembers.create({
                    data: {
                        channel: { connect: { id: channelInfo.id } },
                        client: { connect: { id: Number(body.client_id) } },
                    },
                });
                const member_count = await this.countChannelMembers(channelInfo.id);
                return {
                    status: 201,
                    member_count,
                };
            }
            const member_count = await this.countChannelMembers(channelInfo.id);
            return {
                status: 200,
                member_count,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async changeStatusForNotificationAlert(body) {
        try {
            await this.prismaService.messengerChannlesMembers.updateMany({
                where: { channel_id: body.item_id, client_id: body.client_id },
                data: {
                    member_is_muted: body.member_is_muted,
                },
            });
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async UpdateChannelTypeDto(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: { id: Number(body.channel_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            const validateChannelLink = await this.prismaService.messengerChannels.findFirst({
                where: { username: body.link },
            });
            if (validateChannelLink &&
                validateChannelLink.id !== Number(body.channel_id)) {
                const username = await this.generatePrivateUsername();
                await this.prismaService.messengerChannels.update({
                    where: { id: Number(body.channel_id) },
                    data: {
                        type: MessengerChannelTypes_1.default.private,
                        username,
                    },
                });
            }
            else {
                await this.prismaService.messengerChannels.update({
                    where: { id: Number(body.channel_id) },
                    data: {
                        type: body.channel_type,
                        username: body.link,
                    },
                });
            }
            return {
                status: 200,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async validateChannelLink(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: { id: Number(body.channel_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            const validateChannelLink = await this.prismaService.messengerChannels.findFirst({
                where: { username: body.link },
            });
            let validateStatus = true;
            if (validateChannelLink) {
                validateStatus = false;
            }
            return {
                status: 200,
                validateStatus,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async addMembers(clients, channel_id) {
        try {
            const existMembers = await this.prismaService.messengerChannlesMembers.findMany({
                where: { channel_id },
                select: {
                    client_id: true,
                },
            });
            const existMembersIds = existMembers.map((item) => item.client_id);
            const newMemberList = clients.map((item) => item.client_id);
            const filteredMembers = newMemberList.filter((item) => !existMembersIds.includes(item));
            await this.prismaService.messengerChannlesMembers.createMany({
                skipDuplicates: true,
                data: filteredMembers.map((item) => ({
                    client_id: item,
                    channel_id,
                })),
            });
            const member_count = await this.countChannelMembers(channel_id);
            return {
                status: 200,
                member_count,
                newMemberList,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async ChangeMemberRoleToAdminChannel(body) {
        try {
            const parent_ids = body.member.parent_ids;
            await this.prismaService.messengerChannlesMembers.updateMany({
                where: {
                    client_id: body.member.client_id,
                    channel_id: body.channel_info.id,
                },
                data: {
                    creator_id: body.client_id,
                    parent_ids,
                    role: body.member.role,
                    permissions: body.member.permissions,
                },
            });
            const memberInfo = await this.prismaService.messengerChannlesMembers.findFirst({
                where: {
                    client_id: body.member.client_id,
                    channel_id: body.channel_info.id,
                },
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    creator_id: true,
                    parent_ids: true,
                    role: true,
                    permissions: true,
                    client: {
                        select: {
                            id: true,
                            key: true,
                            phone: true,
                            avatar: true,
                            name: true,
                            surname: true,
                        },
                    },
                },
            });
            return this.messengerChannelTransformer.memberTransform(memberInfo);
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async countChannelMembers(channel_id) {
        return await this.prismaService.messengerChannlesMembers.count({
            where: {
                channel_id,
            },
        });
    }
    async deleteMessage(message_ids, type, room) {
        let deleted_messages = [];
        console.log({ message_ids });
        await Promise.all(message_ids.map(async (message_id) => {
            const messageInfo = await this.prismaService.messengerChannelsMessages.findFirst({
                where: { id: message_id },
            });
            if (messageInfo) {
                await this.prismaService.messengerChannelsMessages.delete({
                    where: { id: message_id },
                });
                if (messageInfo.type !== "text") {
                    const filename = messageInfo.content.split("/").slice(7)[0];
                    this.uploadService.removeFile(filename, `uploader/${UploaderSources_1.default.messenger_channel}/${messageInfo.key}/`);
                }
                deleted_messages.push({
                    message_id,
                    type,
                    room,
                    owner_id: messageInfo.owner_id,
                });
            }
        }));
        const last_message = (await this.prismaService.messengerChannelsMessages.findFirst({
            where: {
                key: room,
            },
            select: {
                id: true,
                size: true,
                length: true,
                thumbnail: true,
                type: true,
                content: true,
                caption: true,
                owner_id: true,
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
            orderBy: { id: "desc" },
        }));
        if (last_message) {
            last_message.client_info = await this.getClientInfo(last_message.owner_id);
        }
        else {
            last_message.client_info = {
                id: 0,
                name: "",
                surname: "",
                key: "",
                phone: "",
                avatar: "",
            };
        }
        let lastMessageTime = last_message === null || last_message === void 0 ? void 0 : last_message.created_at;
        if (!lastMessageTime) {
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: {
                    key: room,
                },
            });
            lastMessageTime = channelInfo.created_at;
        }
        await this.prismaService.messengerChannels.updateMany({
            where: {
                key: room,
            },
            data: { last_message_time: lastMessageTime },
        });
        return {
            last_message,
            deleted_messages,
        };
    }
    async leaveChannel(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: { id: Number(body.item_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            await this.prismaService.messengerChannlesMembers.deleteMany({
                where: {
                    channel_id: Number(body.item_id),
                    client_id: Number(body.client_id),
                },
            });
            const member_count = await this.countChannelMembers(channelInfo.id);
            return {
                status: 201,
                member_count,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async channelInfo(body) {
        try {
            const channels = await this.prismaService.messengerChannels.findMany({
                where: {
                    username: body.username,
                },
                select: {
                    id: true,
                    key: true,
                    title: true,
                    request: true,
                    verified_channel: true,
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
                            caption: true,
                            owner_id: true,
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
                            is_replied: true,
                            reply_to: {
                                select: {
                                    id: true,
                                    action_type: true,
                                    size: true,
                                    length: true,
                                    thumbnail: true,
                                    type: true,
                                    content: true,
                                    caption: true,
                                    owner_id: true,
                                    key: true,
                                    created_at: true,
                                    channel_id: true,
                                },
                            },
                        },
                    },
                    members: {
                        where: { client_id: Number(body.client_id) },
                        select: {
                            id: true,
                            parent_ids: true,
                            member_is_muted: true,
                            number_of_read_messages: true,
                            permissions: true,
                            role: true,
                        },
                        take: 1,
                    },
                },
                orderBy: { last_message_time: "desc" },
            });
            if (!channels.length) {
                return { status: 400 };
            }
            const presentedChannelsData = await Promise.all(channels.map(async (item) => {
                let data = item;
                let message = data.messages[0];
                const client_info = await this.getClientInfo(message.owner_id);
                message.client_info = client_info;
                if (message.is_forwarded) {
                    let forward_from_client = null;
                    let forward_from_channel = null;
                    if (message.forward_from === "user") {
                        forward_from_client = {
                            id: message.forward_from_client.id,
                            name: message.forward_from_client.name,
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
                                key: "",
                                title: channelInfo.title,
                                avatar: channelInfo.avatar,
                            };
                        }
                    }
                    message.forward_from_client = forward_from_client;
                    message.forward_from_channel = forward_from_channel;
                }
                data.messages[0] = message;
                return data;
            }));
            const presentedChannels = await this.getChannelsInfo(presentedChannelsData);
            return {
                status: 200,
                is_joined: channels[0].members.length > 0 ? true : false,
                channels: presentedChannels,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async requestToOfficialChannel(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const existChannel = await this.prismaService.messengerChannels.findFirst({
                where: {
                    id: body.channel_id,
                },
            });
            if (!existChannel) {
                return { status: 400 };
            }
            const dupplicatedRequest = await this.prismaService.messengerChannelsRequestTheOfficial.findFirst({
                where: {
                    channelId: body.channel_id,
                },
            });
            if (!dupplicatedRequest) {
                await this.prismaService.messengerChannelsRequestTheOfficial.create({
                    data: {
                        ownerId: body.client_id,
                        description: body.description,
                        channel: { connect: { id: body.channel_id } },
                    },
                });
            }
            else {
                await this.prismaService.messengerChannelsRequestTheOfficial.updateMany({
                    where: {
                        channelId: body.channel_id,
                    },
                    data: {
                        description: body.description,
                        updatedAt: new Date(Date.now()),
                    },
                });
            }
            await this.prismaService.messengerChannels.updateMany({
                where: {
                    id: body.channel_id,
                },
                data: {
                    verified_channel: false,
                },
            });
            return {
                status: 201,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getMyChannels(body) {
        try {
            console.log("getMyChannels");
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channels = await this.prismaService.messengerChannels.findMany({
                where: {
                    OR: [
                        { owner_id: Number(body.client_id) },
                        { members: { some: { client_id: Number(body.client_id) } } },
                    ],
                },
                select: {
                    id: true,
                    key: true,
                    title: true,
                    verified_channel: true,
                    request: true,
                    description: true,
                    avatar: true,
                    type: true,
                    tag: true,
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
                            caption: true,
                            owner_id: true,
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
                            is_replied: true,
                            reply_to: {
                                select: {
                                    id: true,
                                    action_type: true,
                                    size: true,
                                    length: true,
                                    thumbnail: true,
                                    type: true,
                                    content: true,
                                    caption: true,
                                    owner_id: true,
                                    key: true,
                                    created_at: true,
                                    channel_id: true,
                                },
                            },
                        },
                    },
                    members: {
                        where: { client_id: Number(body.client_id) },
                        select: {
                            id: true,
                            parent_ids: true,
                            member_is_muted: true,
                            number_of_read_messages: true,
                            permissions: true,
                            role: true,
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
                                    key: channelInfo.username,
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
            return {
                status: 200,
                channels: presentedChannels,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getChannelsInfo(channels) {
        try {
            return await Promise.all(channels.map(async (item) => {
                const count = await this.prismaService.messengerChannlesMembers.count({
                    where: { channel_id: item.id },
                });
                item.member_count = count + 1;
                return item;
            }));
        }
        catch (e) {
            console.log(e);
        }
    }
    async getMessages(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const count = await this.prismaService.messengerChannelsMessages.count({
                where: {
                    channel_id: Number(body.channel_id),
                },
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            const messages = await this.prismaService.messengerChannelsMessages.findMany({
                where: { channel_id: Number(body.channel_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    size: true,
                    length: true,
                    thumbnail: true,
                    type: true,
                    content: true,
                    caption: true,
                    owner_id: true,
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
                    is_replied: true,
                    reply_to: {
                        select: {
                            id: true,
                            action_type: true,
                            size: true,
                            length: true,
                            thumbnail: true,
                            type: true,
                            content: true,
                            caption: true,
                            owner_id: true,
                            key: true,
                            created_at: true,
                            channel_id: true,
                        },
                    },
                },
            });
            const presentedMessages = await Promise.all(messages.map(async (item) => {
                let message = item;
                const client_info = await this.getClientInfo(message.owner_id);
                message.client_info = client_info;
                if (message.is_forwarded) {
                    let forward_from_client = null;
                    let forward_from_channel = null;
                    if (message.forward_from === "user") {
                        forward_from_client = {
                            id: message.forward_from_client.id,
                            name: message.forward_from_client.name,
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
                                key: channelInfo.username,
                                title: channelInfo.title,
                                avatar: channelInfo.avatar,
                            };
                        }
                    }
                    message.forward_from_client = forward_from_client;
                    message.forward_from_channel = forward_from_channel;
                }
                message = message;
                return message;
            }));
            let membership_status = false;
            const membership = await this.prismaService.messengerChannlesMembers.findFirst({
                where: {
                    channel_id: Number(body.channel_id),
                    client_id: Number(body.client_id),
                },
            });
            if (membership) {
                membership_status = true;
            }
            return {
                status: 200,
                membership_status,
                messages: presentedMessages,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getMembers(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: { id: Number(body.channel_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            const members = await this.prismaService.messengerChannlesMembers.findMany({
                where: { channel_id: Number(body.channel_id) },
                orderBy: { created_at: "desc" },
                select: {
                    id: true,
                    creator_id: true,
                    parent_ids: true,
                    role: true,
                    permissions: true,
                    client: {
                        select: {
                            id: true,
                            key: true,
                            phone: true,
                            avatar: true,
                            name: true,
                            surname: true,
                        },
                    },
                },
            });
            const ownerInfo = await this.prismaService.client.findFirst({
                where: { id: channelInfo.owner_id },
            });
            members.unshift({
                id: 1,
                creator_id: 1,
                parent_ids: [1],
                role: "owner",
                permissions: ["owner"],
                client: {
                    id: ownerInfo.id,
                    key: ownerInfo.key,
                    phone: ownerInfo.phone,
                    avatar: ownerInfo.avatar,
                    name: ownerInfo.name,
                    surname: ownerInfo.surname,
                },
            });
            return {
                status: 200,
                members,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateKey() {
        const key = "MSGCH" + (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateChannelId = await this.prismaService.messengerChannels.findFirst({
            where: { key },
        });
        if (isDuplicateChannelId) {
            await this.generateKey();
        }
        return key;
    }
    async changeStatusForChannel(owner_id, status) {
        await this.prismaService.messengerChannels.updateMany({
            where: { owner_id, tag: "real_estate" },
            data: { status },
        });
    }
    async findChannelByClientId(owner_id, clientId, tag = "normal") {
        const channelInfo = (await this.prismaService.messengerChannels.findFirst({
            where: { owner_id, tag },
            select: {
                id: true,
                key: true,
                title: true,
                verified_channel: true,
                request: true,
                description: true,
                avatar: true,
                type: true,
                tag: true,
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
                        caption: true,
                        owner_id: true,
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
                    where: { client_id: clientId },
                    select: {
                        id: true,
                        parent_ids: true,
                        member_is_muted: true,
                        number_of_read_messages: true,
                        permissions: true,
                        role: true,
                    },
                    take: 1,
                },
            },
        }));
        let message;
        if (channelInfo &&
            channelInfo.messages &&
            channelInfo.messages.length > 0) {
            message = channelInfo.messages[0];
            const client_info = await this.getClientInfo(message.owner_id);
            message.client_info = client_info;
            let forward_from_client = null;
            let forward_from_channel = null;
            if (message.is_forwarded) {
                if (message.forward_from === "user") {
                    forward_from_client = {
                        id: message.forward_from_client.id,
                        name: message.forward_from_client.name,
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
                            key: channelInfo.username,
                            title: channelInfo.title,
                            avatar: channelInfo.avatar,
                        };
                    }
                }
                message.forward_from_client = forward_from_client;
                message.forward_from_channel = forward_from_channel;
            }
            channelInfo.messages[0] = message;
        }
        else {
            channelInfo.messages = [];
        }
        return this.messengerChannelTransformer.transform(channelInfo, clientId);
    }
    async generatePrivateUsername() {
        const username = "MSGCHP" + (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateUsername = await this.prismaService.messengerChannels.findFirst({
            where: { username },
        });
        if (isDuplicateUsername) {
            await this.generatePrivateUsername();
        }
        return username;
    }
    async generateUsernameForChannel(channel_id) {
        const isValidChannel = await this.prismaService.messengerChannels.findFirst({
            where: { id: Number(channel_id) },
        });
        if (!isValidChannel) {
            return { status: 400 };
        }
        const username = "CHP" + (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateUsername = await this.prismaService.messengerChannels.findFirst({
            where: { username },
        });
        if (isDuplicateUsername) {
            await this.generatePrivateUsername();
        }
        await this.prismaService.messengerChannels.update({
            where: { id: Number(channel_id) },
            data: { username },
        });
        return { username };
    }
    async findOneByID(item_id) {
        return await this.prismaService.messengerChannels.findFirst({
            where: { id: Number(item_id) },
        });
    }
    async saveNewMessage(body, client_id) {
        try {
            await this.prismaService.messengerChannels.update({
                where: { id: Number(body.channel_id) },
                data: {
                    last_message_time: new Date(Date.now()),
                },
            });
            let message;
            if (body.is_edited && body.message_id) {
                await this.prismaService.messengerChannelsMessages.update({
                    where: { id: Number(body.message_id) },
                    data: {
                        is_edited: body.is_edited,
                        content: body.content,
                        caption: body.caption,
                        type: body.type,
                        length: body.length,
                        size: body.size,
                        thumbnail: body.thumbnail,
                    },
                });
                message = await this.prismaService.messengerChannels.findFirst({
                    where: { id: body.channel_id },
                    select: {
                        id: true,
                        key: true,
                        title: true,
                        description: true,
                        avatar: true,
                        request: true,
                        verified_channel: true,
                        type: true,
                        username: true,
                        notification: true,
                        owner_id: true,
                        number_of_messages: true,
                        last_message_time: true,
                        messages: {
                            where: { id: Number(body.message_id) },
                            take: 1,
                            orderBy: { created_at: "desc" },
                            select: {
                                id: true,
                                size: true,
                                length: true,
                                thumbnail: true,
                                type: true,
                                content: true,
                                caption: true,
                                owner_id: true,
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
                            where: { client_id: Number(body.client_id) },
                            select: {
                                number_of_read_messages: true,
                                role: true,
                                permissions: true,
                                member_is_muted: true,
                            },
                            take: 1,
                        },
                    },
                });
            }
            else {
                let data = {
                    action_type: body.action_type,
                    is_replied: body.is_reply,
                    content: body.content,
                    caption: body.caption,
                    key: body.key,
                    type: body.type,
                    owner_id: client_id,
                    channel: { connect: { id: body.channel_id } },
                    length: body.length,
                    size: body.size,
                    thumbnail: body.thumbnail,
                };
                if (body.is_reply && body.action_type === "reply") {
                    data.reply_to = { connect: { id: +body.reply_to } };
                }
                await this.prismaService.messengerChannelsMessages.create({
                    data,
                });
                message = await this.prismaService.messengerChannels.findFirst({
                    where: { id: body.channel_id },
                    select: {
                        id: true,
                        key: true,
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
                                action_type: true,
                                size: true,
                                length: true,
                                thumbnail: true,
                                type: true,
                                content: true,
                                caption: true,
                                owner_id: true,
                                key: true,
                                created_at: true,
                                channel_id: true,
                                is_forwarded: true,
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
                                is_replied: true,
                                reply_to: {
                                    select: {
                                        id: true,
                                        action_type: true,
                                        size: true,
                                        length: true,
                                        thumbnail: true,
                                        type: true,
                                        content: true,
                                        caption: true,
                                        owner_id: true,
                                        key: true,
                                        created_at: true,
                                        channel_id: true,
                                    },
                                },
                            },
                        },
                        members: {
                            where: { client_id: Number(body.client_id) },
                            select: {
                                number_of_read_messages: true,
                                role: true,
                                permissions: true,
                                member_is_muted: true,
                            },
                            take: 1,
                        },
                    },
                });
            }
            const client_info = await this.getClientInfo(message.messages[0].owner_id);
            message.messages[0].client_info = client_info;
            return message;
        }
        catch (error) {
            console.log(error);
        }
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
    async copyFileForForward(content, key, enumSource) {
        const sourcePath = content.split("/").slice(4).join("/");
        const destinationPath = `uploader/${enumSource}/${key}`;
        const filename = content.split("/").slice(4)[3];
        console.log({ filename });
        return await this.uploadService.copyFile(sourcePath, destinationPath, filename);
    }
    async forwardedMessageHanlder(messageBody) {
        try {
            let messages = messageBody.messages;
            for (let index = 0; index < messageBody.messages.length; index++) {
                let message = messageBody.messages[index];
                if (message.type !== "text") {
                    message.content = await this.copyFileForForward(message.content, messageBody.key, UploaderSources_1.default.messenger_channel);
                }
                let data = {
                    is_forwarded: message.is_forwarded,
                    forward_message_id: message.forward_message_id,
                    action_type: message.action_type,
                    forward_from: message.forward_from,
                    content: message.content,
                    caption: message.caption,
                    key: messageBody.key,
                    type: message.type,
                    owner_id: messageBody.client_id,
                    channel: { connect: { id: messageBody.channel_id } },
                    length: message.length,
                    size: message.size,
                    thumbnail: message.thumbnail,
                };
                let forward_from_channel = null;
                if (message.forward_from === "user") {
                    data.forward_from_client = {
                        connect: { id: message.forward_from_id },
                    };
                }
                else if (message.forward_from === "channel") {
                    data.forward_from_channel_id = message.forward_from_id;
                    const channelInfo = await this.prismaService.messengerChannels.findFirst({
                        where: { id: message.forward_from_id },
                    });
                    if (channelInfo) {
                        forward_from_channel = {
                            id: channelInfo.id,
                            key: channelInfo.username,
                            title: channelInfo.title,
                            avatar: channelInfo.avatar,
                        };
                    }
                }
                const newMessage = (await this.prismaService.messengerChannelsMessages.create({
                    data,
                    select: {
                        id: true,
                        size: true,
                        length: true,
                        thumbnail: true,
                        type: true,
                        content: true,
                        caption: true,
                        owner_id: true,
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
                }));
                const clientInfo = await this.getClientInfo(newMessage.owner_id);
                newMessage.forward_from_channel = forward_from_channel;
                newMessage.client_info = clientInfo;
                messages[index] = newMessage;
            }
            await this.prismaService.messengerChannels.update({
                where: { id: messageBody.channel_id },
                data: {
                    last_message_time: new Date(Date.now()),
                },
            });
            let channelInfo = (await this.prismaService.messengerChannels.findFirst({
                where: { id: messageBody.channel_id },
                select: {
                    id: true,
                    key: true,
                    title: true,
                    verified_channel: true,
                    request: true,
                    description: true,
                    avatar: true,
                    type: true,
                    tag: true,
                    username: true,
                    notification: true,
                    owner_id: true,
                    number_of_messages: true,
                    last_message_time: true,
                    members: {
                        where: { client_id: Number(messageBody.client_id) },
                        select: {
                            id: true,
                            parent_ids: true,
                            member_is_muted: true,
                            number_of_read_messages: true,
                            permissions: true,
                            role: true,
                        },
                        take: 1,
                    },
                },
            }));
            channelInfo.messages = messages;
            const channelTransformer = this.messengerChannelTransformer.transform(channelInfo, messageBody.client_id);
            channelTransformer.source = "channel_messenger";
            return channelTransformer;
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteChannel(body) {
        try {
            const channelInfo = await this.prismaService.messengerChannels.findFirst({
                where: {
                    owner_id: Number(body.client_id),
                    id: Number(body.channel_id),
                    key: body.key,
                },
            });
            const members = await this.prismaService.messengerChannlesMembers.findMany({
                where: { channel_id: Number(channelInfo.id) },
                select: {
                    client_id: true,
                },
            });
            await this.prismaService.messengerChannlesMembers.deleteMany({
                where: { channel_id: Number(channelInfo.id) },
            });
            await this.prismaService.messengerChannelsMessages.deleteMany({
                where: { channel_id: Number(channelInfo.id) },
            });
            await this.prismaService.messengerChannelsRequestTheOfficial.deleteMany({
                where: {
                    channelId: body.channel_id,
                },
            });
            await this.prismaService.messengerChannels.delete({
                where: {
                    id: Number(body.channel_id),
                },
            });
            await this.uploadService.removeDir(`messenger/${channelInfo.key}`);
            return members;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getChannelsKey(client_id) {
        const channelIsJoined = await this.prismaService.messengerChannlesMembers.findMany({
            where: { client_id: Number(client_id) },
            select: { channel: { select: { key: true } } },
        });
        const channelIsOwnered = await this.prismaService.messengerChannels.findMany({
            where: { owner_id: Number(client_id) },
        });
        const ownerChannels = channelIsOwnered.map((item) => {
            return { channel: { key: item.key } };
        });
        const channelList = [...channelIsJoined, ...ownerChannels];
        return channelList;
    }
    async findMessagesByID(item_id) {
        return await this.prismaService.messengerChannelsMessages.findFirst({
            where: { id: Number(item_id) },
            select: {
                id: true,
                content: true,
                caption: true,
            },
        });
    }
    async getChannelVerified(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channels = await this.prismaService.messengerChannels.findMany({
                where: {
                    verified_channel: true,
                    OR: [
                        { owner_id: Number(body.client_id) },
                        { members: { some: { client_id: Number(body.client_id) } } },
                    ],
                },
                select: {
                    id: true,
                    key: true,
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
                            caption: true,
                            owner_id: true,
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
                            is_replied: true,
                            reply_to: {
                                select: {
                                    id: true,
                                    action_type: true,
                                    size: true,
                                    length: true,
                                    thumbnail: true,
                                    type: true,
                                    content: true,
                                    caption: true,
                                    owner_id: true,
                                    key: true,
                                    created_at: true,
                                    channel_id: true,
                                },
                            },
                        },
                    },
                    members: {
                        where: { client_id: Number(body.client_id) },
                        select: {
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
                                    key: channelInfo.username,
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
            return {
                status: 200,
                channels: presentedChannels,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
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
MessengerChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        UploadService_1.default,
        Transformer_1.default])
], MessengerChannelsService);
exports.MessengerChannelsService = MessengerChannelsService;
//# sourceMappingURL=messenger-channels.service.js.map