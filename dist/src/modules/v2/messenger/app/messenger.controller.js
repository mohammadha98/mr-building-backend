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
exports.MessengerController = void 0;
const common_1 = require("@nestjs/common");
const messenger_service_1 = require("./messenger.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const nestjs_form_data_1 = require("nestjs-form-data");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const get_my_chats_dto_1 = require("./dto/get-my-chats.dto");
const Transformer_1 = require("./Transformer");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const Transformer_2 = require("../../messenger_groups/app/Transformer");
const Transformer_3 = require("../../messenger_channels/app/Transformer");
let MessengerController = class MessengerController {
    constructor(messengerService, messengerTransformer, responsehandler, messengerGroupsTransformer, messengerChannelTransformer) {
        this.messengerService = messengerService;
        this.messengerTransformer = messengerTransformer;
        this.responsehandler = responsehandler;
        this.messengerGroupsTransformer = messengerGroupsTransformer;
        this.messengerChannelTransformer = messengerChannelTransformer;
    }
    async storeChatRequest(createChatRealEstateDto, req, res) {
        createChatRealEstateDto.client_id = req.user.id;
        console.log("*** Create Chat: Messenger ***");
        console.log(createChatRealEstateDto);
        const result = await this.messengerService.storeChatRequest(createChatRealEstateDto);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. شخص مورد نظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.messengerTransformer.transform(result.result);
        return this.responsehandler.send(res, result.status, "درخواست شما از قبل موجود میباشد.", transformer);
    }
    async findMyChats(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** findMyChats: Messenger ***");
        console.log(query);
        const result = await this.messengerService.findMyChats(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const messengerTransformer = this.messengerTransformer.collection(result.chatList);
        return this.responsehandler.send(res, 200, "لیست چت های کاربر در دسترس است.", {
            blocked_account_ids: result.blocked_account_ids,
            blocked_participant_ids: result.blocked_participant_ids,
            list: messengerTransformer,
        });
    }
    async findMessages(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** find Messages: Messenger ***");
        console.log(query);
        const result = await this.messengerService.findMessages(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("سابقه چت موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.messengerTransformer.messageCollection(result.result);
        const edited = this.messengerTransformer.messageCollection(result.edited);
        console.log("******");
        console.log("client_id ", query.client_id);
        console.log("length ", transformer.length);
        console.log("******");
        return this.responsehandler.send(res, 200, "لیست پیام ها در دسترس است.", {
            data: transformer,
            edited,
            deleted: result.deleted,
            metadata: result.metadata,
        });
    }
    async AllDataInMessenger(req, res) {
        console.log("AllDataInMessenger: APP");
        console.log({ client_id: req.user.id });
        const result = await this.messengerService.AllDataInMessenger(req.user.id);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("سابقه چت موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const getPrivateChats = this.messengerTransformer.collection(result.getPrivateChats);
        const channels = this.messengerChannelTransformer.collection(result.getMessengerChannels, req.user.id);
        const groups = this.messengerGroupsTransformer.collection(result.getMessengerGroups, req.user.id);
        const allChats = [
            ...getPrivateChats,
            ...groups,
            ...channels,
            result.saveMessageService,
        ];
        const sortedChats = await this.messengerService.sortChatsByDate(allChats);
        return this.responsehandler.send(res, 200, "لیست پیام ها در دسترس است.", {
            blocked_account_ids: result.blocked_account_ids,
            blocked_participant_ids: result.blocked_participant_ids,
            data: sortedChats,
        });
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست شما با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست شما با موفقیت ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        key: { type: "string" },
                        source: { type: "string", example: null },
                        type: { type: "string", example: "starter, participant" },
                        number_of_unread_messages: { type: "integer" },
                        starter_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                                avatar: { type: "string" },
                            },
                        },
                        participant_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                                avatar: { type: "string" },
                            },
                        },
                        last_message: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                chat_key: { type: "string" },
                                client_id: { type: "integer" },
                                type: { type: "string" },
                                content: { type: "string" },
                                size: { type: "integer" },
                                length: { type: "integer" },
                                thumbnail: { type: "string" },
                                seen: { type: "boolean" },
                                is_replied: { type: "boolean" },
                                is_forwarded: { type: "boolean" },
                                is_edited: { type: "boolean" },
                                have_reaction: { type: "boolean" },
                                action: { type: "string" },
                                created_at: {
                                    type: "object",
                                    properties: {
                                        day: { type: "integer" },
                                        month: { type: "string" },
                                        year: { type: "integer" },
                                        time: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "درخواست شما از قبل موجود میباشد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "درخواست شما از قبل موجود میباشد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        key: { type: "string" },
                        source: { type: "string", example: null },
                        type: { type: "string", example: "starter, participant" },
                        number_of_unread_messages: { type: "integer" },
                        starter_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                                avatar: { type: "string" },
                            },
                        },
                        participant_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                                avatar: { type: "string" },
                            },
                        },
                        last_message: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                chat_key: { type: "string" },
                                client_id: { type: "integer" },
                                type: { type: "string" },
                                content: { type: "string" },
                                size: { type: "integer" },
                                length: { type: "integer" },
                                thumbnail: { type: "string" },
                                seen: { type: "boolean" },
                                is_replied: { type: "boolean" },
                                is_forwarded: { type: "boolean" },
                                is_edited: { type: "boolean" },
                                have_reaction: { type: "boolean" },
                                action: { type: "string" },
                                created_at: {
                                    type: "object",
                                    properties: {
                                        day: { type: "integer" },
                                        month: { type: "string" },
                                        year: { type: "integer" },
                                        time: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: " ایجاد چت" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_dto_1.CreateChatMessenger, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerController.prototype, "storeChatRequest", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست چت های کاربر",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست چت های کاربر",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        blocked_account_ids: {
                            type: "array",
                            items: {
                                type: "integer",
                                properties: {},
                            },
                        },
                        blocked_participant_ids: {
                            type: "array",
                            items: {
                                type: "integer",
                                properties: {},
                            },
                        },
                        list: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    source: { type: "string", example: null },
                                    type: { type: "string", example: "starter, participant" },
                                    number_of_unread_messages: { type: "integer" },
                                    starter_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                            avatar: { type: "string" },
                                        },
                                    },
                                    participant_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                            avatar: { type: "string" },
                                        },
                                    },
                                    last_message: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            chat_key: { type: "string" },
                                            client_id: { type: "integer" },
                                            type: { type: "string" },
                                            content: { type: "string" },
                                            size: { type: "integer" },
                                            length: { type: "integer" },
                                            thumbnail: { type: "string" },
                                            seen: { type: "boolean" },
                                            is_replied: { type: "boolean" },
                                            is_forwarded: { type: "boolean" },
                                            is_edited: { type: "boolean" },
                                            have_reaction: { type: "boolean" },
                                            action: { type: "string" },
                                            created_at: {
                                                type: "object",
                                                properties: {
                                                    day: { type: "integer" },
                                                    month: { type: "string" },
                                                    year: { type: "integer" },
                                                    time: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                    last_message_time: {
                                        type: "object",
                                        properties: {
                                            day: { type: "integer" },
                                            month: { type: "string" },
                                            year: { type: "integer" },
                                            time: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: " چت های من" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_my_chats_dto_1.GetMyCHatsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerController.prototype, "findMyChats", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست پیام ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست پیام ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer" },
                                    chat_key: { type: "string" },
                                    client_id: { type: "integer" },
                                    client_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                            avatar: { type: "string" },
                                        },
                                    },
                                    type: { type: "string" },
                                    content: { type: "string" },
                                    size: { type: "integer" },
                                    length: { type: "integer" },
                                    seen: { type: "boolean" },
                                    is_replied: { type: "boolean" },
                                    is_forwarded: { type: "boolean" },
                                    is_edited: { type: "boolean" },
                                    have_reaction: { type: "boolean" },
                                    action: { type: "string" },
                                    created_at: {
                                        type: "object",
                                        properties: {
                                            day: { type: "integer" },
                                            month: { type: "string" },
                                            year: { type: "integer" },
                                            time: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                        metadata: {
                            type: "object",
                            properties: {
                                page: { type: "integer", example: 1 },
                                total_page: { type: "integer", example: 1 },
                                per_page: { type: "integer", example: 1 },
                                next: { type: "boolean", example: true },
                                back: { type: "boolean", example: false },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: " لیست پیام های چت" }),
    (0, common_1.Get)("messages"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_dto_1.GetMessagesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerController.prototype, "findMessages", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست پیام ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست پیام ها در دسترس است.",
                },
                error: { type: "string" },
                data: {},
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "بخش همه(پیام های شخصی - پروه ها - کانال ها)" }),
    (0, common_1.Get)("all"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerController.prototype, "AllDataInMessenger", null);
MessengerController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-messenger"),
    (0, common_1.Controller)("v2/app/messenger"),
    __metadata("design:paramtypes", [messenger_service_1.MessengerService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler,
        Transformer_2.default,
        Transformer_3.default])
], MessengerController);
exports.MessengerController = MessengerController;
//# sourceMappingURL=messenger.controller.js.map