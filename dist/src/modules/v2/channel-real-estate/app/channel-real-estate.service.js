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
exports.ChannelRealEstateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const crypto_1 = require("crypto");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const ClientRoles_1 = require("../../../../commons/contracts/ClientRoles");
const ChannelsTypes_1 = require("../../../../commons/contracts/ChannelsTypes");
let ChannelRealEstateService = class ChannelRealEstateService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createChannel(createChannelRealEstateDto) {
        try {
            console.log("*** CreateChannel: RealEstateAgent ***");
            const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                where: { id: Number(createChannelRealEstateDto.agent_id) },
            });
            if (!agentInfo) {
                return { status: 400 };
            }
            const key = await this.generateChannelKey();
            let result = await this.prismaService.channelRealEstateAgent.findFirst({
                where: {
                    agent_id: Number(createChannelRealEstateDto.agent_id),
                },
                select: {
                    id: true,
                    key: true,
                    real_estate_agent: {
                        select: { avatar: true, id: true, name: true },
                    },
                },
            });
            if (!result) {
                result = await this.prismaService.channelRealEstateAgent.create({
                    data: {
                        real_estate_agent: {
                            connect: { id: Number(createChannelRealEstateDto.agent_id) },
                        },
                        key,
                    },
                    select: {
                        id: true,
                        key: true,
                        real_estate_agent: {
                            select: { avatar: true, id: true, name: true },
                        },
                    },
                });
            }
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
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.channelRealEstateAgent.findFirst({
                where: { id: Number(body.channel_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            const isJoined = await this.prismaService.channelRealEstateMembers.findFirst({
                where: {
                    client_id: Number(body.client_id),
                    channel_id: channelInfo.id,
                },
            });
            if (!isJoined) {
                await this.prismaService.channelRealEstateMembers.create({
                    data: {
                        channel: { connect: { id: channelInfo.id } },
                        client: { connect: { id: Number(body.client_id) } },
                    },
                });
                return {
                    status: 201,
                };
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
    async leaveChannel(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.channelRealEstateAgent.findFirst({
                where: { id: Number(body.channel_id) },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            await this.prismaService.channelRealEstateMembers.deleteMany({
                where: {
                    channel_id: Number(body.channel_id),
                    client_id: Number(body.client_id),
                },
            });
            return {
                status: 200,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getMyChannels(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            let user_channel = null;
            let pinned = null;
            if (client.roles.includes(ClientRoles_1.default.estate_agent)) {
                const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                    where: { client_id: Number(body.client_id) },
                });
                user_channel =
                    await this.prismaService.channelRealEstateAgent.findFirst({
                        where: {
                            agent_id: agentInfo.id,
                        },
                        select: {
                            id: true,
                            key: true,
                            last_message_time: true,
                            real_estate_agent: {
                                select: { id: true, name: true, avatar: true, client_id: true },
                            },
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
                                    key: true,
                                    created_at: true,
                                    channel_id: true,
                                },
                            },
                            number_of_messages: true,
                            members: {
                                where: { client_id: Number(body.client_id) },
                                select: { number_of_read_messages: true },
                                take: 1,
                            },
                        },
                    });
                pinned = await this.prismaService.channelRealEstateAgent.findMany({
                    where: {
                        tag: ChannelsTypes_1.default.pinned,
                        NOT: { agent_id: agentInfo.id },
                        real_estate_agent: { status: Statuses_1.default.active },
                    },
                    select: {
                        id: true,
                        key: true,
                        last_message_time: true,
                        real_estate_agent: {
                            select: { id: true, name: true, avatar: true },
                        },
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
                                key: true,
                                created_at: true,
                                channel_id: true,
                            },
                        },
                        number_of_messages: true,
                        members: {
                            where: { client_id: Number(body.client_id) },
                            select: { number_of_read_messages: true },
                            take: 1,
                        },
                    },
                    orderBy: { id: "desc" },
                });
            }
            else if (client.roles.includes(ClientRoles_1.default.admin)) {
                const agentInfo = await this.prismaService.realEstateAgentAdmins.findFirst({
                    where: { client_id: Number(body.client_id) },
                    select: { real_estate_agent: { select: { id: true } } },
                });
                user_channel =
                    await this.prismaService.channelRealEstateAgent.findFirst({
                        where: {
                            agent_id: agentInfo.real_estate_agent.id,
                        },
                        select: {
                            id: true,
                            key: true,
                            last_message_time: true,
                            real_estate_agent: {
                                select: { id: true, name: true, avatar: true },
                            },
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
                                    key: true,
                                    created_at: true,
                                    channel_id: true,
                                },
                            },
                            number_of_messages: true,
                            members: {
                                where: { client_id: Number(body.client_id) },
                                select: { number_of_read_messages: true },
                                take: 1,
                            },
                        },
                    });
                pinned = await this.prismaService.channelRealEstateAgent.findMany({
                    where: {
                        tag: ChannelsTypes_1.default.pinned,
                        NOT: { agent_id: agentInfo.real_estate_agent.id },
                        real_estate_agent: { status: Statuses_1.default.active },
                    },
                    select: {
                        id: true,
                        key: true,
                        last_message_time: true,
                        real_estate_agent: {
                            select: { id: true, name: true, avatar: true },
                        },
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
                                key: true,
                                created_at: true,
                                channel_id: true,
                            },
                        },
                        number_of_messages: true,
                        members: {
                            where: { client_id: Number(body.client_id) },
                            select: { number_of_read_messages: true },
                            take: 1,
                        },
                    },
                    orderBy: { id: "desc" },
                });
            }
            else {
                pinned = await this.prismaService.channelRealEstateAgent.findMany({
                    where: {
                        tag: ChannelsTypes_1.default.pinned,
                        real_estate_agent: { status: Statuses_1.default.active },
                    },
                    select: {
                        id: true,
                        key: true,
                        last_message_time: true,
                        real_estate_agent: {
                            select: { id: true, name: true, avatar: true },
                        },
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
                                key: true,
                                created_at: true,
                                channel_id: true,
                            },
                        },
                        number_of_messages: true,
                        members: {
                            where: { client_id: Number(body.client_id) },
                            select: { number_of_read_messages: true },
                            take: 1,
                        },
                    },
                    orderBy: { id: "desc" },
                });
            }
            const channels = (await this.prismaService.channelRealEstateAgent.findMany({
                where: {
                    members: { some: { client_id: Number(body.client_id) } },
                    NOT: { tag: ChannelsTypes_1.default.pinned },
                    real_estate_agent: { status: Statuses_1.default.active },
                },
                select: {
                    id: true,
                    key: true,
                    last_message_time: true,
                    real_estate_agent: {
                        select: { id: true, name: true, avatar: true },
                    },
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
                            key: true,
                            created_at: true,
                            channel_id: true,
                        },
                    },
                    number_of_messages: true,
                    members: {
                        where: { client_id: Number(body.client_id) },
                        select: { number_of_read_messages: true },
                        take: 1,
                    },
                },
                orderBy: { last_message_time: "desc" },
            }));
            return {
                status: 200,
                user_channel,
                pinned,
                channels,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
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
            const count = await this.prismaService.channelRealEstateHistoryMessages.count({
                where: {
                    channel_id: Number(body.channel_id),
                },
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            const messages = await this.prismaService.channelRealEstateHistoryMessages.findMany({
                where: { channel_id: Number(body.channel_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { created_at: "desc" },
            });
            let membership_status = false;
            const membership = await this.prismaService.channelRealEstateMembers.findFirst({
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
                messages,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async storeNewMessage(body) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(body.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.channelRealEstateAgent.findFirst({
                where: {
                    id: Number(body.channel_id),
                    agent_id: Number(body.agent_id),
                },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            await this.prismaService.channelRealEstateHistoryMessages.create({
                data: {
                    type: body.type,
                    content: body.content,
                    key: channelInfo.key,
                    size: Number(body.size),
                    length: Number(body.length),
                    thumbnail: body.thumbnail,
                    channel: { connect: { id: Number(body.channel_id) } },
                },
            });
            await this.prismaService.channelRealEstateAgent.update({
                where: { id: Number(body.channel_id) },
                data: {
                    last_message_time: new Date(Date.now()),
                    number_of_messages: channelInfo.number_of_messages + 1,
                },
            });
            const result = await this.prismaService.channelRealEstateAgent.findFirst({
                where: { id: Number(body.channel_id), agent_id: Number(body.agent_id) },
                select: {
                    id: true,
                    key: true,
                    last_message_time: true,
                    real_estate_agent: {
                        select: { id: true, name: true, avatar: true },
                    },
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
                            key: true,
                            created_at: true,
                            channel_id: true,
                        },
                    },
                    number_of_messages: true,
                    members: {
                        where: { client_id: Number(body.client_id) },
                        select: { number_of_read_messages: true },
                        take: 1,
                    },
                },
                orderBy: { last_message_time: "desc" },
            });
            result.number_of_messages = 1;
            return {
                status: 201,
                result,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateChannelKey() {
        const key = (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateChannelId = await this.prismaService.channelRealEstateAgent.findFirst({
            where: { key },
        });
        if (isDuplicateChannelId) {
            await this.generateChannelKey();
        }
        return key;
    }
    async findOneByID(item_id) {
        return await this.prismaService.channelRealEstateAgent.findFirst({
            where: { id: Number(item_id) },
            select: {
                id: true,
                real_estate_agent: { select: { id: true, name: true } },
            },
        });
    }
    async findMessagesByID(item_id) {
        return await this.prismaService.channelRealEstateHistoryMessages.findFirst({
            where: { id: Number(item_id) },
            select: {
                id: true,
                content: true,
            },
        });
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
ChannelRealEstateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelRealEstateService);
exports.ChannelRealEstateService = ChannelRealEstateService;
//# sourceMappingURL=channel-real-estate.service.js.map