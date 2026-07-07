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
exports.eventGroupsService = void 0;
const common_1 = require("@nestjs/common");
const SmsService_1 = require("../../../../services/notifications/sms/SmsService");
const Statuses_1 = require("../../../../../commons/contracts/Statuses");
const EventService_1 = require("../../../webinar/provider/EventService");
const Templates_1 = require("../../../../../commons/contracts/Templates");
const prisma_service_1 = require("../../../../../../prisma/prisma.service");
let eventGroupsService = class eventGroupsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.eventService = new EventService_1.default();
        this.smsService = new SmsService_1.default();
    }
    async findAllMyOwnWebinars(user_id) {
        return await this.prisma.eventGroups.findMany({
            where: { owner_id: user_id },
        });
    }
    async findAllMyGroups(query) {
        const client = await this.prisma.client.findUnique({
            where: { id: Number(query.client_id) },
        });
        if (!client) {
            return { status: 403 };
        }
        const count = await this.prisma.eventGroups.count({
            where: {
                owner_id: query.client_id,
            },
        });
        const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
        const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
        const groups = await this.prisma.eventGroups.findMany({
            where: {
                owner_id: query.client_id,
            },
            orderBy: { created_at: "desc" },
            take: Number(paginationValue.per_page),
            skip: Number(paginationValue.offset),
        });
        return {
            status: 200,
            groups,
            client,
            metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
        };
    }
    async findInvitedWebinars(room_id) {
        const users = await this.prisma.eventRoomUsers.findMany({
            where: { event_room_id: Number(room_id) },
        });
        return users;
    }
    async deleteWebinar(data) {
        try {
            const event = await this.prisma.eventGroups.findFirst({
                where: { id: Number(data.group_id), owner_id: Number(data.user_id) },
            });
            if (event) {
                await this.eventService.deleteWebinar(event.webinar_id);
                await this.prisma.eventGroups.delete({
                    where: {
                        id: Number(data.group_id),
                    },
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
    async webinarStatusInactived(data) {
        try {
            const event = await this.prisma.eventGroups.findFirst({
                where: { id: Number(data.group_id), owner_id: Number(data.user_id) },
            });
            if (event) {
                await this.eventService.deleteWebinar(event.webinar_id);
                await this.prisma.eventGroups.update({
                    where: {
                        id: Number(data.group_id),
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
    async store(CreateEventGroupDto) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { id: CreateEventGroupDto.user_id },
            });
            const slug = this.generateSlug();
            CreateEventGroupDto.slug = slug;
            CreateEventGroupDto.guest_access = 1;
            const eventInfo = await this.createNewWebinarInProvider(CreateEventGroupDto);
            if (eventInfo) {
                const clientInfo = await this.prisma.client.findUnique({
                    where: { id: CreateEventGroupDto.user_id },
                });
                const users = {
                    users: [{ userid: clientInfo.webinar_provider_id, role: "teacher" }],
                };
                await this.addUserToEvent_teacherRole(eventInfo.id, users);
                const event = await this.prisma.eventGroups.create({
                    data: {
                        owner_id: Number(CreateEventGroupDto.user_id),
                        webinar_id: eventInfo.id,
                        event_link: eventInfo.alocom_link,
                        title: CreateEventGroupDto.title,
                        tag: CreateEventGroupDto.tag,
                    },
                });
                return { status: 200, event, client };
            }
            return { status: 500 };
        }
        catch (error) {
            console.log("*** Error Save Webinar ***");
            console.log(error);
            return { status: 500 };
        }
    }
    async createNewWebinarInProvider(CreateWebinarDto) {
        return await this.eventService.createNewEvent(CreateWebinarDto);
    }
    async addUserToEvent_teacherRole(event_id, users) {
        return await this.eventService.addUsersToEvent(event_id, users);
    }
    generateSlug() {
        return (new Date().getTime().toString() +
            Math.floor(Math.random() * (999999 - 111111 + 1) + 111111));
    }
    sendLoginInfoWithSMS(client) {
        this.smsService.send({
            recipient: client.phone,
            message: client.username + "\n" + "کلمه عبور:" + "\n" + client.password,
            parameterKey: "LOGININFO",
            templateID: Number(Templates_1.default.loginInfo),
        });
    }
    async findOneByID(item_id) {
        return await this.prisma.eventGroups.findFirst({
            where: { id: Number(item_id) },
            select: { id: true, title: true },
        });
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
eventGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], eventGroupsService);
exports.eventGroupsService = eventGroupsService;
//# sourceMappingURL=event-groups.service.js.map