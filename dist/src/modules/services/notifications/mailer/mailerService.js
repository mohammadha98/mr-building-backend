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
const common_1 = require("@nestjs/common");
const MrBuildingMailerService_1 = require("./providers/MrBuildingMailerService");
let MailerService = class MailerService {
    constructor(defaultProvider) {
        this.defaultProvider = defaultProvider;
    }
    async send(body) {
        await this.defaultProvider.send(body);
    }
    async sendBulk(body) {
        await this.defaultProvider.sendBulk(body);
    }
};
MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [MrBuildingMailerService_1.default])
], MailerService);
exports.default = MailerService;
//# sourceMappingURL=mailerService.js.map