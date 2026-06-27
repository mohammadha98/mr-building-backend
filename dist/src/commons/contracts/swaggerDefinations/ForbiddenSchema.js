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
const swagger_1 = require("@nestjs/swagger");
class ForbiddenSchema {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 403,
    }),
    __metadata("design:type", Number)
], ForbiddenSchema.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "خطا. اجازه ادامه کار را ندارید.",
    }),
    __metadata("design:type", String)
], ForbiddenSchema.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Forbidden",
    }),
    __metadata("design:type", String)
], ForbiddenSchema.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {},
    }),
    __metadata("design:type", Object)
], ForbiddenSchema.prototype, "data", void 0);
exports.default = ForbiddenSchema;
//# sourceMappingURL=ForbiddenSchema.js.map