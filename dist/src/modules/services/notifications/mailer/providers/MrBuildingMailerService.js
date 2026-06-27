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
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let MrBuildingMailerService = class MrBuildingMailerService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async send(body) {
        try {
            const attachments = [];
            await this.mailerService
                .sendMail({
                to: body.to,
                text: body.body,
                subject: body.subject,
                html: body.body,
                attachments,
                from: process.env.MAIL_USER,
            })
                .then((response) => {
                console.log("Email sent");
                console.log(response);
            })
                .catch((e) => {
                console.log("Error sending email", e);
            });
        }
        catch (e) {
            console.log("Error sending email");
            console.log(e);
        }
    }
    async sendBulk(body) {
        await body.to.map((email) => {
            console.log({ email });
            this.send({
                body: body.body,
                to: email,
                subject: body.subject,
            });
        });
    }
};
MrBuildingMailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MrBuildingMailerService);
exports.default = MrBuildingMailerService;
//# sourceMappingURL=MrBuildingMailerService.js.map