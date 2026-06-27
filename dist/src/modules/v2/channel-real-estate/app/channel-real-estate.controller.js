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
exports.ChannelRealEstateController = void 0;
const common_1 = require("@nestjs/common");
const channel_real_estate_service_1 = require("./channel-real-estate.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const nestjs_form_data_1 = require("nestjs-form-data");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const Transformer_1 = require("./Transformer");
const get_messages_channel_real_estate_dto_1 = require("./dto/get-messages-channel-real-estate.dto");
const join_channel_real_estate_dto_1 = require("./dto/join-channel-real-estate.dto");
const store_message_channel_real_estate_dto_1 = require("./dto/store-message-channel-real-estate.dto");
let ChannelRealEstateController = class ChannelRealEstateController {
    constructor(channelRealEstateService, ChannelRealEstateTransformer, responsehandler) {
        this.channelRealEstateService = channelRealEstateService;
        this.ChannelRealEstateTransformer = ChannelRealEstateTransformer;
        this.responsehandler = responsehandler;
    }
    async joinChannel(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** Join Channel RealEstate ***");
        console.log(body);
        const result = await this.channelRealEstateService.joinChannel(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . کانالی برای مشاور املاک موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 201, "عضویت در کانال انجام شد.");
    }
    async leaveChannel(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** leave Channel RealEstate ***");
        console.log(body);
        const result = await this.channelRealEstateService.leaveChannel(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 200, "ترک کانال با موفقیت انجام شد.");
    }
    async channelsList(req, res) {
        console.log("*** List channels RealEstate ***");
        console.log({ client_id: req.user.id });
        const result = await this.channelRealEstateService.getMyChannels({
            client_id: req.user.id,
        });
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const user_channel = this.ChannelRealEstateTransformer.transform(result.user_channel);
        const channels = this.ChannelRealEstateTransformer.collection(result.channels);
        const pinned = this.ChannelRealEstateTransformer.collection(result.pinned);
        return this.responsehandler.send(res, result.status, "لیست کانال های شما در دسترس است.", {
            user_channel,
            pinned,
            channels,
        });
    }
    async getMessages(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** Get Channel Messages ***");
        console.log({ query });
        const result = await this.channelRealEstateService.getMessages(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.ChannelRealEstateTransformer.messageCollection(result.messages);
        return this.responsehandler.send(res, result.status, "لیست پیام ها در دسترس است.", {
            membership_status: result.membership_status,
            data: transformer,
            metadata: result.metadata,
        });
    }
    async storeNewMessage(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** storeNewMessage in RealEstate Channel  ***");
        console.log({ body });
        const result = await this.channelRealEstateService.storeNewMessage(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.ChannelRealEstateTransformer.transform(result.result);
        return this.responsehandler.send(res, result.status, "پیام شما با موفقیت ثبت شد.", transformer);
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "عضویت در کانال انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "عضویت در کانال انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: " عضویت در کانال" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("join"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_channel_real_estate_dto_1.JoinChannelRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "joinChannel", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "ترک کانال با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "ترک کانال با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "ترک کانال" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Delete)("leave"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_channel_real_estate_dto_1.JoinChannelRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "leaveChannel", null);
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
                        user_channel: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                key: { type: "string" },
                                agent_id: { type: "integer", example: 1 },
                                name: { type: "string" },
                                profile: { type: "string" },
                                number_of_unread_messages: { type: "integer" },
                                last_message: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer" },
                                        channel_id: { type: "integer" },
                                        key: { type: "string" },
                                        type: { type: "string" },
                                        content: { type: "string" },
                                        size: { type: "integer", example: 4763476 },
                                        length: { type: "integer", example: 295.523265 },
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
                        pinned: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    agent_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    profile: { type: "string" },
                                    number_of_unread_messages: { type: "integer" },
                                    last_message: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            channel_id: { type: "integer" },
                                            key: { type: "string" },
                                            type: { type: "string" },
                                            content: { type: "string" },
                                            size: { type: "integer", example: 4763476 },
                                            length: { type: "integer", example: 295.523265 },
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
                        channels: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    agent_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    profile: { type: "string" },
                                    number_of_unread_messages: { type: "integer" },
                                    last_message: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            channel_id: { type: "integer" },
                                            key: { type: "string" },
                                            type: { type: "string" },
                                            content: { type: "string" },
                                            size: { type: "integer", example: 4763476 },
                                            length: { type: "integer", example: 295.523265 },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست کانال های من" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "channelsList", null);
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
    (0, common_1.Get)("messages"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_channel_real_estate_dto_1.GetMessagesChannelRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "getMessages", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "پیام شما با موفقیت ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "پیام شما با موفقیت ثبت شد.",
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
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    agent_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    profile: { type: "string" },
                                    last_message: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            channel_id: { type: "integer" },
                                            key: { type: "string" },
                                            type: { type: "string" },
                                            content: { type: "string" },
                                            size: { type: "integer", example: 4763476 },
                                            length: { type: "integer", example: 295.523265 },
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
    (0, swagger_1.ApiOperation)({ summary: "ارسال پیام در کانال" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("messages"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [store_message_channel_real_estate_dto_1.StoreMessageChannelRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "storeNewMessage", null);
ChannelRealEstateController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-channel-real-estate"),
    (0, common_1.Controller)("v2/app/channel-real-estate"),
    __metadata("design:paramtypes", [channel_real_estate_service_1.ChannelRealEstateService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], ChannelRealEstateController);
exports.ChannelRealEstateController = ChannelRealEstateController;
//# sourceMappingURL=channel-real-estate.controller.js.map