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
const create_channel_dto_1 = require("./dto/create-channel.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const nestjs_form_data_1 = require("nestjs-form-data");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const Transformer_1 = require("./Transformer");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const path_1 = require("path");
const update_channel_type_channel_dto_1 = require("./dto/update-channel-type-channel.dto");
const getMembers_1 = require("./dto/getMembers");
const check_file_middleware_1 = require("../../../../middlewares/check-file.middleware");
const request_verify_channel_dto_1 = require("./dto/request-verify-channel.dto");
let MessengerChannelsController = class MessengerChannelsController {
    constructor(messengerChannelService, messengerChannelTransformer, responsehandler) {
        this.messengerChannelService = messengerChannelService;
        this.messengerChannelTransformer = messengerChannelTransformer;
        this.responsehandler = responsehandler;
    }
    async createChannel(body, req, res, avatar) {
        body.client_id = req.user.id;
        body.avatar = avatar ? avatar.filename : null;
        console.log("*** Create Messenger Channel ***");
        console.log(body);
        const result = await this.messengerChannelService.createChannel(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.messengerChannelTransformer.transform(result.result, req.user.id);
        return this.responsehandler.send(res, 201, "عملیات با موفقیت انجام شد.", transformer);
    }
    async generateUsernameForChannel(channel_id, req, res) {
        console.log("*** generate Username For Channel ***");
        console.log({ channel_id });
        const result = await this.messengerChannelService.generateUsernameForChannel(channel_id);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 201, "عملیات با موفقیت انجام شد.", {
            link: result.username,
        });
    }
    async updateChannelType(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** Update Channel Type: APP ***");
        console.log(body);
        const result = await this.messengerChannelService.UpdateChannelTypeDto(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا . کانال موردنظر  موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 200, "تغییر تایپ کانال انجام شد.");
    }
    async validateChannelLink(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** ٰalidate Channel Link: APP ***");
        console.log(body);
        const result = await this.messengerChannelService.validateChannelLink(body);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 200, "عملیات با موفقیت انجام شد.", {
            status: result.validateStatus,
        });
    }
    async channelsList(req, res) {
        console.log("*** List Messenger Channels ***");
        console.log({ client_id: req.user.id });
        const result = await this.messengerChannelService.getMyChannels({
            client_id: req.user.id,
        });
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.messengerChannelTransformer.collection(result.channels, req.user.id);
        return this.responsehandler.send(res, result.status, "لیست کانال های شما در دسترس است.", {
            channels,
        });
    }
    async getChannelVerified(req, res) {
        console.log("*** List Messenger Verified Channels ***");
        console.log({ client_id: req.user.id });
        const result = await this.messengerChannelService.getChannelVerified({
            client_id: req.user.id,
        });
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.messengerChannelTransformer.collection(result.channels, req.user.id);
        return this.responsehandler.send(res, result.status, "لیست کانال های شما در دسترس است.", {
            channels,
        });
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
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.messengerChannelTransformer.collection(result.channels, req.user.id);
        return this.responsehandler.send(res, result.status, "لیست کانال های شما در دسترس است.", {
            is_joined: result.is_joined,
            channel_info: channels[0],
        });
    }
    async requestToOfficialChannel(body, req, res) {
        body.client_id = req.user.id;
        console.log("*** requestToOfficialChannel: App ***");
        console.log(body);
        const result = await this.messengerChannelService.requestToOfficialChannel(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 201, "درخواست شما ثبت شد.");
    }
};
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "عملیات با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "عملیات با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        owner_id: { type: "integer" },
                        verified_channel: { type: "boolean" },
                        is_owner: { type: "boolean" },
                        key: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        avatar: { type: "string" },
                        type: { type: "string" },
                        link: { type: "string" },
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
    }),
    (0, swagger_1.ApiOperation)({ summary: " ایجاد کانال" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("avatar", {
        storage: (0, multer_1.diskStorage)({
            destination: "./public/contents/temp/files",
            filename(req, file, callback) {
                const uniqueCode = (0, crypto_1.randomBytes)(4).toString("hex").toUpperCase();
                const extention = (0, path_1.parse)((0, path_1.join)(file.originalname)).ext;
                callback(null, `${Date.now()}-${uniqueCode}${extention}`);
            },
        }),
    }), check_file_middleware_1.CheckFileMiddleware),
    (0, swagger_1.ApiBody)({ type: create_channel_dto_1.CreateChannelDto }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_channel_dto_1.CreateChannelDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "createChannel", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "عملیات با موفقیت انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "عملیات با موفقیت انجام شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        link: { type: "string" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "ایجاد یوزرنیم جدید" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("username/:channel_id"),
    __param(0, (0, common_1.Param)("channel_id")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "generateUsernameForChannel", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: "تغییر تایپ کانال انجام شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 200 },
                message: {
                    type: "string",
                    example: "تغییر تایپ کانال انجام شد.",
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
    (0, swagger_1.ApiOperation)({ summary: "تغییر تایپ " }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Patch)("type"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_channel_type_channel_dto_1.UpdateChannelTypeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "updateChannelType", null);
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
                    properties: {
                        status: { type: "boolean", default: false },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "بررسی لینک کانال عمومی" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("public/validate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_channel_type_channel_dto_1.UpdateChannelTypeDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "validateChannelLink", null);
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
                        channels: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    owner_id: { type: "integer" },
                                    is_owner: { type: "boolean" },
                                    key: { type: "string" },
                                    requested: { type: "boolean" },
                                    verified_channel: { type: "boolean" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست کانال های من" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "channelsList", null);
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
                        channels: {
                            type: "array",
                            items: {
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    owner_id: { type: "integer" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست کانال های رسمی" }),
    (0, common_1.Get)("/verified"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "getChannelVerified", null);
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
    (0, common_1.Get)("messages"),
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
    (0, common_1.Get)("members"),
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
                                    requested: { type: "boolean" },
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
    (0, common_1.Get)("/info/:username"),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "channelInfo", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({
        description: "درخواست شما ثبت شد.",
        schema: {
            type: "object",
            properties: {
                statusCode: { type: "integer", example: 201 },
                message: {
                    type: "string",
                    example: "درخواست شما ثبت شد.",
                },
                error: { type: "string" },
                data: {
                    type: "object",
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "درخواست رسمی شدن کانال" }),
    (0, common_1.Post)("/request/official"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_verify_channel_dto_1.RequestVerifyChannelDto, Object, Object]),
    __metadata("design:returntype", Promise)
], MessengerChannelsController.prototype, "requestToOfficialChannel", null);
MessengerChannelsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app-messenger-channel"),
    (0, common_1.Controller)("v1/app/messenger-channel"),
    __metadata("design:paramtypes", [messenger_channels_service_1.MessengerChannelsService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], MessengerChannelsController);
exports.MessengerChannelsController = MessengerChannelsController;
//# sourceMappingURL=messenger-channels.controller.js.map