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
exports.UpdatePermissionsForAdvisorDto = exports.CreateRealEstateAgentsAdvisorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRealEstateAgentsAdvisorDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", Number)
], CreateRealEstateAgentsAdvisorDto.prototype, "agent_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({ message: "فرمت شماره موبایل صحیح نمیباشد." }),
    (0, class_validator_1.IsMobilePhone)(),
    __metadata("design:type", String)
], CreateRealEstateAgentsAdvisorDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "string" }),
    __metadata("design:type", Array)
], CreateRealEstateAgentsAdvisorDto.prototype, "permissions", void 0);
exports.CreateRealEstateAgentsAdvisorDto = CreateRealEstateAgentsAdvisorDto;
class UpdatePermissionsForAdvisorDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdatePermissionsForAdvisorDto.prototype, "advisor_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: "string" }),
    __metadata("design:type", Array)
], UpdatePermissionsForAdvisorDto.prototype, "permissions", void 0);
exports.UpdatePermissionsForAdvisorDto = UpdatePermissionsForAdvisorDto;
//# sourceMappingURL=create-real-estate-agents-advisor.dto.js.map