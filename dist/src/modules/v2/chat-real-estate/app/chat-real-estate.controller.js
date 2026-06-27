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
exports.ChatRealEstateController = void 0;
const common_1 = require("@nestjs/common");
const chat_real_estate_service_1 = require("./chat-real-estate.service");
const create_chat_real_estate_dto_1 = require("./dto/create-chat-real-estate.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../jwt-auth/jwt-auth.guard");
const nestjs_form_data_1 = require("nestjs-form-data");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const get_chat_real_estate_dto_1 = require("./dto/get-chat-real-estate.dto");
const Transformer_1 = require("./Transformer");
const get_messages_chat_real_estate_dto_1 = require("./dto/get-messages-chat-real-estate.dto");
let ChatRealEstateController = class ChatRealEstateController {
    constructor(chatRealEstateService, chatRealEstateTransformer, responsehandler) {
        this.chatRealEstateService = chatRealEstateService;
        this.chatRealEstateTransformer = chatRealEstateTransformer;
        this.responsehandler = responsehandler;
    }
    async storeChatRequest(createChatRealEstateDto, req, res) {
        createChatRealEstateDto.client_id = req.user.id;
        console.log("*** storeChatRequest ***");
        console.log(createChatRealEstateDto);
        const result = await this.chatRealEstateService.storeChatRequest(createChatRealEstateDto);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. شخص مورد نظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.chatRealEstateTransformer.transform(result.result);
        return this.responsehandler.send(res, result.status, "درخواست شما از قبل موجود میباشد.", transformer);
    }
    async findMyChats(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** findMyChats: RealEstate CHatHistory ***");
        console.log(query);
        const result = await this.chatRealEstateService.findMyChats(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. شخص مورد نظر وجود ندارد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const presentedPersonal = this.chatRealEstateTransformer.collection(result.presentedPersonal);
        const presentedRealEstateChats = this.chatRealEstateTransformer.collection(result.presentedRealEstateChats);
        return this.responsehandler.send(res, 200, "لیست چت های کاربر در دسترس است.", {
            personal: presentedPersonal,
            real_estate_agent: presentedRealEstateChats,
        });
    }
    async findMessages(query, req, res) {
        query.client_id = req.user.id;
        console.log("*** findMessages: RealEstate CHatHistory => messages ***");
        console.log(query);
        const result = await this.chatRealEstateService.findMessages(query);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("سابقه چت موردتظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const transformer = this.chatRealEstateTransformer.messageCollection(result.result);
        return this.responsehandler.send(res, 200, "لیست پیام ها در دسترس است.", {
            data: transformer,
            metadata: result.metadata,
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
                        chat_type: { type: "string", example: "personal, estate_agent" },
                        number_of_unread_messages: { type: "integer" },
                        starter_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                            },
                        },
                        participant_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                            },
                        },
                        last_message: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                client_id: { type: "integer" },
                                type: { type: "string" },
                                message_side: {
                                    type: "string",
                                    example: "starter, participant",
                                },
                                content: { type: "string" },
                                seen: { type: "boolean" },
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
                        chat_type: { type: "string", example: "personal, estate_agent" },
                        number_of_unread_messages: { type: "integer" },
                        starter_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                            },
                        },
                        participant_info: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                name: { type: "string" },
                                phone: { type: "string" },
                            },
                        },
                        last_message: {
                            type: "object",
                            properties: {
                                id: { type: "integer" },
                                client_id: { type: "integer" },
                                type: { type: "string" },
                                message_side: {
                                    type: "string",
                                    example: "starter, participant",
                                },
                                content: { type: "string" },
                                seen: { type: "boolean" },
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
    (0, swagger_1.ApiOperation)({ summary: "درخواست ایجاد چت" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_real_estate_dto_1.CreateChatRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRealEstateController.prototype, "storeChatRequest", null);
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
                        personal: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    source: { type: "string", example: null },
                                    type: { type: "string", example: "starter, participant" },
                                    chat_type: {
                                        type: "string",
                                        example: "personal, estate_agent",
                                    },
                                    number_of_unread_messages: { type: "integer" },
                                    starter_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                            avatar: {
                                                type: "string",
                                                example: "avatar url || empty string",
                                            },
                                        },
                                    },
                                    participant_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                            avatar: {
                                                type: "string",
                                                example: "avatar url || empty string",
                                            },
                                        },
                                    },
                                    last_message: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            client_id: { type: "integer" },
                                            type: { type: "string" },
                                            message_side: {
                                                type: "string",
                                                example: "starter, participant",
                                            },
                                            content: { type: "string" },
                                            seen: { type: "boolean" },
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
                        real_estate_agent: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    source: { type: "string", example: null },
                                    type: { type: "string", example: "starter, participant" },
                                    chat_type: {
                                        type: "string",
                                        example: "personal, estate_agent",
                                    },
                                    number_of_unread_messages: { type: "integer" },
                                    starter_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                            avatar: {
                                                type: "string",
                                                example: "avatar url || empty string",
                                            },
                                        },
                                    },
                                    participant_info: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            name: { type: "string" },
                                            phone: { type: "string" },
                                        },
                                    },
                                    last_message: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            client_id: { type: "integer" },
                                            type: { type: "string" },
                                            message_side: {
                                                type: "string",
                                                example: "starter, participant",
                                            },
                                            content: { type: "string" },
                                            seen: { type: "boolean" },
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
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "لیست چت های من" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_chat_real_estate_dto_1.GetChatRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRealEstateController.prototype, "findMyChats", null);
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
                                    client_id: { type: "integer" },
                                    type: { type: "string" },
                                    message_side: {
                                        type: "string",
                                        example: "starter, participant",
                                    },
                                    content: { type: "string" },
                                    seen: { type: "boolean" },
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
    __metadata("design:paramtypes", [get_messages_chat_real_estate_dto_1.GetMessagesChatRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChatRealEstateController.prototype, "findMessages", null);
ChatRealEstateController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/app-chat-real-estate"),
    (0, common_1.Controller)("v2/app/chat-real-estate"),
    __metadata("design:paramtypes", [chat_real_estate_service_1.ChatRealEstateService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], ChatRealEstateController);
exports.ChatRealEstateController = ChatRealEstateController;
//# sourceMappingURL=chat-real-estate.controller.js.map