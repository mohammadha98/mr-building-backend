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
const client_service_1 = require("../../client/admin/client.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const list_real_estate_agent_dto_1 = require("./dto/list-real-estate-agent.dto");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Templates_1 = require("../../../../commons/contracts/Templates");
const RealEstateAgentsPostgresqlRepository_1 = require("../repositories/RealEstateAgentsPostgresqlRepository");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../../real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository");
const channel_real_estate_service_1 = require("../../channel-real-estate/app/channel-real-estate.service");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const RealEstateAdsPostgresqlRepository_1 = require("../../real-estate-ads/repositories/RealEstateAdsPostgresqlRepository");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const client_list_dto_1 = require("../../client/admin/dto/client-list.dto");
const messages_1 = require("../../../../commons/enums/messages");
const messenger_channels_service_1 = require("../../messenger_channels/app/messenger-channels.service");
const UploadService_1 = require("../../../services/UploadService");
const MessengerChannelTypes_1 = require("../../../../commons/contracts/MessengerChannelTypes");
let RealEstateAgentsService = class RealEstateAgentsService {
    constructor(prismaService, realEstateAgentPostgresRepository, commentsPostgresqlRepository, clientService, channelRealEstateService, realEstateAdsPostgresqlRepository, messengerChannelsService) {
        this.prismaService = prismaService;
        this.realEstateAgentPostgresRepository = realEstateAgentPostgresRepository;
        this.commentsPostgresqlRepository = commentsPostgresqlRepository;
        this.clientService = clientService;
        this.channelRealEstateService = channelRealEstateService;
        this.realEstateAdsPostgresqlRepository = realEstateAdsPostgresqlRepository;
        this.messengerChannelsService = messengerChannelsService;
        this.smsService = new SmsService_1.default();
        this.uploadService = new UploadService_1.default();
    }
    async listOfRealEstateAgents(query) {
        console.log("listOfRealEstateAgents");
        console.log(query);
        try {
            let condition = {};
            if (query.type === client_list_dto_1.GetTypes.search) {
                condition = {
                    OR: [
                        {
                            name: {
                                contains: query.keyword,
                                mode: "insensitive",
                            },
                        },
                        {
                            client: {
                                name: {
                                    contains: query.keyword,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            client: {
                                surname: {
                                    contains: query.keyword,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            client: {
                                phone: {
                                    contains: query.keyword,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                };
            }
            if (query.status === Statuses_1.default.pending) {
                condition = {
                    status: Statuses_1.default.inactive,
                    license_status: Statuses_1.default.pending,
                };
            }
            else if (query.status === Statuses_1.default.active) {
                condition = {
                    status: Statuses_1.default.active,
                    license_status: Statuses_1.default.approved,
                };
            }
            else if (query.status === Statuses_1.default.inactive) {
                condition = {
                    status: Statuses_1.default.inactive,
                };
            }
            else if (query.status === Statuses_1.default.rejected) {
                condition = {
                    status: Statuses_1.default.inactive,
                    license_status: Statuses_1.default.rejected,
                };
            }
            else if (query.status === Statuses_1.default.approved) {
                condition = {
                    status: Statuses_1.default.active,
                    license_status: Statuses_1.default.approved,
                };
            }
            if (query.province_id) {
                condition = Object.assign(Object.assign({}, condition), { province_id: Number(query.province_id) });
            }
            let orderBy = {};
            if (query.sort == list_real_estate_agent_dto_1.RealEstateAgentSort.newest) {
                orderBy = {
                    created_at: "desc",
                };
            }
            else if (query.sort == list_real_estate_agent_dto_1.RealEstateAgentSort.oldest) {
                orderBy = {
                    created_at: "asc",
                };
            }
            console.log("condition ", condition);
            const count = await this.realEstateAgentPostgresRepository.count(condition);
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const list = await this.prismaService.realEstateAgents.findMany({
                where: Object.assign({}, condition),
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    license: true,
                    license_status: true,
                    status: true,
                    score: true,
                    published_count: true,
                    client_id: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                    created_at: true,
                },
                orderBy,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            return {
                status: 200,
                list,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async changeStatus(query) {
        try {
            let status = Statuses_1.default.inactive;
            let license_status = Statuses_1.default.rejected;
            const estate_agent = await this.realEstateAgentPostgresRepository.findOne({
                id: Number(query.item_id),
            });
            const owner = await this.clientService.findOneByID(Number(estate_agent.client_id));
            if (query.status === Statuses_1.default.approved) {
                await this.realEstateAgentPostgresRepository.updateOne({ id: Number(query.item_id) }, { status: Statuses_1.default.active, license_status: Statuses_1.default.approved });
                status = Statuses_1.default.active;
                license_status = Statuses_1.default.approved;
                if (!owner.roles.includes(UserTypes_1.default.estate_agent)) {
                    await this.clientService.updateOne({ id: owner.id }, { roles: { push: [UserTypes_1.default.estate_agent] } });
                }
                await this.smsService.send({
                    recipient: owner.phone,
                    templateID: Number(Templates_1.default.approved_estate_license),
                    parameterKey: "ESTATE_AGENT_NAME",
                    message: estate_agent.name,
                });
                console.log("estate_agent.avatar ", estate_agent.avatar);
                await this.createChannelForRealEstate(owner.id, estate_agent.name, estate_agent.avatar);
            }
            else {
                await this.messengerChannelsService.changeStatusForChannel(owner.id, Statuses_1.default.inactive);
                await this.realEstateAgentPostgresRepository.updateOne({ id: Number(query.item_id) }, { status: Statuses_1.default.inactive, license_status: Statuses_1.default.rejected });
            }
            return { status: 200, client_status: status, license_status };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async createChannelForRealEstate(owner_id, real_estate_name, real_estat_avatar) {
        const checkExistChannel = await this.prismaService.messengerChannels.findFirst({
            where: {
                tag: "real_estate",
                owner_id,
            },
        });
        if (!checkExistChannel) {
            let newAvatar = null;
            if (real_estat_avatar) {
                const channelAvatar = await this.uploadService.copyFile(`estate-agents/avatars/${real_estat_avatar}`, `temp/files/`, real_estat_avatar);
                if (channelAvatar) {
                    newAvatar = channelAvatar.split("/")[7];
                }
                newAvatar = "";
            }
            await this.messengerChannelsService.createChannel({
                avatar: newAvatar,
                tag: "real_estate",
                type: MessengerChannelTypes_1.default.public,
                client_id: owner_id,
                title: real_estate_name,
                description: real_estate_name,
                channel_id: null,
            });
        }
        await this.messengerChannelsService.changeStatusForChannel(owner_id, Statuses_1.default.active);
    }
    async CreateChannelForOldRealEstates_test() {
        const realEstates = await this.prismaService.realEstateAgents.findMany();
        await Promise.all(realEstates.map(async (item) => {
            await this.createChannelForRealEstate(item.client_id, item.name, item.avatar);
        }));
    }
    async findOneByID(item_id) {
        return await this.prismaService.realEstateAgents.findFirst({
            where: { id: Number(item_id) },
            select: { id: true, name: true },
        });
    }
    async findAds(agent_id, query) {
        try {
            console.log("*** RealEstateAgent Ads: Admin ***");
            console.log({ agent_id });
            const count = await this.realEstateAdsPostgresqlRepository.count({
                where: {
                    agent_id: Number(agent_id),
                    OR: [
                        {
                            seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent,
                        },
                        {
                            seller_type: RealEstateAdSellerTypes_1.default.advisor,
                        },
                    ],
                },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            let result = await this.realEstateAdsPostgresqlRepository.findMany({
                where: {
                    agent_id: Number(agent_id),
                    OR: [
                        {
                            seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent,
                        },
                        {
                            seller_type: RealEstateAdSellerTypes_1.default.advisor,
                        },
                    ],
                },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    category: { select: { id: true, title: true, type: true } },
                    subCategory: { select: { id: true, title: true } },
                    title: true,
                    status: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    agent_id: true,
                    advisor_id: true,
                    seller_type: true,
                    tracking_code: true,
                    sale_price: true,
                    deposit_price: true,
                    rent_price: true,
                    number_of_rooms: true,
                    max_capicity: true,
                    created_at: true,
                    area: true,
                    media: {
                        where: {
                            file_type: RealEstateAdMediaType_1.default.image,
                            priority: RealEstateAdMediaTypePriorities_1.default.primary,
                        },
                        select: {
                            id: true,
                            file_name: true,
                            file_type: true,
                            sort_number: true,
                            priority: true,
                        },
                    },
                },
            });
            if (!result) {
                return { status: 400 };
            }
            result = await Promise.all(result.map(async (item) => {
                return await this.getAdOwnerInfo(item);
            }));
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findAdvisors(agent_id) {
        try {
            const agentInfo = await this.prismaService.realEstateAgents.findUnique({
                where: { id: Number(agent_id) },
            });
            if (!agentInfo) {
                return { status: 400 };
            }
            const advisors = await this.prismaService.realEstateAdvisors.findMany({
                where: { real_estate_agent_id: Number(agent_id) },
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    number_of_ads: true,
                    total_customers: true,
                    score: true,
                    biography: true,
                    comment_visibility: true,
                    avatar: true,
                    status: true,
                    permissions: true,
                    phone: true,
                    validate_phone: true,
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                    real_estate_agent: {
                        select: { id: true, name: true, score: true },
                    },
                },
            });
            return {
                status: 200,
                advisors,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findAdmins(agent_id) {
        try {
            const agentInfo = await this.prismaService.realEstateAgents.findUnique({
                where: { id: Number(agent_id) },
            });
            if (!agentInfo) {
                return { status: 400 };
            }
            const admins = await this.prismaService.realEstateAgentAdmins.findMany({
                where: { agent_id: Number(agent_id) },
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    permissions: true,
                    color: true,
                    client: {
                        select: {
                            id: true,
                            name: true,
                            surname: true,
                            phone: true,
                            status: true,
                        },
                    },
                    real_estate_agent: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            number_of_ads: true,
                            score: true,
                            province: { select: { name: true } },
                        },
                    },
                },
            });
            return {
                status: 200,
                admins,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findAllComments(agent_id, query) {
        try {
            const count = await this.commentsPostgresqlRepository.count({
                where: { agent_id: Number(agent_id) },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.commentsPostgresqlRepository.findMany({
                where: { agent_id: Number(agent_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    agent_id: true,
                    comment: true,
                    score: true,
                    status: true,
                    created_at: true,
                    client: { select: { id: true, name: true, surname: true } },
                    real_estate_agent: { select: { id: true, name: true, avatar: true } },
                },
            });
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async makeTrackingCode() {
        console.log("Make trackingCode for realEstateAgents");
        const agents = await this.prismaService.realEstateAgents.findMany({
            where: { tracking_code: null },
        });
        agents.map(async (item) => {
            const tracking_code = await this.generateTrackingCode();
            await this.prismaService.realEstateAgents.update({
                where: { id: item.id },
                data: {
                    tracking_code,
                },
            });
        });
        return {
            status: 200,
        };
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
    async getAdOwnerInfo(ad) {
        const adInfo = ad;
        adInfo.owner_info = null;
        if (ad.seller_type === RealEstateAdSellerTypes_1.default.real_estate_agent) {
            const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                where: { id: ad.agent_id },
                select: { name: true, avatar: true },
            });
            adInfo.owner_info = {
                name: agentInfo.name,
                avatar: agentInfo.avatar
                    ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${agentInfo.avatar}`
                    : "",
            };
        }
        else if (ad.seller_type === RealEstateAdSellerTypes_1.default.advisor) {
            const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                where: { id: ad.advisor_id },
                select: {
                    real_estate_agent: { select: { name: true, avatar: true } },
                },
            });
            adInfo.owner_info = {
                name: advisorInfo.real_estate_agent.name,
                avatar: advisorInfo.real_estate_agent.avatar
                    ? `${process.env.APP_CONTENT_PATH}/estate-agents/avatars/${advisorInfo.real_estate_agent.avatar}`
                    : "",
            };
        }
        return adInfo;
    }
    async removeAdvisorInRealEstate(body) {
        const advisor = await this.prismaService.realEstateAdvisors.findFirst({
            where: {
                id: Number(body.advisor_id),
                real_estate_agent_id: Number(body.agent_id),
            },
            select: {
                id: true,
                client: { select: { id: true } },
                real_estate_agent: {
                    select: {
                        id: true,
                        client: { select: { id: true } },
                        tracking_code: true,
                    },
                },
            },
        });
        if (!advisor) {
            throw new common_1.BadRequestException();
        }
        await this.prismaService.realEstateAdvisorsActiveAreas.deleteMany({
            where: { advisor_id: Number(body.advisor_id) },
        });
        await this.prismaService.realEstateAdvisorsFilteredWords.deleteMany({
            where: { advisor_id: Number(body.advisor_id) },
        });
        await this.prismaService.realEstateAdvisorsComments.deleteMany({
            where: { advisor_id: Number(body.advisor_id) },
        });
        await this.prismaService.realEstateAdvisors.delete({
            where: {
                id: Number(body.advisor_id),
            },
        });
        await this.clientService.removeRole(advisor.client.id, UserTypes_1.default.advisor);
        await this.prismaService.realEstateAds.updateMany({
            where: {
                advisor_id: Number(body.advisor_id),
                seller_type: UserTypes_1.default.advisor,
            },
            data: {
                seller_type: RealEstateAdSellerTypes_1.default.real_estate_agent,
                advisor_id: 0,
            },
        });
        await this.prismaService.chatRealEstateHistory.updateMany({
            where: { participant_id: advisor.id },
            data: { participant_id: advisor.real_estate_agent.client.id },
        });
        return { statusCode: 200, message: messages_1.PublicMessage.OkResponse };
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
        RealEstateAgentsCommentsPostgresqlRepository_1.default,
        client_service_1.ClientService,
        channel_real_estate_service_1.ChannelRealEstateService,
        RealEstateAdsPostgresqlRepository_1.default,
        messenger_channels_service_1.MessengerChannelsService])
], RealEstateAgentsService);
exports.RealEstateAgentsService = RealEstateAgentsService;
//# sourceMappingURL=real-estate-agents.service.js.map