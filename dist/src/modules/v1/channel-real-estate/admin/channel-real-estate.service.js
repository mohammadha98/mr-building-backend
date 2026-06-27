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
exports.ChannelRealEstateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const ChannelsTypes_1 = require("../../../../commons/contracts/ChannelsTypes");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
let ChannelRealEstateService = class ChannelRealEstateService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async pinnedChannel(body) {
        try {
            const client = await this.prismaService.users.findFirst({
                where: { id: Number(body.user_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const channelInfo = await this.prismaService.channelRealEstateAgent.findFirst({
                where: { id: Number(body.channel_id) },
                select: {
                    real_estate_agent: { select: { client: { select: { id: true } } } },
                },
            });
            if (!channelInfo) {
                return { status: 400 };
            }
            await this.prismaService.channelRealEstateAgent.update({
                where: { id: Number(body.channel_id) },
                data: { tag: body.tag },
            });
            if (body.tag === ChannelsTypes_1.default.pinned) {
                const clientIds = await this.prismaService.client.findMany({
                    where: { NOT: { id: channelInfo.real_estate_agent.client.id } },
                    select: { id: true },
                });
                const existingMembers = await this.prismaService.channelRealEstateMembers.findMany({
                    where: {
                        channel_id: Number(body.channel_id),
                        client_id: {
                            in: clientIds.map((item) => item.id),
                        },
                    },
                    select: { client_id: true },
                });
                const existingMembersIds = existingMembers.map((member) => member.client_id);
                const newMembers = clientIds
                    .filter((client) => !existingMembersIds.includes(client.id))
                    .map((client) => client.id);
                await this.prismaService.channelRealEstateMembers.createMany({
                    data: newMembers.map((clientId) => ({
                        channel_id: Number(body.channel_id),
                        client_id: Number(clientId),
                    })),
                });
            }
            else {
                await this.prismaService.channelRealEstateMembers.deleteMany({
                    where: {
                        channel_id: Number(body.channel_id),
                    },
                });
            }
            return {
                status: 201,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getChannels(query) {
        try {
            const user = await this.prismaService.users.findFirst({
                where: { id: Number(query.user_id) },
            });
            if (!user) {
                return { status: 403 };
            }
            const condition = {
                where: {},
                orderBy: { id: "desc" },
            };
            if (query.status === Statuses_1.default.all) {
                condition.where = {};
            }
            else if (query.status === Statuses_1.default.pinned) {
                condition.where = { tag: Statuses_1.default.pinned };
            }
            else if (query.status === Statuses_1.default.unpinned) {
                condition.where = { NOT: { tag: Statuses_1.default.pinned } };
            }
            const count = await this.prismaService.channelRealEstateAgent.count({
                where: condition.where,
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const channels = await this.prismaService.channelRealEstateAgent.findMany({
                where: condition.where,
                select: {
                    id: true,
                    key: true,
                    last_message_time: true,
                    tag: true,
                    created_at: true,
                    _count: { select: { members: true } },
                    real_estate_agent: {
                        select: { id: true, name: true, avatar: true },
                    },
                },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
            });
            return {
                status: 200,
                channels,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
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
ChannelRealEstateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelRealEstateService);
exports.ChannelRealEstateService = ChannelRealEstateService;
//# sourceMappingURL=channel-real-estate.service.js.map