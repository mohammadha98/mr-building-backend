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
exports.MarketplaceMessengerFactory = void 0;
const common_1 = require("@nestjs/common");
const marketplace_messenger_message_service_1 = require("../marketplace-messenger-message.service");
let MarketplaceMessengerFactory = class MarketplaceMessengerFactory {
    constructor(marketplaceMessenger_MessageSection) {
        this.marketplaceMessenger_MessageSection = marketplaceMessenger_MessageSection;
    }
    async saveMessage(body) {
        return await this.marketplaceMessenger_MessageSection.saveMessage(body);
    }
    async deleteMessage(body) {
        return await this.marketplaceMessenger_MessageSection.deleteMessage(body);
    }
    async seenMessages(body) {
        return await this.marketplaceMessenger_MessageSection.seenMessages(body);
    }
};
MarketplaceMessengerFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [marketplace_messenger_message_service_1.MarketplaceMessenger_MessageSection])
], MarketplaceMessengerFactory);
exports.MarketplaceMessengerFactory = MarketplaceMessengerFactory;
//# sourceMappingURL=MarketplaceMessenger-factory.js.map