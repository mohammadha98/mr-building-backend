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
const nestjs_form_data_1 = require("nestjs-form-data");
const httpResponsehandler_1 = require("../../../services/httpResponseHandler/httpResponsehandler");
const badRequestErrorHandler_1 = require("../../../services/httpResponseHandler/badRequestErrorHandler");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const Transformer_1 = require("./Transformer");
const pinned_channel_real_estate_dto_1 = require("./dto/pinned-channel-real-estate.dto");
const get_channels_pagination__dto_1 = require("./dto/get-channels-pagination..dto");
const AdminTokenAuthGuard_1 = require("../../jwt-auth/AdminTokenAuthGuard");
let ChannelRealEstateController = class ChannelRealEstateController {
    constructor(channelRealEstateService, ChannelRealEstateTransformer, responsehandler) {
        this.channelRealEstateService = channelRealEstateService;
        this.ChannelRealEstateTransformer = ChannelRealEstateTransformer;
        this.responsehandler = responsehandler;
    }
    async channelsList(query, req, res) {
        console.log("*** List channels RealEstate: ADMIN ***");
        query.user_id = req.user.id;
        console.log(query);
        const result = await this.channelRealEstateService.getChannels(query);
        if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        const channels = this.ChannelRealEstateTransformer.collection(result.channels);
        return this.responsehandler.send(res, result.status, "لیست کانال های شما در دسترس است.", {
            data: channels,
            metadata: result.metadata,
        });
    }
    async pinnedChannel(body, req, res) {
        body.user_id = req.user.id;
        console.log("*** pinned Channel in RealEstate ***");
        console.log({ body });
        const result = await this.channelRealEstateService.pinnedChannel(body);
        if (result.status === 400) {
            throw new badRequestErrorHandler_1.BadRequestErrorHandler("خطا. کانال موردنظر موجود نمیباشد.");
        }
        else if (result.status === 403) {
            throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
        }
        else if (result.status === 500) {
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
        return this.responsehandler.send(res, 201, "پین با موفقیت ثبت شد.");
    }
};
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
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "integer", example: 1 },
                                    key: { type: "string" },
                                    agent_id: { type: "integer", example: 1 },
                                    name: { type: "string" },
                                    profile: { type: "string" },
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
    (0, swagger_1.ApiOperation)({ summary: "لیست کانال ها " }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_channels_pagination__dto_1.GetChannelsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "channelsList", null);
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
                    properties: {},
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: "پین کردن کانال" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)("pinned"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pinned_channel_real_estate_dto_1.PinnedChannelRealEstateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelRealEstateController.prototype, "pinnedChannel", null);
ChannelRealEstateController = __decorate([
    (0, common_1.UseGuards)(AdminTokenAuthGuard_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v2/admin-channel-real-estate"),
    (0, common_1.Controller)("v2/admin/channel-real-estate"),
    __metadata("design:paramtypes", [channel_real_estate_service_1.ChannelRealEstateService,
        Transformer_1.default,
        httpResponsehandler_1.HttpResponsehandler])
], ChannelRealEstateController);
exports.ChannelRealEstateController = ChannelRealEstateController;
//# sourceMappingURL=channel-real-estate.controller.js.map