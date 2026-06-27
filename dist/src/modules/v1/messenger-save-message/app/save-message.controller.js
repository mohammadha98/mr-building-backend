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
exports.MessengerSaveMessageController = void 0;
const common_1 = require("@nestjs/common");
const save_message_service_1 = require("./save-message.service");
const swagger_1 = require("@nestjs/swagger");
const get_messages_dto_1 = require("./dto/get-messages.dto");
const TokenAuthGuardClient_1 = require("../../jwt-auth/TokenAuthGuardClient");
let MessengerSaveMessageController = class MessengerSaveMessageController {
    constructor(saveMessageService) {
        this.saveMessageService = saveMessageService;
    }
    async findMessages(query) {
        console.log("*** find Messages: SaveMessage ***");
        console.log(query);
        return await this.saveMessageService.findMessages(query);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: " لیست پیام های سیو مسیج" }),
    (0, common_1.Get)("messages"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_dto_1.GetMessagesDto]),
    __metadata("design:returntype", Promise)
], MessengerSaveMessageController.prototype, "findMessages", null);
MessengerSaveMessageController = __decorate([
    (0, common_1.UseGuards)(TokenAuthGuardClient_1.default),
    (0, swagger_1.ApiSecurity)("JWT-auth"),
    (0, swagger_1.ApiTags)("v1/app/messenger/save-message"),
    (0, common_1.Controller)("v1/app/messenger/save-message"),
    __metadata("design:paramtypes", [save_message_service_1.MessengerSaveMessageService])
], MessengerSaveMessageController);
exports.MessengerSaveMessageController = MessengerSaveMessageController;
//# sourceMappingURL=save-message.controller.js.map