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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const webinar_service_1 = require("../../webinar/app/webinar.service");
const event_rooms_service_1 = require("../../event-rooms/app/event-rooms.service");
const event_groups_service_1 = require("../../events/group/app/event-groups.service");
const real_estate_agents_service_1 = require("../../real-estate-agents/admin/real-estate-agents.service");
const real_estate_agents_advisors_service_1 = require("../../real-estate-agents-advisors/admin/real-estate-agents-advisors.service");
const channel_real_estate_service_1 = require("../../channel-real-estate/app/channel-real-estate.service");
const chat_real_estate_service_1 = require("../../chat-real-estate/app/chat-real-estate.service");
const ViolationTypes_1 = require("../../../../commons/contracts/ViolationTypes");
const real_estate_ads_service_1 = require("../../real-estate-ads/admin/real-estate-ads.service");
let ReportService = class ReportService {
    constructor(prismaService, webinarService, eventRoomsService, eventGroupsService, realEstateAgentsService, realEstateAdsService, realEstateAgentsAdvisorsService, channelRealEstateService, chatRealEstateService) {
        this.prismaService = prismaService;
        this.webinarService = webinarService;
        this.eventRoomsService = eventRoomsService;
        this.eventGroupsService = eventGroupsService;
        this.realEstateAgentsService = realEstateAgentsService;
        this.realEstateAdsService = realEstateAdsService;
        this.realEstateAgentsAdvisorsService = realEstateAgentsAdvisorsService;
        this.channelRealEstateService = channelRealEstateService;
        this.chatRealEstateService = chatRealEstateService;
    }
    async getAll(query) {
        try {
            const user = await this.prismaService.users.findUnique({
                where: { id: Number(query.user_id) },
            });
            if (!user) {
                return { status: 403 };
            }
            const count = await this.prismaService.reportBugs.count({});
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const list = await this.prismaService.reportBugs.findMany({
                select: {
                    id: true,
                    content: true,
                    image: true,
                    voice: true,
                    type: true,
                    created_at: true,
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                },
                orderBy: { id: "desc" },
                take: paginationValue.per_page,
                skip: paginationValue.offset,
            });
            return {
                status: 200,
                list,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async getAllViolations(query) {
        try {
            const user = await this.prismaService.users.findUnique({
                where: { id: Number(query.user_id) },
            });
            if (!user) {
                return { status: 403 };
            }
            const count = await this.prismaService.reportViolations.count({
                where: { type: query.type },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            console.log(count);
            const list = await this.prismaService.reportViolations.findMany({
                where: { type: query.type },
                select: {
                    id: true,
                    item_id: true,
                    description: true,
                    type: true,
                    created_at: true,
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                },
                orderBy: { id: "desc" },
                take: paginationValue.per_page,
                skip: paginationValue.offset,
            });
            const transformer = await this.reportViolationTransform(list, query.type);
            return {
                status: 200,
                transformer,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async reportViolationTransform(violations, type) {
        let result;
        if (type === ViolationTypes_1.default.webinars) {
            result = await this.getWebinarInfo(violations);
        }
        else if (type === ViolationTypes_1.default.event_rooms) {
            result = await this.getEventRoomInfo(violations);
        }
        else if (type === ViolationTypes_1.default.event_groups) {
            result = await this.getEventGroupInfo(violations);
        }
        else if (type === ViolationTypes_1.default.real_estate_agents) {
            result = await this.getRealEstateAgentInfo(violations);
        }
        else if (type === ViolationTypes_1.default.real_estate_agent_ads) {
            result = await this.getRealEstateAdsInfo(violations);
        }
        else if (type === ViolationTypes_1.default.real_estate_agent_advisors) {
            result = await this.getRealEstateAdvisorsInfo(violations);
        }
        else if (type === ViolationTypes_1.default.real_estate_agent_channels) {
            result = await this.getRealEstateChannelsInfo(violations);
        }
        else if (type === ViolationTypes_1.default.real_estate_agent_channel_messages) {
            result = await this.getRealEstateChannelsMessagesInfo(violations);
        }
        return result;
    }
    async getWebinarInfo(items) {
        console.log("getWebinarInfo");
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const webinarInfo = await this.webinarService.findOneByID(Number(item.item_id));
            itemInfo.item_info = webinarInfo;
            return itemInfo;
        }));
        return result;
    }
    async getEventRoomInfo(items) {
        console.log("getEventRoomInfo");
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const eventRoomInfo = await this.eventRoomsService.findOneByID(Number(item.item_id));
            itemInfo.item_info = eventRoomInfo;
            return itemInfo;
        }));
        return result;
    }
    async getEventGroupInfo(items) {
        console.log("getEventGroupInfo");
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const eventGroupInfo = await this.eventGroupsService.findOneByID(Number(item.item_id));
            itemInfo.item_info = eventGroupInfo;
            return itemInfo;
        }));
        return result;
    }
    async getRealEstateAgentInfo(items) {
        console.log("getRealEstateAgentInfo");
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const agentInfoInfo = await this.realEstateAgentsService.findOneByID(Number(item.item_id));
            itemInfo.item_info = {
                id: agentInfoInfo.id,
                title: agentInfoInfo.name,
            };
            return itemInfo;
        }));
        return result;
    }
    async getRealEstateAdsInfo(items) {
        console.log("getRealEstateAdsInfo");
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const adInfo = await this.realEstateAdsService.findOneByID(Number(item.item_id));
            itemInfo.item_info = adInfo;
            return itemInfo;
        }));
        return result;
    }
    async getRealEstateAdvisorsInfo(items) {
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const advisorInfo = await this.realEstateAgentsAdvisorsService.findOneByID(Number(item.item_id));
            itemInfo.item_info = {
                id: advisorInfo.id,
                title: advisorInfo.client.name + " " + advisorInfo.client.surname,
            };
            return itemInfo;
        }));
        return result;
    }
    async getRealEstateChannelsInfo(items) {
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const channelInfo = await this.channelRealEstateService.findOneByID(Number(item.item_id));
            itemInfo.item_info = {
                id: channelInfo.real_estate_agent.id,
                title: channelInfo.real_estate_agent.name,
            };
            return itemInfo;
        }));
        return result;
    }
    async getRealEstateChannelsMessagesInfo(items) {
        const result = await Promise.all(items.map(async (item) => {
            const itemInfo = item;
            const messageInfo = await this.channelRealEstateService.findMessagesByID(Number(item.item_id));
            itemInfo.item_info = {
                id: messageInfo.id,
                title: messageInfo.content,
            };
            return itemInfo;
        }));
        return result;
    }
    async single(query) {
        try {
            const client = await this.prismaService.client.findUnique({
                where: { id: Number(query.client_id) },
            });
            if (!client) {
                return { status: 403 };
            }
            const item = await this.prismaService.reportBugs.findFirst({
                where: { id: Number(query.id) },
                select: {
                    id: true,
                    content: true,
                    image: true,
                    type: true,
                    voice: true,
                    created_at: true,
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                },
            });
            return {
                status: 200,
                item,
            };
        }
        catch (error) {
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
ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        webinar_service_1.WebinarService,
        event_rooms_service_1.EventRoomsService,
        event_groups_service_1.eventGroupsService,
        real_estate_agents_service_1.RealEstateAgentsService,
        real_estate_ads_service_1.RealEstateAdsService,
        real_estate_agents_advisors_service_1.RealEstateAgentsAdvisorsService,
        channel_real_estate_service_1.ChannelRealEstateService,
        chat_real_estate_service_1.ChatRealEstateService])
], ReportService);
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map