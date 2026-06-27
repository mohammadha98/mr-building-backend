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
exports.Admin_ChangeStatusAdDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
const Statuses_2 = require("../../../../../commons/contracts/Statuses");
class Admin_ChangeStatusAdDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Admin_ChangeStatusAdDto.prototype, "item_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Statuses_1.default, default: Statuses_2.default.approved }),
    __metadata("design:type", String)
], Admin_ChangeStatusAdDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: "fair, high, low" }),
    __metadata("design:type", String)
], Admin_ChangeStatusAdDto.prototype, "price_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "string" }),
    __metadata("design:type", Array)
], Admin_ChangeStatusAdDto.prototype, "reasons", void 0);
exports.Admin_ChangeStatusAdDto = Admin_ChangeStatusAdDto;
//# sourceMappingURL=change-status-ad.dto.js.map