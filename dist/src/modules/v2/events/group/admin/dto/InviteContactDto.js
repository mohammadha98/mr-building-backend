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
exports.InviteContactDto = exports.Contact = void 0;
const swagger_1 = require("@nestjs/swagger");
class Contact {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Contact.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Contact.prototype, "userid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Contact.prototype, "display_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Contact.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "teacher, assistant, participant",
    }),
    __metadata("design:type", String)
], Contact.prototype, "role", void 0);
exports.Contact = Contact;
class InviteContactDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Contact,
        isArray: true,
    }),
    __metadata("design:type", Array)
], InviteContactDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], InviteContactDto.prototype, "room_id", void 0);
exports.InviteContactDto = InviteContactDto;
//# sourceMappingURL=InviteContactDto.js.map