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
exports.UpdateEventRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const EventRoomTypes_1 = require("../../../../../commons/contracts/EventRoomTypes");
class UpdateEventRoomDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], UpdateEventRoomDto.prototype, "event_room_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "title", description: "عنوان اتاق جلسه" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEventRoomDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: EventRoomTypes_1.default,
        name: "type",
        type: "string",
        description: "نوع اتاق جلسه: خصوصی",
        example: "private",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEventRoomDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ name: "tag", description: "رنگ را ارسال کنید" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEventRoomDto.prototype, "tag", void 0);
exports.UpdateEventRoomDto = UpdateEventRoomDto;
//# sourceMappingURL=update-event-room.dto.js.map