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
exports.WebinarService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const EventService_1 = require("../provider/EventService");
let WebinarService = class WebinarService {
    constructor(prisma) {
        this.prisma = prisma;
        this.eventService = new EventService_1.default();
    }
    async findAllWebinars(pagination) {
        const count = await this.prisma.webinar.count();
        const total = this.getTotalPageNumber(Number(count), Number(pagination.per_page));
        const paginationValue = this.makePagination(Number(pagination.page), Number(pagination.per_page));
        const webinars = await this.prisma.webinar.findMany({
            skip: paginationValue.offset,
            take: paginationValue.per_page,
            orderBy: { created_at: "desc" },
        });
        return {
            webinars,
            metadata: this.makeMetadata(Number(pagination.page), Number(pagination.per_page), Number(total)),
        };
    }
    async findAllMyWebinars(pagination) {
        const count = await this.prisma.webinar.count();
        const total = this.getTotalPageNumber(Number(count), Number(pagination.per_page));
        const paginationValue = this.makePagination(Number(pagination.page), Number(pagination.per_page));
        const webinars = await this.prisma.webinar.findMany({
            skip: paginationValue.offset,
            take: paginationValue.per_page,
            orderBy: { created_at: "desc" },
        });
        return {
            webinars,
            metadata: this.makeMetadata(Number(pagination.page), Number(pagination.per_page), Number(total)),
        };
    }
    async findInvitedWebinars(webinar_id) {
        const users = await this.prisma.guest.findMany({
            where: { webinar_id: Number(webinar_id) },
        });
        return users;
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
    generateSlug() {
        return (new Date().getTime().toString() +
            Math.floor(Math.random() * (999999 - 111111 + 1) + 111111));
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebinarService);
exports.WebinarService = WebinarService;
//# sourceMappingURL=webinar.service.js.map