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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
const axios_1 = require("axios");
const messages_1 = require("../../../../commons/enums/messages");
const FCM_Notification_enum_1 = require("../enums/FCM-Notification.enum");
let NotificationsService = class NotificationsService {
    constructor(prismaService, fcmNotificationService) {
        this.prismaService = prismaService;
        this.fcmNotificationService = fcmNotificationService;
    }
    async testSendClientNotificationDto(body) {
        try {
            const result = await this.prismaService.clientNotificaionTokens.findFirst({
                where: {
                    client_id: Number(body.client_id)
                }
            });
            await this.fcmNotificationService.send({
                title: body.title,
                body: body.body,
                notification_token: result.notification_token,
                key: "chat_messenger"
            });
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async sendGeneralNotification(body) {
        await this.prismaService.generalNotification.create({
            data: {
                title: body.title,
                content: body.content,
                link: body.link
            }
        });
        await this.prismaService.generalNotificationSettings.updateMany({ data: { enabled: false } });
        await this.prismaService.generalNotificationSettings.create({ data: { enabled: true } });
        await this.prismaService.client.updateMany({ data: { has_update_general_notification: true } });
        await this.fcmNotificationService.sendToTopic({
            body: JSON.stringify({
                title: body.title,
                content: body.content,
                link: body.link,
                source: FCM_Notification_enum_1.default.GeneralNotification
            }),
            title: body.title,
            key: FCM_Notification_enum_1.default.GeneralNotification,
            topic: FCM_Notification_enum_1.default.GeneralNotification
        });
        return {
            statusCode: axios_1.HttpStatusCode.Created,
            message: messages_1.PublicMessage.Created,
            data: {}
        };
    }
    async getGeneralNotification() {
        const result = await this.prismaService.generalNotification.findMany({});
        return {
            statusCode: axios_1.HttpStatusCode.Created,
            message: messages_1.PublicMessage.Created,
            data: result
        };
    }
    async saveNotificationForAdminUser(body) {
        try {
            const oldToken = await this.prismaService.userNotificaionTokens.findFirst({
                where: {
                    client_id: body.client_id,
                    device_info: body.device_info
                }
            });
            if (oldToken) {
                if (body.notification_token !== oldToken.notification_token) {
                    const topics = ["notifications"];
                    console.log("topics");
                    console.log(topics);
                    await topics.map(async (topic) => {
                        await this.fcmNotificationService.subscribeToTopic([body.notification_token], topic);
                    });
                    await this.prismaService.userNotificaionTokens.deleteMany({
                        where: {
                            client_id: body.client_id,
                            device_info: body.device_info
                        }
                    });
                }
            }
            await this.prismaService.userNotificaionTokens.create({
                data: {
                    client: { connect: { id: body.client_id } },
                    notification_token: body.notification_token,
                    device_info: body.device_info
                }
            });
            return { status: 201 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getClientNotificationToken(client_id) {
        const result = await this.prismaService.clientNotificaionTokens.findMany({
            where: { client_id },
            select: {
                notification_token: true
            }
        });
        const tokens = [];
        if (result.length) {
            result.map((item) => tokens.push(item.notification_token));
        }
        return tokens;
    }
    async getAdminUserNotificationToken(client_id) {
        const result = await this.prismaService.userNotificaionTokens.findMany({
            where: { client_id },
            select: {
                notification_token: true
            }
        });
        const tokens = [];
        if (result.length) {
            result.map((item) => tokens.push(item.notification_token));
        }
        return tokens;
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        FcmNotificationService_1.default])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map