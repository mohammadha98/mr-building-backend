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
exports.ChatRealEstateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const ChatRealEstateTypes_1 = require("../../../../commons/contracts/ChatRealEstateTypes");
const crypto_1 = require("crypto");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const ClientRoles_1 = require("../../../../commons/contracts/ClientRoles");
const Transformer_1 = require("./Transformer");
let ChatRealEstateService = class ChatRealEstateService {
    constructor(prismaService, messageTransformer) {
        this.prismaService = prismaService;
        this.messageTransformer = messageTransformer;
    }
    async storeChatRequest(createChatRealEstateDto) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(createChatRealEstateDto.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            let participantInfo = null;
            if (createChatRealEstateDto.type === ChatRealEstateTypes_1.default.advertisement) {
                const advertisementInfo = await this.prismaService.realEstateAds.findUnique({
                    where: { id: Number(createChatRealEstateDto.item_id) },
                    select: {
                        client_id: true,
                        client: { select: { roles: true } },
                    },
                });
                participantInfo = advertisementInfo;
            }
            else if (createChatRealEstateDto.type === ChatRealEstateTypes_1.default.real_estate_agent) {
                const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                    where: { id: Number(createChatRealEstateDto.item_id) },
                    select: {
                        client_id: true,
                        client: { select: { roles: true } },
                    },
                });
                participantInfo = agentInfo;
            }
            else if (createChatRealEstateDto.type === ChatRealEstateTypes_1.default.advisor) {
                const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { id: Number(createChatRealEstateDto.item_id) },
                    select: {
                        client_id: true,
                        client: { select: { roles: true } },
                    },
                });
                participantInfo = advisorInfo;
            }
            console.log({ participantInfo });
            const isDuplicateChat = await this.prismaService.chatRealEstateHistory.findFirst({
                where: {
                    OR: [
                        {
                            client_id: Number(createChatRealEstateDto.client_id),
                            type: "starter",
                            starter_id: Number(createChatRealEstateDto.client_id),
                            participant_id: Number(participantInfo.client_id),
                        },
                        {
                            client_id: Number(createChatRealEstateDto.client_id),
                            type: "participant",
                            starter_id: Number(participantInfo.client_id),
                            participant_id: Number(createChatRealEstateDto.client_id),
                        },
                    ],
                },
                select: {
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
            });
            const key = await this.generateChatKey();
            if (!isDuplicateChat) {
                let starter_chat_type = ClientRoles_1.default.personal;
                if (client.roles.includes(ClientRoles_1.default.estate_agent) &&
                    createChatRealEstateDto.type === ChatRealEstateTypes_1.default.advertisement) {
                    starter_chat_type = ClientRoles_1.default.personal;
                }
                else if (client.roles.includes(ClientRoles_1.default.estate_agent) &&
                    createChatRealEstateDto.type !== ChatRealEstateTypes_1.default.advertisement) {
                    starter_chat_type = ClientRoles_1.default.estate_agent;
                }
                const result = await this.prismaService.chatRealEstateHistory.create({
                    data: {
                        client_id: Number(createChatRealEstateDto.client_id),
                        type: "starter",
                        chat_type: starter_chat_type,
                        starter: {
                            connect: { id: Number(createChatRealEstateDto.client_id) },
                        },
                        participant: {
                            connect: { id: Number(participantInfo.client_id) },
                        },
                        key,
                    },
                    select: {
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
                });
                result.starter = await this.getRealEstateChatInfo(result.starter);
                result.participant = await this.getRealEstateChatInfo(result.participant);
                let participant_chat_type = ClientRoles_1.default.personal;
                if (participantInfo.client.roles.includes(ClientRoles_1.default.estate_agent) ||
                    participantInfo.client.roles.includes(ClientRoles_1.default.advisor)) {
                    participant_chat_type = ClientRoles_1.default.estate_agent;
                }
                await this.prismaService.chatRealEstateHistory.create({
                    data: {
                        client_id: Number(participantInfo.client_id),
                        type: "participant",
                        chat_type: participant_chat_type,
                        starter: {
                            connect: { id: Number(createChatRealEstateDto.client_id) },
                        },
                        participant: {
                            connect: { id: Number(participantInfo.client_id) },
                        },
                        key,
                    },
                });
                if (createChatRealEstateDto.type === ChatRealEstateTypes_1.default.advisor) {
                    const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                        where: { id: Number(createChatRealEstateDto.item_id) },
                    });
                    if (result.participant.id === advisorInfo.client_id) {
                        await this.prismaService.realEstateAdvisors.update({
                            where: { id: Number(createChatRealEstateDto.item_id) },
                            data: { total_customers: advisorInfo.total_customers + 1 },
                        });
                    }
                }
                return { status: 201, result };
            }
            console.log({ isDuplicateChat });
            isDuplicateChat.starter = await this.getRealEstateChatInfo(isDuplicateChat.starter);
            isDuplicateChat.participant = await this.getRealEstateChatInfo(isDuplicateChat.participant);
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
            let presentedPersonal = [];
            let presentedRealEstateChats = [];
            if (client.roles.includes(ClientRoles_1.default.estate_agent)) {
                const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                    where: { client_id: Number(query.client_id) },
                    select: {
                        client_id: true,
                        avatar: true,
                        phone: true,
                        name: true,
                        id: true,
                    },
                });
                presentedRealEstateChats = await this.getChatsForRealEstate(agentInfo, undefined);
            }
            else if (client.roles.includes(ClientRoles_1.default.advisor)) {
                const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                    where: { client_id: Number(query.client_id) },
                    select: {
                        real_estate_agent: {
                            select: {
                                client_id: true,
                                avatar: true,
                                phone: true,
                                name: true,
                                id: true,
                            },
                        },
                    },
                });
                const agentInfo = {
                    id: advisorInfo.real_estate_agent.id,
                    client_id: advisorInfo.real_estate_agent.client_id,
                    name: advisorInfo.real_estate_agent.name,
                    phone: advisorInfo.real_estate_agent.phone,
                    avatar: advisorInfo.real_estate_agent.avatar,
                };
                presentedRealEstateChats = await this.getChatsForRealEstate(agentInfo, "estate_agent");
                const personalCondition = { where: {} };
                personalCondition.where = {
                    status: Statuses_1.default.active,
                    OR: [
                        {
                            client_id: Number(query.client_id),
                            type: "starter",
                            chat_type: "personal",
                        },
                        {
                            client_id: Number(query.client_id),
                            type: "participant",
                            chat_type: "personal",
                        },
                    ],
                };
                presentedPersonal = await this.getChatsForClient(query, personalCondition);
            }
            else {
                const personalCondition = { where: {} };
                personalCondition.where = {
                    status: Statuses_1.default.active,
                    OR: [
                        {
                            client_id: Number(query.client_id),
                            type: "starter",
                        },
                        {
                            client_id: Number(query.client_id),
                            type: "participant",
                        },
                    ],
                };
                presentedPersonal = await this.getChatsForClient(query, personalCondition);
            }
            return {
                status: 200,
                presentedPersonal,
                presentedRealEstateChats,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getChatsForClient(query, personalCondition) {
        const personal_chats = await this.prismaService.chatRealEstateHistory.findMany({
            where: personalCondition.where,
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
            orderBy: { last_message_time: "desc" },
        });
        const presentedPersonal = await Promise.all(personal_chats.map(async (item) => {
            item.starter = await this.getRealEstateChatInfo(item.starter);
            item.participant = await this.getRealEstateChatInfo(item.participant);
            const last_message = await this.prismaService.chatRealEstateHistoryMessages.findFirst({
                where: { key: item.key },
                orderBy: { created_at: "desc" },
            });
            item.messages = last_message;
            const number_of_unread_messages = await this.prismaService.chatRealEstateHistoryMessages.count({
                where: {
                    NOT: { client_id: Number(query.client_id) },
                    key: item.key,
                    seen: false,
                },
            });
            item.number_of_unread_messages = number_of_unread_messages;
            return item;
        }));
        return presentedPersonal;
    }
    async getChatsForRealEstate(agentInfo, chat_type) {
        let real_estate_agent_chats = [];
        let presentedRealEstateChats = [];
        const realEstateCondition = { where: {} };
        realEstateCondition.where = {
            status: Statuses_1.default.active,
            OR: [
                {
                    client_id: agentInfo.client_id,
                    type: "starter",
                    chat_type,
                },
                {
                    client_id: agentInfo.client_id,
                    type: "participant",
                    chat_type,
                },
            ],
        };
        real_estate_agent_chats =
            await this.prismaService.chatRealEstateHistory.findMany({
                where: realEstateCondition.where,
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
                orderBy: { last_message_time: "desc" },
            });
        presentedRealEstateChats = await Promise.all(real_estate_agent_chats.map(async (item) => {
            item.starter = await this.getRealEstateChatInfo(item.starter);
            item.participant = await this.getRealEstateChatInfo(item.participant);
            const last_message = await this.prismaService.chatRealEstateHistoryMessages.findFirst({
                where: { key: item.key },
                orderBy: { created_at: "desc" },
            });
            item.messages = last_message;
            const number_of_unread_messages = await this.prismaService.chatRealEstateHistoryMessages.count({
                where: {
                    NOT: { client_id: Number(agentInfo.client_id) },
                    key: item.key,
                    seen: false,
                },
            });
            item.number_of_unread_messages = number_of_unread_messages;
            return item;
        }));
        return presentedRealEstateChats;
    }
    async clientInfoForChat(client) {
        client.name = client.name + " " + client.surname;
        return client;
    }
    async realEstateInfoForChat(realEstate) {
        realEstate = {
            id: realEstate.id,
            name: realEstate.name,
            avatar: realEstate.avatar,
            phone: realEstate.phone,
        };
        return realEstate;
    }
    async getRealEstateChatInfo(client) {
        if (client.roles.includes(ClientRoles_1.default.estate_agent)) {
            const info = await this.realEstateInfoByClientId(client.id);
            client = {
                id: client.id,
                name: info.name,
                avatar: info.avatar,
                phone: client.phone,
            };
        }
        else {
            client = client;
            client.name = client.name + " " + client.surname;
        }
        return client;
    }
    async getRealEstateInfoForChat(clientId) {
        console.log({ clientId });
        const info = await this.realEstateInfoByClientId(clientId);
        const realEstate = {
            id: info.id,
            name: info.name,
            avatar: info.avatar,
            phone: info.client.phone,
        };
        return realEstate;
    }
    async getClientInfoForChat(clientId) {
        const info = await this.prismaService.client.findFirst({
            where: { id: clientId },
        });
        const clientInfo = {
            id: info.id,
            name: info.name,
            avatar: info.avatar,
            phone: info.phone,
        };
        return clientInfo;
    }
    async realEstateInfoByClientId(clientId) {
        return await this.prismaService.realEstateAgents.findFirst({
            where: { client_id: clientId },
            select: {
                id: true,
                name: true,
                avatar: true,
                client: { select: { phone: true } },
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
            const count = await this.prismaService.chatRealEstateHistoryMessages.count({
                where: { key: query.key },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.prismaService.chatRealEstateHistoryMessages.findMany({
                where: { key: query.key },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { created_at: "desc" },
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateChatKey() {
        const key = (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateChatId = await this.prismaService.chatRealEstateHistory.findFirst({
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
ChatRealEstateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        Transformer_1.default])
], ChatRealEstateService);
exports.ChatRealEstateService = ChatRealEstateService;
//# sourceMappingURL=chat-real-estate.service.js.map