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
exports.MarketplaceMessengerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const ClientRoles_1 = require("../../../../commons/contracts/ClientRoles");
const Transformer_1 = require("./Transformer");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const messages_1 = require("../../../../commons/enums/messages");
const core_1 = require("@nestjs/core");
const axios_1 = require("axios");
const process = require("process");
const pagination_util_1 = require("../../../../commons/utils/pagination.util");
const get_messages_dto_1 = require("../../messenger/app/dto/get-messages.dto");
let MarketplaceMessengerService = class MarketplaceMessengerService {
    constructor(request, prismaService, messageTransformer) {
        this.request = request;
        this.prismaService = prismaService;
        this.messageTransformer = messageTransformer;
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
    async checkExistStorefront(storefrontId) {
        const checkExistStorefront = await this.prismaService.storefront.findFirst({
            where: { id: storefrontId },
            select: {
                id: true,
                client: { select: { id: true } },
            },
        });
        if (!checkExistStorefront) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler(messages_1.NotFoundMessage.NotFoundStorefront);
        }
        return checkExistStorefront;
    }
    async checkExistStorefrontByClientId(client_id) {
        return this.prismaService.storefront.findFirst({
            where: { client_id },
            select: {
                id: true,
                client: { select: { id: true } },
            },
        });
    }
    async generateTrackingCode() {
        const uniqueCode = "mrkt_chat_" +
            (Math.random() * (100000000 - 1000000) + 100000000).toFixed(0);
        const isCodeUnique = await this.prismaService.marketplaceMessengerHistory.findFirst({
            where: { key: uniqueCode },
        });
        if (isCodeUnique) {
            return this.generateTrackingCode();
        }
        return uniqueCode;
    }
    async storeChatRequest(body) {
        const { id: clientId } = this.request.client;
        const isStorefront = await this.checkExistStorefrontByClientId(clientId);
        const storefront = await this.checkExistStorefront(body.item_id);
        const participantInfo = storefront.client;
        console.log({ participantInfo });
        const isDuplicateChat = await this.prismaService.marketplaceMessengerHistory.findFirst({
            where: {
                OR: [
                    {
                        client_id: clientId,
                        type: "starter",
                        starter_id: clientId,
                        participant_id: Number(participantInfo.id),
                    },
                    {
                        client_id: clientId,
                        type: "participant",
                        starter_id: Number(participantInfo.id),
                        participant_id: clientId,
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
        if (!isDuplicateChat) {
            const key = await this.generateTrackingCode();
            let starter_chat_type = !isStorefront
                ? ClientRoles_1.default.personal
                : ClientRoles_1.default.storefront;
            const result = await this.prismaService.marketplaceMessengerHistory.create({
                data: {
                    client_id: clientId,
                    type: "starter",
                    chat_type: starter_chat_type,
                    starter: {
                        connect: { id: clientId },
                    },
                    participant: {
                        connect: { id: Number(participantInfo.id) },
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
            result.starter = (await this.starterInfo(result.starter, !!isStorefront));
            result.participant = (await this.starterInfo(result.participant, true));
            let participant_chat_type = !isStorefront
                ? ClientRoles_1.default.personal
                : ClientRoles_1.default.storefront;
            await this.prismaService.marketplaceMessengerHistory.create({
                data: {
                    client_id: clientId,
                    type: "participant",
                    chat_type: participant_chat_type,
                    starter: {
                        connect: { id: clientId },
                    },
                    participant: {
                        connect: { id: Number(participantInfo.id) },
                    },
                    key,
                },
            });
            const transform = this.messageTransformer.transform(result);
            return {
                status: axios_1.HttpStatusCode.Created,
                message: messages_1.PublicMessage.Created,
                data: transform,
            };
        }
        console.log({ isDuplicateChat });
        isDuplicateChat.starter = (await this.starterInfo(isDuplicateChat.starter, !!isStorefront));
        isDuplicateChat.participant = (await this.starterInfo(isDuplicateChat.participant, true));
        const transform = this.messageTransformer.transform(isDuplicateChat);
        return {
            status: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.Created,
            data: transform,
        };
    }
    async findMyChats() {
        const { id: clientId } = this.request.client;
        const chatList = await this.prismaService.marketplaceMessengerHistory.findMany({
            where: {
                OR: [
                    {
                        type: "starter",
                        starter_id: clientId,
                    },
                    {
                        type: "participant",
                        participant_id: clientId,
                    },
                ],
            },
            select: this.chatSelector,
            orderBy: { created_at: "desc" },
        });
        const list = await this.presentedChat(chatList);
        const presentedChatList = await Promise.all(list.map(async (item) => {
            item.messages = await this.getLastMessage(item.key);
            return item;
        }));
        const transform = this.messageTransformer.collection(presentedChatList);
        return {
            status: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.Created,
            data: transform,
        };
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
    async findMessages(query) {
        const { id: client_id } = this.request.client;
        const { skip } = (0, pagination_util_1.PaginationSolver)(query);
        const { where, count } = await this.generateConditions(client_id, skip, query);
        const result = await this.prismaService.marketplaceMessages.findMany({
            where,
            select: this.messageSelector,
            skip,
            take: +query.per_page,
            orderBy: { created_at: "desc" },
        });
        const editedTransform = await this.getEditedMessage(client_id, query.key);
        const deletedMessage = await this.getDeletedMessages(client_id, query.key);
        const transform = this.messageTransformer.messageCollection(result);
        return {
            status: axios_1.HttpStatusCode.Ok,
            message: messages_1.PublicMessage.OkResponse,
            data: {
                messages: transform,
                edited: editedTransform,
                deleted: deletedMessage,
                metadata: (0, pagination_util_1.PaginationGenerator)(query.page, query.per_page, count),
            },
        };
    }
    async generateConditions(client_id, skip, query) {
        let count = 0;
        let where = {};
        if (query.type === get_messages_dto_1.GetMessagesTypes.pagination) {
            count = await this.prismaService.marketplaceMessages.count({
                where: { key: query.key },
            });
        }
        else if (query.type === get_messages_dto_1.GetMessagesTypes.before_date) {
            count = await this.prismaService.marketplaceMessages.count({
                where: { key: query.key, created_at: { lt: query.date } },
            });
            where = {
                where: { key: query.key, created_at: { lt: query.date } },
                skip,
                take: +query.per_page,
            };
        }
        else if (query.type === get_messages_dto_1.GetMessagesTypes.after_date) {
            count = await this.prismaService.marketplaceMessages.count({
                where: { key: query.key, created_at: { gt: query.date } },
            });
            where = {
                where: { key: query.key, created_at: { gt: query.date } },
                skip,
                take: +query.per_page,
            };
        }
        else if (query.type === get_messages_dto_1.GetMessagesTypes.unseen) {
            where = {
                where: {
                    key: query.key,
                    seen: false,
                    NOT: { client_id: client_id },
                },
            };
        }
        return { where, count };
    }
    async getEditedMessage(client_id, key) {
        const edited = await this.prismaService.marketplaceMessages.findMany({
            where: {
                key,
                client_id: { not: client_id },
                is_edited: true,
            },
            orderBy: { created_at: "desc" },
            select: this.messageSelector,
        });
        return this.messageTransformer.messageCollection(edited);
    }
    async getDeletedMessages(client_id, chat_key) {
        const deletedResult = await this.prismaService.marketplaceChatMessengerMessageDeleted.findMany({
            where: {
                client_id,
                chat_key,
            },
        });
        await this.prismaService.marketplaceChatMessengerMessageDeleted.deleteMany({
            where: {
                client_id,
                chat_key,
            },
        });
        let deleted = [];
        deletedResult.map(async (item) => {
            deleted.push(item.message_id);
        });
        return deleted;
    }
};
MarketplaceMessengerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default])
], MarketplaceMessengerService);
exports.MarketplaceMessengerService = MarketplaceMessengerService;
//# sourceMappingURL=marketplace-messenger.service.js.map