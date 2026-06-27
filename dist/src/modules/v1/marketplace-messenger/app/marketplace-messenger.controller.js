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
exports.MarketplaceMessengerController = void 0;
const common_1 = require("@nestjs/common");
const marketplace_messenger_service_1 = require("./marketplace-messenger.service");
const create_chat_in_marketplace_dto_1 = require("./dto/create-chat-in-marketplace.dto");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
const get_messages_dto_1 = require("../../messenger/app/dto/get-messages.dto");
let MarketplaceMessengerController = class MarketplaceMessengerController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async storeChatRequest(body) {
        console.log("*** store request: Marketplace CHAT ***");
        console.log(body);
        return await this.chatService.storeChatRequest(body);
    }
    async findMyChats() {
        console.log("*** find My Chats: Marketplace chat History ***");
        return this.chatService.findMyChats();
    }
    async findMessages(query) {
        console.log("*** findMessages: Marketplace CHat History ***");
        console.log(query);
        return this.chatService.findMessages(query);
    }
};
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiOperation)({ summary: "درخواست ایجاد چت" }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_in_marketplace_dto_1.CreateChatInMarketplaceDto]),
    __metadata("design:returntype", Promise)
], MarketplaceMessengerController.prototype, "storeChatRequest", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "لیست چت های من" }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketplaceMessengerController.prototype, "findMyChats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: " لیست پیام های چت" }),
    (0, common_1.Get)("messages"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_dto_1.GetMessagesDto]),
    __metadata("design:returntype", Promise)
], MarketplaceMessengerController.prototype, "findMessages", null);
MarketplaceMessengerController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app/marketplace/messenger"),
    (0, common_1.Controller)("v1/app/marketplace/messenger"),
    __metadata("design:paramtypes", [marketplace_messenger_service_1.MarketplaceMessengerService])
], MarketplaceMessengerController);
exports.MarketplaceMessengerController = MarketplaceMessengerController;
//# sourceMappingURL=marketplace-messenger.controller.js.map