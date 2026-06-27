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
exports.RealEstateAgentsService = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("../../client/app/client.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
const RealEstateAgentsPostgresqlRepository_1 = require("../repositories/RealEstateAgentsPostgresqlRepository");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const mailerService_1 = require("../../../services/notifications/mailer/mailerService");
const UploadService_1 = require("../../../services/UploadService");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const messages_1 = require("../../../../commons/enums/messages");
const pagination_util_1 = require("../../../../commons/utils/pagination.util");
const messenger_channels_service_1 = require("../../messenger_channels/app/messenger-channels.service");
const Transformer_1 = require("./Transformer");
let RealEstateAgentsService = class RealEstateAgentsService {
    constructor(prismaService, realEstateAgentPostgresRepository, clientService, mailerService, messengerChannelsService, realEstateAgentsTransFormer) {
        this.prismaService = prismaService;
        this.realEstateAgentPostgresRepository = realEstateAgentPostgresRepository;
        this.clientService = clientService;
        this.mailerService = mailerService;
        this.messengerChannelsService = messengerChannelsService;
        this.realEstateAgentsTransFormer = realEstateAgentsTransFormer;
        this.uploadService = new UploadService_1.default();
    }
    async storeRequest(createRealEstateAgentDto, avatar, license) {
        try {
            const client = await this.prismaService.client.findFirst({
                where: { id: Number(createRealEstateAgentDto.user_id) },
            });
            if (!client) {
                return { status: 400 };
            }
            let result = await this.realEstateAgentPostgresRepository.findOne({
                client_id: Number(createRealEstateAgentDto.user_id),
            });
            if (!result) {
                const tracking_code = await this.generateTrackingCode();
                await this.clientService.addRole(createRealEstateAgentDto.user_id, UserTypes_1.default.estate_agent);
                result = await this.realEstateAgentPostgresRepository.create({
                    client_id: Number(createRealEstateAgentDto.user_id),
                    name: createRealEstateAgentDto.name,
                    phone: client.phone,
                    tracking_code,
                    avatar,
                    license,
                    province_id: Number(createRealEstateAgentDto.province_id),
                    city_id: Number(createRealEstateAgentDto.city_id),
                });
            }
            else {
                if (!avatar) {
                    createRealEstateAgentDto.avatar = result.avatar;
                }
                else {
                    createRealEstateAgentDto.avatar = avatar;
                }
                if (!license) {
                    createRealEstateAgentDto.license = result.license;
                }
                else {
                    createRealEstateAgentDto.license = license;
                }
                result = await this.realEstateAgentPostgresRepository.updateOne({ id: Number(result.id) }, {
                    name: createRealEstateAgentDto.name,
                    avatar: createRealEstateAgentDto.avatar,
                    license: createRealEstateAgentDto.license,
                    province_id: Number(createRealEstateAgentDto.province_id),
                    city_id: Number(createRealEstateAgentDto.city_id),
                    status: Statuses_1.default.pending,
                    license_status: Statuses_1.default.pending,
                });
            }
            if (avatar) {
                await this.uploadService.moveFile(avatar, "temp/estate_agents", "estate-agents/avatars/");
            }
            if (license) {
                await this.uploadService.moveFile(license, "temp/estate_agents", "estate-agents/licenses/");
            }
            const response = await this.prismaService.realEstateAgents.findFirst({
                where: { id: result.id },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    validate_phone: true,
                    avatar: true,
                    license: true,
                    license_status: true,
                    status: true,
                    score: true,
                    published_count: true,
                    number_of_ads: true,
                    client_id: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    channels: { select: { id: true, key: true } },
                },
            });
            await this.sendEmailForAdmins();
            return { status: 201, response };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateTrackingCode() {
        const uniqueCode = "REA_" +
            (Math.random() * (9999999999 - 1000000000) + 100000000).toFixed(0);
        const isCodeUnique = await this.prismaService.realEstateAgents.findFirst({
            where: { tracking_code: uniqueCode },
        });
        if (isCodeUnique) {
            return this.generateTrackingCode();
        }
        return uniqueCode;
    }
    async listOfRealEstateAgents(query, clientId) {
        const count = await this.realEstateAgentPostgresRepository.count({
            status: Statuses_1.default.active,
            province_id: Number(query.province_id),
            city_id: Number(query.city_id),
        });
        const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
        const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
        const list = await this.prismaService.realEstateAgents.findMany({
            where: {
                status: Statuses_1.default.active,
                province_id: Number(query.province_id),
                city_id: Number(query.city_id),
            },
            select: {
                id: true,
                name: true,
                client_id: true,
                phone: true,
                validate_phone: true,
                avatar: true,
                license: true,
                license_status: true,
                status: true,
                score: true,
                published_count: true,
                number_of_ads: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                channels: { select: { id: true, key: true } },
            },
            orderBy: { id: "desc" },
            skip: paginationValue.offset,
            take: paginationValue.per_page,
        });
        const presentedAgents = await Promise.all(list.map(async (agent) => {
            const advisor = await this.prismaService.realEstateAdvisors.findFirst({
                where: {
                    real_estate_agent_id: agent.id,
                    permissions: { hasSome: "answer_calls" },
                },
                select: { client: { select: { phone: true } } },
                orderBy: { id: "desc" },
            });
            if (advisor) {
                agent.phone = advisor.client.phone;
            }
            const number_of_ads = await this.prismaService.realEstateAds.count({
                where: {
                    agent_id: agent.id,
                    OR: [
                        { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                        { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                    ],
                    status: Statuses_1.default.approved,
                },
            });
            agent.number_of_ads = number_of_ads;
            const channel = await this.messengerChannelsService.findChannelByClientId(agent.client_id, clientId, "real_estate");
            agent.channel = channel;
            return agent;
        }));
        return {
            list: presentedAgents,
            metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
        };
    }
    async getActiveRealEstates(query) {
        const count = await this.realEstateAgentPostgresRepository.count({
            status: Statuses_1.default.active,
            province_id: Number(query.province_id),
        });
        const { page, per_page, skip } = (0, pagination_util_1.PaginationSolver)({
            per_page: +query.per_page,
            page: +query.page,
        });
        const list = await this.prismaService.realEstateAgents.findMany({
            where: {
                status: Statuses_1.default.active,
                province_id: +query.province_id,
                city_id: +query.city_id,
            },
            select: {
                id: true,
                name: true,
                phone: true,
                validate_phone: true,
                avatar: true,
                license: true,
                license_status: true,
                status: true,
                score: true,
                published_count: true,
                number_of_ads: true,
                client_id: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                channels: { select: { id: true, key: true } },
            },
            orderBy: { published_ad_time: "desc" },
            skip,
            take: per_page,
        });
        const presentedAgents = await Promise.all(list.map(async (agent) => {
            const advisor = await this.prismaService.realEstateAdvisors.findFirst({
                where: {
                    real_estate_agent_id: agent.id,
                    permissions: { hasSome: "answer_calls" },
                },
                select: { client: { select: { phone: true } } },
                orderBy: { id: "desc" },
            });
            if (advisor) {
                agent.phone = advisor.client.phone;
            }
            const number_of_ads = await this.prismaService.realEstateAds.count({
                where: {
                    agent_id: agent.id,
                    OR: [
                        { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                        { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                    ],
                    status: Statuses_1.default.approved,
                },
            });
            agent.number_of_ads = number_of_ads;
            return agent;
        }));
        const transformer = this.realEstateAgentsTransFormer.collection(presentedAgents);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.OkResponse,
            data: {
                data: transformer,
                metadata: (0, pagination_util_1.PaginationGenerator)(page, per_page, count),
            },
        };
    }
    async GetRealEstateAgentInfo(agent_id, client_id) {
        const list = await this.prismaService.realEstateAgents.findMany({
            where: {
                id: Number(agent_id),
            },
            select: {
                id: true,
                name: true,
                phone: true,
                validate_phone: true,
                avatar: true,
                license: true,
                license_status: true,
                status: true,
                score: true,
                published_count: true,
                number_of_ads: true,
                client_id: true,
                province: { select: { id: true, name: true } },
                city: { select: { id: true, name: true } },
                channels: { select: { id: true, key: true } },
            },
            orderBy: { id: "desc" },
        });
        const presentedAgents = await Promise.all(list.map(async (agent) => {
            const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
                where: {
                    agent_id: agent.id,
                    permissions: { hasSome: "answer_calls" },
                },
                select: { client: { select: { phone: true } } },
                orderBy: { id: "desc" },
            });
            if (admin) {
                agent.phone = admin.client.phone;
            }
            const number_of_ads = await this.prismaService.realEstateAds.count({
                where: {
                    agent_id: agent.id,
                    OR: [
                        { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                        { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                    ],
                    status: Statuses_1.default.approved,
                },
            });
            agent.number_of_ads = number_of_ads;
            const channel = await this.messengerChannelsService.findChannelByClientId(agent.client_id, client_id, "real_estate");
            agent.channel = channel;
            return agent;
        }));
        return {
            list: presentedAgents,
        };
    }
    async search(query) {
        const count = await this.realEstateAgentPostgresRepository.count({
            status: Statuses_1.default.active,
            name: {
                contains: query.keyword,
                mode: "insensitive",
            },
            province_id: Number(query.province_id),
            city_id: Number(query.city_id),
        });
        const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
        const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
        const list = await this.realEstateAgentPostgresRepository.findNewItems({
            status: Statuses_1.default.active,
            name: {
                contains: query.keyword,
                mode: "insensitive",
            },
            province_id: Number(query.province_id),
            city_id: Number(query.city_id),
        }, {
            id: true,
            name: true,
            avatar: true,
            license: true,
            license_status: true,
            status: true,
            score: true,
            published_count: true,
            number_of_ads: true,
            client_id: true,
            province: { select: { id: true, name: true } },
            city: { select: { id: true, name: true } },
            channels: { select: { id: true, key: true } },
        }, { offset: paginationValue.offset, per_page: paginationValue.per_page });
        const presentedAgents = await Promise.all(list.map(async (agent) => {
            const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
                where: {
                    agent_id: agent.id,
                    permissions: { hasSome: "answer_calls" },
                },
                select: { client: { select: { phone: true } } },
                orderBy: { id: "desc" },
            });
            if (admin) {
                agent.phone = admin.client.phone;
            }
            const number_of_ads = await this.prismaService.realEstateAds.count({
                where: {
                    agent_id: agent.id,
                    OR: [
                        { seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent },
                        { seller_type: RealEstateAdSellerTypes_1.default.advisor },
                    ],
                    status: Statuses_1.default.approved,
                },
            });
            agent.number_of_ads = number_of_ads;
            return agent;
        }));
        return {
            list: presentedAgents,
            metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
        };
    }
    async findOne(id) {
        try {
            return await this.realEstateAgentPostgresRepository.findOne({
                id: id,
            });
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async updateScore(where, data) {
        try {
            return await this.realEstateAgentPostgresRepository.updateOne(where, data);
        }
        catch (error) {
            return { status: 500 };
        }
    }
    remove(id) {
        return `This action removes a #${id} realEstateAgent`;
    }
    async getUserPermittedAds() {
        const result = await this.prismaService.adminUserRoleCategories.findMany({
            where: {
                key: "real_estate_agents",
                assignedRoles: {
                    some: {
                        role: {
                            isNot: {
                                title: "سوپر ادمین",
                            },
                        },
                    },
                },
            },
            select: {
                assignedRoles: {
                    select: {
                        role: {
                            select: {
                                title: true,
                                userRoles: {
                                    select: {
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                phone: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        let usersPermitted = [];
        result.map((item) => {
            item.assignedRoles.map((role) => {
                if (role.role.title !== "سوپر ادمین") {
                    role.role.userRoles.map((user) => {
                        usersPermitted = [...usersPermitted, user.user];
                    });
                }
            });
        });
        let emailList = [];
        usersPermitted.map((item) => {
            emailList = [...emailList, item.email];
        });
        return emailList;
    }
    async sendEmailForAdmins() {
        const usersPermitted = await this.getUserPermittedAds();
        await this.mailerService.sendBulk({
            body: "درخواست ثبت مشاور املاک دریافت شد. برای بررسی درخواست ها به پنل ادمین آقای ساختمان وارد شوید.",
            subject: "اطلاع رسانی - مشاوران املاک",
            to: usersPermitted,
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
RealEstateAgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        RealEstateAgentsPostgresqlRepository_1.default,
        client_service_1.ClientService,
        mailerService_1.default,
        messenger_channels_service_1.MessengerChannelsService,
        Transformer_1.default])
], RealEstateAgentsService);
exports.RealEstateAgentsService = RealEstateAgentsService;
//# sourceMappingURL=real-estate-agents.service.js.map