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
exports.CreateChatRealEstateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const ChatRealEstateTypes_1 = require("../../../../../commons/contracts/ChatRealEstateTypes");
class CreateChatRealEstateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ChatRealEstateTypes_1.default,
        default: ChatRealEstateTypes_1.default.advertisement,
    }),
    __metadata("design:type", String)
], CreateChatRealEstateDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateChatRealEstateDto.prototype, "item_id", void 0);
exports.CreateChatRealEstateDto = CreateChatRealEstateDto;
//# sourceMappingURL=create-chat-real-estate.dto.js.map