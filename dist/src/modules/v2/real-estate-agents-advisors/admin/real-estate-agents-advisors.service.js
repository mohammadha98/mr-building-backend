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
exports.RealEstateAgentsAdvisorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
let RealEstateAgentsAdvisorsService = class RealEstateAgentsAdvisorsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async findAll(query) {
        try {
            const user = await this.prismaService.users.findFirst({
                where: { id: Number(query.client_id) },
            });
            if (!user) {
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
            const advisors = await this.prismaService.realEstateAdvisors.findMany(Object.assign(Object.assign({}, condition), { orderBy: { id: "desc" }, select: {
                    id: true,
                    number_of_ads: true,
                    total_customers: true,
                    score: true,
                    biography: true,
                    comment_visibility: true,
                    avatar: true,
                    status: true,
                    phone: true,
                    validate_phone: true,
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                    real_estate_agent: {
                        select: { id: true, name: true, score: true },
                    },
                } }));
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
            await body.items.map(async (item) => {
                if (body.status === Statuses_1.default.approved) {
                    const comment = await this.prismaService.realEstateAdvisorsComments.findUnique({
                        where: { id: Number(item) },
                    });
                    if (!comment) {
                        return { status: 400 };
                    }
                    const advisorInfo = await this.prismaService.realEstateAdvisors.findFirst({
                        where: { id: comment.advisor_id },
                    });
                    const total_count = await this.prismaService.realEstateAdvisorsComments.count({
                        where: {
                            advisor_id: Number(advisorInfo.id),
                            status: Statuses_1.default.approved,
                        },
                    });
                    const newScore = this.calculateScore(Number(advisorInfo.total_score), Number(comment.score), Number(total_count + 1));
                    await this.prismaService.realEstateAdvisors.update({
                        where: { id: Number(advisorInfo.id) },
                        data: {
                            score: Number(newScore),
                            total_score: Number(comment.score) + Number(advisorInfo.total_score),
                        },
                    });
                }
                await this.prismaService.realEstateAdvisorsComments.update({
                    where: { id: Number(item) },
                    data: { status: body.status },
                });
            });
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    calculateScore(total_score, new_score, total_count) {
        let newScore = 0;
        newScore = (Math.floor(total_score + new_score) / total_count).toFixed(1);
        if (newScore > 5) {
            newScore = 5;
        }
        else if (newScore === 0) {
            newScore = 0;
        }
        return newScore;
    }
    async findComments(query) {
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
            else {
                condition.where = { status: query.status };
            }
            const count = await this.prismaService.realEstateAdvisorsComments.count({
                where: condition.where,
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.prismaService.realEstateAdvisorsComments.findMany({
                where: condition.where,
                orderBy: { id: "desc" },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    comment: true,
                    score: true,
                    created_at: true,
                    status: true,
                    real_estate_advisor: {
                        select: {
                            id: true,
                            client: { select: { name: true, surname: true } },
                        },
                    },
                    client: { select: { name: true, surname: true } },
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
    async findOneByID(item_id) {
        return await this.prismaService.realEstateAdvisors.findFirst({
            where: { id: Number(item_id) },
            select: { id: true, client: { select: { name: true, surname: true } } },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RealEstateAgentsAdvisorsService);
exports.RealEstateAgentsAdvisorsService = RealEstateAgentsAdvisorsService;
//# sourceMappingURL=real-estate-agents-advisors.service.js.map