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
exports.MessengerChannelsController = void 0;
const common_1 = require("@nestjs/common");
const messenger_channels_service_1 = require("./messenger-channels.service");
const swagger_1 = require("@nestjs/swagger");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const Transformer_1 = require("./Transformer");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const getMembers_1 = require("./dto/getMembers");
const Pagination_dto_1 = require("../../../../commons/contracts/Pagination.dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
const changeStatus_request_verify_dto_1 = require("./dto/changeStatus-request-verify.dto");
let MessengerChannelsController = class MessengerChannelsController {
    constructor(messengerChannelService, messengerChannelTransformer, responsehandler) {
        this.messengerChannelService = messengerChannelService;
        this.messengerChannelTransformer = messengerChannelTransformer;
        this.responsehandler = responsehandler;
    }
    async channelsList(query, req, res) {
        console.log("*** List Messenger Channels: ADMIN ***");
        query.user_id = req.user.id;
        console.log(query);
        const result = await this.messengerChannelService.getChannels(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.messengerChannelTransformer.collection(result.channels);
        return this.responsehandler.send(res, result.status, "لیست کانال ها در دسترس است.", {
            channels,
            metadata: result.metadata,
        });
    }
    async getChannelVerified(query, req, res) {
        console.log("*** List Messenger Verified Channels ***");
        query.user_id = req.user.id;
        console.log({ query });
        const result = await this.messengerChannelService.channelOfficials(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.messengerChannelTransformer.collectionOfficialChannel(result.channels);
        return this.responsehandler.send(res, result.status, "لیست درخواست ها در دسترس است.", {
            channels,
            metadata: result.metadata,
        });
    }
    async changeStatusRequests(body, req, res) {
        console.log("*** changeStatusRequests Verified Channels ***");
        body.user_id = req.user.id;
        console.log({ body });
        const result = await this.messengerChannelService.changeStatusRequests(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, result.status, "عملیات با موفقیت انجام شد.");
    }
    async getMessages(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** Get Channel Messages ***");
        console.log({ query });
        const result = await this.messengerChannelService.getMessages(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.messengerChannelTransformer.messageCollection(result.messages);
        return this.responsehandler.send(res, result.status, "لیست پیام ها در دسترس است.", {
            membership_status: result.membership_status,
            data: transformer,
            metadata: result.metadata,
        });
    }
    async getMembers(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** Get Channel Messenger: Members ***");
        console.log({ query });
        const result = await this.messengerChannelService.getMembers(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.messengerChannelTransformer.memberCollection(result.members);
        return this.responsehandler.send(res, result.status, "لیست ممبر ها در دسترس است.", transformer);
    }
    async channelInfo(username, req, res) {
        console.log("*** ChannelInfo: App ***");
        console.log({ client_id: req.user.id });
        console.log({ username });
        const body = {
            client_id: req.user.id,
            username,
        };
        const result = await this.messengerChannelService.channelInfo(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.messengerChannelTransformer.collection(result.channels);
        return this.responsehandler.send(res, result.status, "لیست کانال های شما در دسترس است.", {
            is_joined: result.is_joined,
            channel_info: channels[0],
        });
    }
};
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کانال ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کانال ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        channels: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    owner_id: { type: "integer" },
                                    key: { type: "string" },
                                    title: { type: "string" },
                                    requested: { type: "boolean" },
                                    verified_channel: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            verified_channel: { type: "boolean" },
                                            description: { type: "string" },
                                            status: {
                                                type: "string",
                                                example: "pending, approved, rejected",
                                            },
                                        },
                                    },
                                    member_count: { type: "integer" },
                                    description: { type: "string" },
                                    avatar: { type: "string" },
                                    type: { type: "string" },
                                    username: { type: "string" },
                                    last_message_time: {
                                        type: "object",
                                        properties: {
                                            day: { type: "integer" },
                                            month: { type: "string" },
                                            year: { type: "integer" },
                                            time: { type: "string" },
                                        },
                                    },
                                    message_time: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست کانال ها" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "channelsList", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست درخواست ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست درخواست ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        channels: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    verified_channel: { type: "boolean", default: false },
                                    description: { type: "string" },
                                    status: {
                                        type: "string",
                                        example: "pending, approved, rejected",
                                    },
                                    created_at: { type: "string" },
                                    updatedAt: { type: "string" },
                                    channel: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            owner_id: { type: "integer" },
                                            key: { type: "string" },
                                            title: { type: "string" },
                                            requested: { type: "boolean" },
                                            verified_channel: {
                                                type: "object",
                                                properties: {
                                                    id: { type: "string" },
                                                    verified_channel: { type: "boolean" },
                                                    description: { type: "string" },
                                                    status: {
                                                        type: "string",
                                                        example: "pending, approved, rejected",
                                                    },
                                                },
                                            },
                                            member_count: { type: "integer" },
                                            description: { type: "string" },
                                            avatar: { type: "string" },
                                            type: { type: "string" },
                                            username: { type: "string" },
                                            last_message_time: {
                                                type: "object",
                                                properties: {
                                                    day: { type: "integer" },
                                                    month: { type: "string" },
                                                    year: { type: "integer" },
                                                    time: { type: "string" },
                                                },
                                            },
                                            message_time: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست کانال های رسمی" }),
    (0, common_1.Get)("/official"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "getChannelVerified", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "عملیات با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "عملیات با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "تغییر وضعیت درخواست ها" }),
    (0, common_1.Post)("/official/change_status"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changeStatus_request_verify_dto_1.ChangeStatusRequestVerifyDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "changeStatusRequests", null);
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
                        membership_status: { type: "boolean", example: false },
                        data: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer" },
                                    channel_id: { type: "integer" },
                                    key: { type: "string" },
                                    type: { type: "string" },
                                    content: { type: "string" },
                                    size: { type: "integer", example: 4763476 },
                                    length: { type: "integer", example: 295.523265 },
                                    thumbnail: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "دریافت پیام ها" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_dto_1.GetChannelsMessagesDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "getMessages", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست ممبر ها در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست ممبر ها در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "array",
                    items: {
                        properties: {
                            role: { type: "string", example: "owner, member, admin" },
                            client_id: { type: "integer" },
                            user_key: { type: "string" },
                            name: { type: "string" },
                            avatar: { type: "string" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "دریافت ممبر ها" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMembers_1.GetChannelsMembersDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "getMembers", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "لیست کانال های شما در دسترس است.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "لیست کانال های شما در دسترس است.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        is_joined: { type: "boolean", example: false },
                        channel_info: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    owner_id: { type: "integer" },
                                    verified_channel: { type: "boolean" },
                                    is_owner: { type: "boolean" },
                                    key: { type: "string" },
                                    title: { type: "string" },
                                    member_count: { type: "integer" },
                                    description: { type: "string" },
                                    avatar: { type: "string" },
                                    type: { type: "string" },
                                    link: { type: "string" },
                                    number_of_unread_messages: { type: "integer" },
                                    last_message: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer" },
                                                channel_id: { type: "integer" },
                                                key: { type: "string" },
                                                type: { type: "string" },
                                                content: { type: "string" },
                                                size: { type: "integer", example: 4763476 },
                                                length: { type: "integer", example: 295.523265 },
                                                thumbnail: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "مشخصات کانال" }),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "channelInfo", null);
MessengerChannelsController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-messenger-channel"),
    (0, common_1.Controller)("v2/admin/messenger/channel"),
    __metadata("design:paramtypes", [messenger_channels_service_1.MessengerChannelsService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], MessengerChannelsController);
exports.MessengerChannelsController = MessengerChannelsController;
//# sourceMappingURL=messenger-channels.controller.js.map