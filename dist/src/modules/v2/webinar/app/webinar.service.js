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
exports.WebinarService = void 0;
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const EventService_1 = require("../provider/EventService");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const Templates_1 = require("../../../../commons/contracts/Templates");
const Transformer_1 = require("./Transformer");
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let WebinarService = class WebinarService {
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
        this.eventService = new EventService_1.default();
        this.smsService = new SmsService_1.default();
        this.webinarTransformer = new Transformer_1.default();
    }
    async findAllMyOwnWebinars(query) {
        try {
            const client_info = await this.prisma.client.findUnique({
                where: { id: query.user_id },
            });
            if (!client_info) {
                return { status: 403 };
            }
            const count = await this.prisma.webinar.count({
                where: {
                    client: { some: { id: Number(query.user_id) } },
                },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const list = await this.prisma.webinar.findMany({
                where: {
                    client: { some: { id: Number(query.user_id) } },
                },
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
    async findAllMyWebinars(query) {
        const client = await this.prisma.client.findUnique({
            where: { id: Number(query.client_id) },
        });
        if (!client) {
            return { status: 403 };
        }
        const existingWebinars = await this.prisma.webinar.findMany({
            where: {
                year: Number(query.year),
                client: { some: { id: Number(query.client_id) } },
            },
            orderBy: { id: "asc" },
        });
        const presentedWebinars = {};
        existingWebinars.map((webinar) => {
            const transformer = this.webinarTransformer.transform(webinar, client);
            if (!presentedWebinars[webinar.month]) {
                presentedWebinars[webinar.month] = [transformer];
            }
            else {
                presentedWebinars[webinar.month] = [
                    ...presentedWebinars[webinar.month],
                    transformer,
                ];
            }
        });
        return {
            status: 200,
            data: {
                presentedWebinars,
                client,
            },
        };
    }
    async findInvitedWebinars(webinar_id) {
        const users = await this.prisma.guest.findMany({
            where: { webinar_id: Number(webinar_id) },
        });
        return users;
    }
    async saveProceeding(data) {
        try {
            return await this.prisma.webinar.update({
                where: { id: Number(data.webinar_id) },
                data: {
                    proceeding: data.content,
                },
            });
        }
        catch (error) {
            return false;
        }
    }
    async deleteWebinar(data) {
        try {
            const webinar = await this.prisma.webinar.findFirst({
                where: { id: Number(data.webinar_id), owner_id: Number(data.user_id) },
            });
            if (webinar) {
                await this.eventService.deleteWebinar(webinar.webinar_id);
                await this.prisma.guest.deleteMany({
                    where: {
                        webinar_id: Number(data.webinar_id),
                    },
                });
                await this.prisma.webinar.delete({
                    where: {
                        id: Number(data.webinar_id),
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
            const webinar = await this.prisma.webinar.findFirst({
                where: { id: Number(data.webinar_id), owner_id: Number(data.user_id) },
            });
            if (webinar) {
                await this.eventService.deleteWebinar(webinar.webinar_id);
                await this.prisma.webinar.update({
                    where: {
                        id: Number(data.webinar_id),
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
    async updateWebinar(werbinarInfo) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { id: werbinarInfo.user_id },
            });
            const webinar = await this.prisma.webinar.findFirst({
                where: {
                    id: Number(werbinarInfo.webinar_id),
                },
            });
            if (webinar) {
                const slug = this.generateSlug();
                werbinarInfo.slug = slug;
                werbinarInfo.webinar_provider_id = webinar.webinar_id;
                const response = (await this.eventService.updateWebinar(werbinarInfo));
                if (response.status === 200) {
                    const updatedWebinar = await this.prisma.webinar.update({
                        where: {
                            id: Number(werbinarInfo.webinar_id),
                        },
                        data: {
                            owner_id: werbinarInfo.user_id,
                            title: werbinarInfo.title,
                            description: werbinarInfo.description,
                            event_link: response.data.event.alocom_link,
                            type: werbinarInfo.type,
                            tag: werbinarInfo.tag,
                            guest_count: Number(werbinarInfo.guest_count),
                            guest_access: Number(werbinarInfo.guest_access),
                            started_at: werbinarInfo.started_at,
                            start_time: werbinarInfo.start_time,
                            end_time: werbinarInfo.end_time,
                        },
                    });
                    return { status: 200, webinar: updatedWebinar, client };
                }
                return { status: 500 };
            }
            else {
                return { status: 403 };
            }
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async store(createWebinarDto) {
        try {
            const client = await this.prisma.client.findUnique({
                where: { id: createWebinarDto.user_id },
            });
            const slug = this.generateSlug();
            createWebinarDto.slug = slug;
            const werbinarInfo = await this.createNewWebinarInProvider(createWebinarDto);
            if (werbinarInfo) {
                const clientInfo = await this.prisma.client.findUnique({
                    where: { id: createWebinarDto.user_id },
                });
                const users = {
                    users: [{ userid: clientInfo.webinar_provider_id, role: "teacher" }],
                };
                await this.addUserToEvent_teacherRole(werbinarInfo.id, users);
                const webinar = await this.prisma.webinar.create({
                    data: {
                        webinar_id: werbinarInfo.id,
                        owner_id: createWebinarDto.user_id,
                        title: createWebinarDto.title,
                        description: createWebinarDto.description,
                        type: createWebinarDto.type,
                        tag: createWebinarDto.tag,
                        year: Number(createWebinarDto.year),
                        month: Number(createWebinarDto.month),
                        guest_count: Number(createWebinarDto.guest_count),
                        guest_access: Number(createWebinarDto.guest_access),
                        started_at: createWebinarDto.started_at,
                        start_time: createWebinarDto.start_time,
                        end_time: createWebinarDto.end_time,
                        event_link: werbinarInfo.alocom_link,
                        client: {
                            connect: {
                                id: createWebinarDto.user_id,
                            },
                        },
                    },
                    include: { guests: true },
                });
                return { status: 200, webinar, client };
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
    async inviteContactToWebinar(inviteContactDto) {
        try {
            const webinar = await this.prisma.webinar.findFirst({
                where: {
                    id: Number(inviteContactDto.webinar_id),
                    owner_id: Number(inviteContactDto.user_id),
                },
            });
            if (webinar) {
                const contacts = inviteContactDto.contacts;
                await this.prisma.guest.deleteMany({
                    where: { webinar_id: inviteContactDto.webinar_id },
                });
                const users = await Promise.all(contacts.map(async (contact) => {
                    const gusetInfo = await this.prisma.client.update({
                        where: { id: contact.client_id },
                        data: {
                            webinars: {
                                connect: { id: inviteContactDto.webinar_id },
                            },
                        },
                        select: {
                            phone: true,
                            username: true,
                            password: true,
                            name: true,
                            surname: true,
                        },
                    });
                    await this.prisma.guest.create({
                        data: {
                            client_id: contact.client_id,
                            userid: contact.userid,
                            display_name: gusetInfo.name + " " + gusetInfo.surname,
                            phone: contact.phone,
                            role: contact.role,
                            webinar: {
                                connect: { id: Number(inviteContactDto.webinar_id) },
                            },
                        },
                    });
                    await this.sendLoginInfo(gusetInfo.phone, gusetInfo.username, gusetInfo.password);
                    delete contact.client_id;
                    return contact;
                }));
                await this.eventService.addUsersToEvent(webinar.webinar_id, { users });
                await this.prisma.webinar.update({
                    where: { id: Number(inviteContactDto.webinar_id) },
                    data: {
                        guest_count: users.length,
                    },
                });
                return { status: 200 };
            }
            else {
                return { status: 403 };
            }
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    generateSlug() {
        return (new Date().getTime().toString() +
            Math.floor(Math.random() * (999999 - 111111 + 1) + 111111));
    }
    async sendLoginInfo(phone, username, password) {
        try {
            console.log("*** Send Login Info With SMS ***");
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
    async findOneByID(item_id) {
        return await this.prisma.webinar.findFirst({
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
WebinarService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], WebinarService);
exports.WebinarService = WebinarService;
//# sourceMappingURL=webinar.service.js.map