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
    async saveNotificationFoClient(body) {
        try {
            const groups = await this.prismaService.messengerGroupsMembers.findMany({
                where: { client_id: body.client_id },
                select: { group: { select: { key: true } } }
            });
            const groupKeys = [];
            groups.map((item) => groupKeys.push(item.group.key));
            const channels = await this.prismaService.messengerChannlesMembers.findMany({
                where: { client_id: body.client_id },
                select: { channel: { select: { key: true } } }
            });
            const channelKeys = [];
            channels.map((item) => channelKeys.push(item.channel.key));
            let topics = [...groupKeys, ...channelKeys];
            topics.push("forceUpdate");
            console.log("**** subscribeToTopic after update Token ****");
            console.log(topics);
            await topics.map(async (topic) => {
                await this.fcmNotificationService.subscribeToTopic([body.notification_token], topic);
            });
            await this.prismaService.clientNotificaionTokens.deleteMany({
                where: {
                    client_id: body.client_id,
                    device_info: body.device_info
                }
            });
            await this.prismaService.clientNotificaionTokens.create({
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
    async findAllClientNotifications() {
        return `This action returns all notifications`;
    }
    async saveNotificationFoAdminUsers(body) {
        return "This action adds a new notification";
    }
    async findAllAdminUsersNotifications() {
        return `This action returns all notifications`;
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