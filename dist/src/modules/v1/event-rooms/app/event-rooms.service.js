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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoomsService = void 0;
const common_1 = require("@nestjs/common");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const EventService_1 = require("../../webinar/provider/EventService");
const Templates_1 = require("../../../../commons/contracts/Templates");
const core_1 = require("@nestjs/core");
const messages_1 = require("../../../../commons/enums/messages");
const Transformer_1 = require("./Transformer");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let EventRoomsService = class EventRoomsService {
    constructor(request, prisma, roomTransformer) {
        this.request = request;
        this.prisma = prisma;
        this.roomTransformer = roomTransformer;
        this.eventService = new EventService_1.default();
        this.smsService = new SmsService_1.default();
    }
    async findAllMyOwnWebinars() {
        const client_id = this.request.client.id;
        const weninars = await this.prisma.eventRooms.findMany({
            where: { owner_id: client_id },
        });
        const roomTransformer = this.roomTransformer.collection(weninars, client_id);
        return {
            statusCode: 200,
            message: "لیست اتاقهای کاربر در دسترس است.",
            data: roomTransformer,
        };
    }
    async findAllMyRooms(query) {
        const client = this.request.client;
        const count = await this.prisma.eventRooms.count({
            where: {
                clients: { some: { id: client.id } },
            },
        });
        const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
        const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
        const rooms = await this.prisma.eventRooms.findMany({
            where: {
                clients: { some: { id: client.id } },
            },
            orderBy: { created_at: "desc" },
            take: Number(paginationValue.per_page),
            skip: Number(paginationValue.offset),
        });
        const roomTransformer = this.roomTransformer.collection(rooms, client);
        return {
            statusCode: 200,
            message: "لیست اتاقهای کاربر در دسترس است.",
            data: {
                data: roomTransformer,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            },
        };
    }
    async findInvitedWebinars(room_id) {
        const users = await this.prisma.eventRoomUsers.findMany({
            where: { event_room_id: Number(room_id) },
        });
        const roomTransformer = this.roomTransformer.guestCollection(users);
        return {
            statusCode: 200,
            message: "لیست کاربران دعوت شده به اتاق در دسترس است.",
            data: roomTransformer,
        };
    }
    async deleteWebinar(data) {
        const client_id = this.request.client.id;
        const event = await this.prisma.eventRooms.findFirst({
            where: { id: Number(data.room_id), owner_id: client_id },
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
            return {
                statusCode: 200,
                message: "اتاق موردنظر با موفقیت حذف شد.",
                data: {},
            };
        }
        else {
            throw new common_1.BadRequestException(messages_1.NotFoundMessage.NotFoundData);
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
    async updateWebinar(eventInfo) {
        const client = this.request.client;
        const event = await this.prisma.eventRooms.findFirst({
            where: {
                id: Number(eventInfo.event_room_id),
            },
        });
        if (event) {
            const slug = this.generateSlug();
            eventInfo.slug = slug;
            eventInfo.webinar_provider_id = event.webinar_id;
            eventInfo.guest_access = 0;
            eventInfo.guest_count = 0;
            const response = (await this.eventService.updateWebinar(eventInfo));
            if (response.status === 200) {
                const updatedWebinar = await this.prisma.eventRooms.update({
                    where: {
                        id: Number(eventInfo.event_room_id),
                    },
                    data: {
                        owner_id: eventInfo.user_id,
                        title: eventInfo.title,
                        event_link: response.data.event.alocom_link,
                        type: eventInfo.type,
                        tag: eventInfo.tag,
                        guest_count: Number(eventInfo.guest_count),
                    },
                });
                const transformer = this.roomTransformer.transform(updatedWebinar, client);
                return {
                    statusCode: 200,
                    message: "اتاق موردنظر با موفقیت حذف شد.",
                    data: transformer,
                };
            }
            throw new common_1.InternalServerErrorException("خطا در ایجاد اتاق. کمی بعد تلاش کنید.");
        }
        else {
            throw new common_1.BadRequestException("خطا در ایجاد اتاق. کمی بعد تلاش کنید.");
        }
    }
    async store(createEventRoomDto) {
        console.log({ createEventRoomDto });
        const client = this.request.client;
        const slug = this.generateSlug();
        createEventRoomDto.slug = slug;
        createEventRoomDto.guest_access = 0;
        const eventInfo = await this.createNewWebinarInProvider(createEventRoomDto);
        if (eventInfo) {
            const users = {
                users: [{ userid: client.webinar_provider_id, role: "teacher" }],
            };
            await this.addUserToEvent_teacherRole(eventInfo.id, users);
            const event = await this.prisma.eventRooms.create({
                data: {
                    owner_id: client.id,
                    webinar_id: eventInfo.id,
                    event_link: eventInfo.alocom_link,
                    title: createEventRoomDto.title,
                    type: createEventRoomDto.type,
                    tag: createEventRoomDto.tag,
                    guest_count: Number(0),
                },
                include: { guests: true },
            });
            const transformer = this.roomTransformer.transform(event, client);
            return {
                statusCode: 200,
                message: "اتاق جدید با موفقیت ایجاد شد.",
                data: transformer,
            };
        }
        throw new common_1.BadRequestException("خطا در ایجاد اتاق.کمی بعد تلاش کنید");
    }
    async createNewWebinarInProvider(CreateWebinarDto) {
        return await this.eventService.createNewEvent(CreateWebinarDto);
    }
    async addUserToEvent_teacherRole(event_id, users) {
        return await this.eventService.addUsersToEvent(event_id, users);
    }
    async inviteContactToEventRoom(inviteContactDto, res) {
        const client_id = this.request.client.id;
        console.log("*** inviteContactToEventRoom ***");
        console.log(inviteContactDto);
        const event = await this.prisma.eventRooms.findFirst({
            where: {
                id: Number(inviteContactDto.room_id),
                owner_id: client_id,
            },
        });
        if (event) {
            const contacts = inviteContactDto.contacts;
            await this.prisma.eventRoomUsers.deleteMany({
                where: { event_room_id: inviteContactDto.room_id },
            });
            const recipients = [];
            const users = await Promise.all(contacts.map(async (contact) => {
                const gusetInfo = await this.prisma.client.findUnique({
                    where: { id: contact.client_id },
                    select: {
                        id: true,
                        phone: true,
                        username: true,
                        password: true,
                        name: true,
                        surname: true,
                    },
                });
                recipients.push({
                    phone: gusetInfo.phone,
                    username: gusetInfo.username,
                    password: gusetInfo.password,
                });
                await this.prisma.eventRooms.update({
                    where: { id: Number(inviteContactDto.room_id) },
                    data: { clients: { connect: { id: Number(contact.client_id) } } },
                });
                await this.prisma.eventRoomUsers.create({
                    data: {
                        client_id: contact.client_id,
                        userid: contact.userid,
                        display_name: gusetInfo.name + " " + gusetInfo.surname,
                        phone: contact.phone,
                        role: contact.role,
                        event_room_id: Number(inviteContactDto.room_id),
                    },
                });
                delete contact.client_id;
                return contact;
            }));
            await this.prisma.eventRooms.update({
                where: { id: Number(inviteContactDto.room_id) },
                data: {
                    guest_count: users.length,
                },
            });
            this.sendSmsIntoContacts(recipients);
            this.eventService.addUsersToEvent(event.webinar_id, { users });
            res.status(common_1.HttpStatus.OK);
            return res.json({
                statusCode: common_1.HttpStatus.OK,
                message: "مخاطبین شما به اتاق اضافه شدند.",
                data: {},
            });
        }
        else {
            throw new common_1.BadRequestException("خطا در ایجاد اتاق.کمی بعد تلاش کنید");
        }
    }
    generateSlug() {
        return (new Date().getTime().toString() +
            Math.floor(Math.random() * (999999 - 111111 + 1) + 111111));
    }
    async sendSmsIntoContacts(contacts) {
        try {
            console.log("*** Send Login Info With SMS ***");
            contacts.map((contact) => {
                this.smsService.send({
                    recipient: contact.phone,
                    message: contact.username + "\n" + "کلمه عبور:" + "\n" + contact.password,
                    parameterKey: "LOGININFO",
                    templateID: Number(Templates_1.default.loginInfo),
                });
            });
        }
        catch (error) {
            console.log("Error Send Login Info for contacts in event room");
            console.log(error);
        }
    }
    async findOneByID(item_id) {
        return await this.prisma.eventRooms.findFirst({
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
EventRoomsService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default])
], EventRoomsService);
exports.EventRoomsService = EventRoomsService;
//# sourceMappingURL=event-rooms.service.js.map