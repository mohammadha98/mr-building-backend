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
exports.RealEstateAgentsAdvisorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const client_service_1 = require("../../client/app/client.service");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const RealEstateAdSellerTypes_1 = require("../../../../commons/contracts/RealEstateAdSellerTypes");
const cache_manager_1 = require("@nestjs/cache-manager");
const Transformer_1 = require("./Transformer");
const Templates_1 = require("../../../../commons/contracts/Templates");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const ClientRoles_1 = require("../../../../commons/contracts/ClientRoles");
const messages_1 = require("../../../../commons/enums/messages");
let RealEstateAgentsAdvisorsService = class RealEstateAgentsAdvisorsService {
    constructor(cacheManager, prismaService, realEstateAdvisorTransformer, clientService, smsService) {
        this.cacheManager = cacheManager;
        this.prismaService = prismaService;
        this.realEstateAdvisorTransformer = realEstateAdvisorTransformer;
        this.clientService = clientService;
        this.smsService = smsService;
    }
    async validate(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const user = await this.clientService.findOne(body.phone);
            if (!user) {
                return { status: 200, result: "not_found", user: null };
            }
            const userTransform = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                phone: user.phone,
            };
            if (user.roles.includes(UserTypes_1.default.advisor)) {
                return { status: 200, result: "busy", user: userTransform };
            }
            else if (user.roles.includes(UserTypes_1.default.estate_agent)) {
                return { status: 200, result: "estate_agent", user: userTransform };
            }
            else if (user.roles.includes(UserTypes_1.default.admin)) {
                return { status: 200, result: "admin", user: userTransform };
            }
            else if (user.roles.includes(ClientRoles_1.default.operator_estate_agent)) {
                return {
                    status: 200,
                    result: ClientRoles_1.default.operator_estate_agent,
                    user: userTransform,
                };
            }
            return { status: 200, result: "free", user: userTransform };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async storeActiveArea(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({ where: { id: Number(body.advisor_id) } });
            if (!advisorInfo) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdvisorsActiveAreas.create({
                data: {
                    title: body.title,
                    advisor: {
                        connect: { id: advisorInfo.id },
                    },
                },
            });
            const activeAreas = await this.prismaService.realEstateAdvisorsActiveAreas.findMany({
                where: { advisor_id: advisorInfo.id },
                select: {
                    id: true,
                    title: true,
                },
                orderBy: { id: "desc" },
            });
            return { status: 201, active_areas: activeAreas };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async storeFilteredWord(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({ where: { id: Number(body.advisor_id) } });
            if (!advisorInfo) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdvisorsFilteredWords.create({
                data: {
                    title: body.title,
                    advisor: {
                        connect: { id: advisorInfo.id },
                    },
                },
            });
            const filteredWords = await this.prismaService.realEstateAdvisorsFilteredWords.findMany({
                where: { advisor_id: advisorInfo.id },
                select: {
                    id: true,
                    title: true,
                },
                orderBy: { id: "desc" },
            });
            return { status: 201, filtered_words: filteredWords };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async removeActiveArea(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            await this.prismaService.realEstateAdvisorsActiveAreas.delete({
                where: {
                    id: Number(body.active_area_id),
                },
            });
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async removeFilteredWord(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            await this.prismaService.realEstateAdvisorsFilteredWords.delete({
                where: {
                    id: Number(body.item_id),
                },
            });
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async getActiveAreas(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const adviserInfo = await this.prismaService.realEstateAdvisors.findUnique({
                where: { id: Number(query.advisor_id) },
            });
            if (!adviserInfo) {
                return { status: 400 };
            }
            const result = await this.prismaService.realEstateAdvisorsActiveAreas.findMany({
                where: { advisor_id: Number(query.advisor_id) },
                orderBy: { id: "desc" },
            });
            return { status: 200, result };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async getFilteredWords(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const adviserInfo = await this.prismaService.realEstateAdvisors.findUnique({
                where: { id: Number(query.advisor_id) },
            });
            if (!adviserInfo) {
                return { status: 400 };
            }
            const result = await this.prismaService.realEstateAdvisorsFilteredWords.findMany({
                where: { advisor_id: Number(query.advisor_id) },
                orderBy: { id: "desc" },
            });
            return { status: 200, result };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async create(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const user = await this.clientService.findOne(body.phone);
            if (!user) {
                return { status: 200, result: "not_found" };
            }
            if (user.roles.includes(UserTypes_1.default.advisor)) {
                return { status: 200, result: "busy" };
            }
            else if (user.roles.includes(UserTypes_1.default.estate_agent)) {
                return { status: 200, result: "estate_agent" };
            }
            const validateAdvisor = await this.prismaService.realEstateAdvisors.findFirst({
                where: { client_id: Number(user.id) },
            });
            if (!validateAdvisor) {
                const advisor = await this.prismaService.realEstateAdvisors.create({
                    data: {
                        phone: body.phone,
                        real_estate_agent: { connect: { id: Number(body.agent_id) } },
                        client: { connect: { id: user.id } },
                        permissions: body.permissions,
                    },
                    select: { id: true },
                });
                await this.clientService.addRole(Number(user.id), UserTypes_1.default.advisor);
                const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                    where: { id: Number(body.agent_id) },
                });
                await this.smsService.send({
                    message: agentInfo.name,
                    templateID: Number(Templates_1.default.verify_real_estate_advisor),
                    recipient: body.phone,
                    parameterKey: "text",
                });
                return { status: 201, result: "created", advisor };
            }
            return { status: 200, result: "busy" };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async updatePermissions(body) {
        const validateAdvisor = await this.prismaService.realEstateAdvisors.findFirst({
            where: { id: body.advisor_id },
        });
        if (!validateAdvisor) {
            throw new common_1.BadRequestException("خطا. کارشناس موردنظر یافت نشد.");
        }
        await this.prismaService.realEstateAdvisors.update({
            where: { id: Number(body.advisor_id) },
            data: {
                permissions: body.permissions,
            },
        });
        return { statusCode: 200, message: messages_1.PublicMessage.OkResponse };
    }
    async findAll(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const agentInfo = await this.prismaService.realEstateAgents.findUnique({
                where: { id: Number(query.agent_id) },
            });
            if (!agentInfo) {
                return { status: 400 };
            }
            let condition = {};
            if (query.status === Statuses_1.default.active) {
                condition = {
                    where: {
                        real_estate_agent_id: Number(query.agent_id),
                        status: Statuses_1.default.active,
                    },
                };
            }
            else {
                condition = {
                    where: {
                        real_estate_agent_id: Number(query.agent_id),
                    },
                };
            }
            const resourceKey = this.generateRedisKey(query);
            let advisors = await this.cacheManager.get(resourceKey);
            if (!advisors) {
                const result = await this.prismaService.realEstateAdvisors.findMany(Object.assign(Object.assign({}, condition), { orderBy: { id: "desc" }, select: {
                        id: true,
                        number_of_ads: true,
                        total_customers: true,
                        score: true,
                        biography: true,
                        comment_visibility: true,
                        avatar: true,
                        status: true,
                        phone: true,
                        color: true,
                        permissions: true,
                        validate_phone: true,
                        client: {
                            select: { id: true, name: true, surname: true, phone: true },
                        },
                        real_estate_agent: {
                            select: { id: true, name: true, score: true },
                        },
                    } }));
                advisors = this.realEstateAdvisorTransformer.collection(result);
                if (result.length) {
                    await this.cacheManager.set(resourceKey, advisors);
                }
            }
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
    async changeStatus(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const advisor = await this.prismaService.realEstateAdvisors.findFirst({
                where: { id: Number(body.advisor_id) },
            });
            if (!advisor) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdvisors.update({
                where: { id: Number(body.advisor_id) },
                data: { status: body.status },
            });
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async removeAdvisor(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            await this.removeAdvisorInRealEstate(body);
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async removeAdvisorInRealEstate(body) {
        try {
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
                return { status: 400 };
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
            const realEstateTrackingCode = advisor.real_estate_agent.tracking_code;
            return { status: 200, realEstateTrackingCode };
        }
        catch (e) {
            console.log(e);
            return { status: 500 };
        }
    }
    async storeComment(body) {
        try {
            const client = await this.clientService.validateWithID(Number(Number(body.client_id)));
            if (!client) {
                return { status: 403 };
            }
            const advisorInfo = await this.prismaService.realEstateAdvisors.findUnique({
                where: { id: Number(body.advisor_id) },
            });
            if (!advisorInfo) {
                return { status: 400 };
            }
            const comment_submitted = await this.prismaService.realEstateAdvisorsComments.findFirst({
                where: {
                    client_id: body.client_id,
                    advisor_id: Number(body.advisor_id),
                },
                select: {
                    id: true,
                    comment: true,
                    score: true,
                    status: true,
                    created_at: true,
                    client: { select: { id: true, name: true, surname: true } },
                },
            });
            if (comment_submitted) {
                return { status: 200, result: comment_submitted };
            }
            const filteredComment = await this.filteredComment(body.comment, body.advisor_id);
            let is_blocked = false;
            console.log("*** store comment for Advisor: filteredComment ***");
            console.log(filteredComment);
            let result = null;
            if (filteredComment.length > 0) {
                is_blocked = true;
            }
            if (!is_blocked) {
                result = await this.prismaService.realEstateAdvisorsComments.create({
                    data: {
                        real_estate_advisor: { connect: { id: Number(body.advisor_id) } },
                        comment: body.comment,
                        score: Number(body.score),
                        client: { connect: { id: Number(body.client_id) } },
                    },
                    select: {
                        id: true,
                        comment: true,
                        score: true,
                        status: true,
                        created_at: true,
                        client: { select: { id: true, name: true, surname: true } },
                    },
                });
            }
            return { status: 201, result, is_blocked };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async filteredComment(comment, advisor_id) {
        const words = comment.trim().split(" ");
        const filteredComment = [];
        await Promise.all(words.map(async (word) => {
            const validateWord = await this.prismaService.realEstateAdvisorsFilteredWords.findFirst({
                where: {
                    title: { contains: word, mode: "insensitive", not: " " },
                    advisor_id: Number(advisor_id),
                },
            });
            if (validateWord) {
                filteredComment.push(word);
            }
        }));
        return filteredComment;
    }
    async findComments(query) {
        try {
            const client = await this.clientService.validateWithID(Number(Number(query.client_id)));
            if (!client) {
                return { status: 403 };
            }
            const advisorInfo = await this.prismaService.realEstateAdvisors.findUnique({
                where: { id: Number(query.advisor_id) },
            });
            if (!advisorInfo) {
                return { status: 400 };
            }
            const condition = { where: {} };
            if (query.status !== Statuses_1.default.all) {
                condition.where = {
                    advisor_id: Number(query.advisor_id),
                    status: query.status,
                    NOT: {
                        client_id: Number(query.client_id),
                    },
                };
            }
            else {
                condition.where = { advisor_id: Number(query.advisor_id) };
            }
            const count = await this.prismaService.realEstateAdvisorsComments.count({
                where: condition.where,
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const comment_submitted = await this.prismaService.realEstateAdvisorsComments.findFirst({
                where: {
                    client_id: query.client_id,
                    advisor_id: Number(query.advisor_id),
                },
                select: {
                    id: true,
                    comment: true,
                    score: true,
                    created_at: true,
                    status: true,
                    client: { select: { id: true, name: true, surname: true } },
                },
            });
            const result = await this.prismaService.realEstateAdvisorsComments.findMany({
                where: condition.where,
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    comment: true,
                    score: true,
                    created_at: true,
                    status: true,
                    client: { select: { id: true, name: true, surname: true } },
                },
            });
            return {
                status: 200,
                result,
                statistics: {
                    total_comments: count,
                    total_score: advisorInfo.score,
                },
                user_comment: comment_submitted,
                comment_submitted: comment_submitted ? true : false,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async deleteCommentForAdvisor(query) {
        const comment = await this.prismaService.realEstateAgentComments.findFirst({
            where: { id: +query.comment_id },
        });
        if (!comment) {
            throw new common_1.BadRequestException();
        }
        await this.prismaService.realEstateAdvisorsComments.deleteMany({
            where: { id: +query.comment_id, advisor_id: +query.item_id },
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.Deleted,
            data: {},
        };
    }
    async saveSettings(body) {
        try {
            const client = await this.clientService.validateWithID(Number(Number(body.client_id)));
            if (!client) {
                return { status: 403 };
            }
            const advisorInfo = await this.prismaService.realEstateAdvisors.findUnique({
                where: { id: Number(body.advisor_id) },
            });
            if (!advisorInfo) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdvisors.update({
                where: { id: Number(body.advisor_id) },
                data: {
                    comment_visibility: body.comment_visibility,
                },
            });
            return {
                status: 200,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async updateProfile(body) {
        try {
            const client = await this.clientService.validateWithID(Number(Number(body.client_id)));
            if (!client) {
                return { status: 403 };
            }
            const advisorInfo = await this.prismaService.realEstateAdvisors.findUnique({
                where: { id: Number(body.advisor_id) },
            });
            if (!advisorInfo) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAdvisors.update({
                where: { id: Number(body.advisor_id) },
                data: {
                    biography: body.bio,
                },
            });
            return {
                status: 200,
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
    generateRedisKey(query) {
        const resourceKey = `get_real_estate_agents_advisors_status_${query.status}_agentId_${query.agent_id}_clientId_${query.client_id}`;
        console.log("* resourceKey *");
        console.log(resourceKey);
        return resourceKey;
    }
};
RealEstateAgentsAdvisorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default,
        client_service_1.ClientService,
        SmsService_1.default])
], RealEstateAgentsAdvisorsService);
exports.RealEstateAgentsAdvisorsService = RealEstateAgentsAdvisorsService;
//# sourceMappingURL=real-estate-agents-advisors.service.js.map