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
exports.EventRoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const EventService_1 = require("../../webinar/provider/EventService");
const Templates_1 = require("../../../../commons/contracts/Templates");
let EventRoomsService = class EventRoomsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.eventService = new EventService_1.default();
        this.smsService = new SmsService_1.default();
    }
    async findAllMyOwnWebinars(query) {
        try {
            const client_info = await this.prisma.users.findUnique({
                where: { id: query.user_id },
            });
            if (!client_info) {
                return { status: 403 };
            }
            const count = await this.prisma.eventRooms.count({});
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const list = await this.prisma.eventRooms.findMany({
                take: paginationValue.per_page,
                skip: paginationValue.offset,
                orderBy: { created_at: "desc" },
            });
            return {
                status: 200,
                client_info,
                list,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async findInvitedWebinars(room_id) {
        const users = await this.prisma.eventRoomUsers.findMany({
            where: { event_room_id: Number(room_id) },
        });
        return users;
    }
    async deleteRoom(data) {
        try {
            const dashboard_user = await this.prisma.users.findUnique({
                where: { id: data.user_id },
            });
            if (!dashboard_user) {
                return { status: 403 };
            }
            const event = await this.prisma.eventRooms.findFirst({
                where: { id: Number(data.room_id) },
            });
            if (event) {
                await this.eventService.deleteWebinar(event.webinar_id);
                await this.prisma.guest.deleteMany({
                    where: {
                        webinar_id: Number(data.room_id),
                    },
                });
                await this.prisma.eventRooms.delete({
                    where: {
                        id: Number(data.room_id),
                    },
                });
                return { status: 200 };
            }
            else {
                return { status: 400 };
            }
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async webinarStatusInactived(data) {
        try {
            const event = await this.prisma.eventRooms.findFirst({
                where: { id: Number(data.room_id), owner_id: Number(data.user_id) },
            });
            if (event) {
                await this.eventService.deleteWebinar(event.webinar_id);
                await this.prisma.eventRooms.update({
                    where: {
                        id: Number(data.room_id),
                    },
                    data: { status: Statuses_1.default.inactive },
                });
                return { status: 200 };
            }
            else {
                return { status: 403 };
            }
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async sendLoginInfo(phone, username, password) {
        try {
            console.log("*** Send Login Info With SMS ***");
            console.log("");
            await this.smsService.send({
                recipient: phone,
                message: username + "\n" + "کلمه عبور:" + "\n" + password,
                parameterKey: "LOGININFO",
                templateID: Number(Templates_1.default.loginInfo),
            });
        }
        catch (error) {
            console.log("Error Send Client login webinar");
            console.log(error);
        }
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
};
EventRoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventRoomsService);
exports.EventRoomsService = EventRoomsService;
//# sourceMappingURL=event-rooms.service.js.map