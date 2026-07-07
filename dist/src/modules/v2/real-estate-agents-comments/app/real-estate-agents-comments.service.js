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
exports.RealEstateAgentsCommentsService = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("../../client/app/client.service");
const RealEstateAgentsCommentsPostgresqlRepository_1 = require("../repositories/RealEstateAgentsCommentsPostgresqlRepository");
const real_estate_agents_service_1 = require("../../real-estate-agents/app/real-estate-agents.service");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const messages_1 = require("../../../../commons/enums/messages");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
let RealEstateAgentsCommentsService = class RealEstateAgentsCommentsService {
    constructor(commentsPostgresqlRepository, agentsService, clientService, prismaService) {
        this.commentsPostgresqlRepository = commentsPostgresqlRepository;
        this.agentsService = agentsService;
        this.clientService = clientService;
        this.prismaService = prismaService;
    }
    async storeComment(body) {
        try {
            const client = await this.clientService.validateWithID(Number(Number(body.client_id)));
            if (!client) {
                return { status: 403 };
            }
            const agentInfo = await this.agentsService.findOne(Number(body.agent_id));
            if (!agentInfo) {
                return { status: 400 };
            }
            const comment_submitted = await this.commentsPostgresqlRepository.findOne({
                where: {
                    client_id: body.client_id,
                    agent_id: Number(body.agent_id),
                },
                select: {
                    id: true,
                    agent_id: true,
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
            const result = await this.commentsPostgresqlRepository.create({
                data: {
                    real_estate_agent: { connect: { id: Number(body.agent_id) } },
                    comment: body.comment,
                    score: Number(body.score),
                    client: { connect: { id: Number(body.client_id) } },
                },
                select: {
                    id: true,
                    agent_id: true,
                    comment: true,
                    score: true,
                    created_at: true,
                    client: { select: { id: true, name: true, surname: true } },
                },
            });
            return { status: 201, result };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findComments(query) {
        try {
            const client = await this.clientService.validateWithID(Number(Number(query.client_id)));
            if (!client) {
                return { status: 403 };
            }
            const agentInfo = await this.agentsService.findOne(Number(query.agent_id));
            if (!agentInfo) {
                return { status: 400 };
            }
            const count = await this.commentsPostgresqlRepository.count({
                where: {
                    agent_id: Number(query.agent_id),
                    status: Statuses_1.default.approved,
                    NOT: {
                        client_id: Number(query.client_id),
                    },
                },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const comment_submitted = await this.commentsPostgresqlRepository.findOne({
                where: {
                    client_id: query.client_id,
                    agent_id: Number(query.agent_id),
                },
                select: {
                    id: true,
                    agent_id: true,
                    comment: true,
                    score: true,
                    status: true,
                    created_at: true,
                    client: { select: { id: true, name: true, surname: true } },
                },
            });
            const result = await this.commentsPostgresqlRepository.findMany({
                where: {
                    agent_id: Number(query.agent_id),
                    status: Statuses_1.default.approved,
                    NOT: {
                        client_id: Number(query.client_id),
                    },
                },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
                select: {
                    id: true,
                    agent_id: true,
                    comment: true,
                    score: true,
                    created_at: true,
                    client: { select: { id: true, name: true, surname: true } },
                },
            });
            return {
                status: 200,
                result,
                statistics: {
                    total_comments: count,
                    total_score: agentInfo.score,
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
    async deleteCommentForRealEstate(query) {
        const comment = await this.prismaService.realEstateAgentComments.findFirst({
            where: { id: +query.comment_id },
        });
        if (!comment) {
            throw new common_1.BadRequestException();
        }
        await this.prismaService.realEstateAgentComments.deleteMany({
            where: { id: +query.comment_id, agent_id: +query.item_id },
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: messages_1.PublicMessage.Deleted,
            data: {},
        };
    }
    calculateScore(currentScore, score) {
        let newScore = 0;
        newScore = (Math.round(currentScore + score) / 2).toFixed(1);
        if (newScore > 5) {
            newScore = 5;
        }
        else if (newScore === 0) {
            newScore = 0;
        }
        return newScore;
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
RealEstateAgentsCommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [RealEstateAgentsCommentsPostgresqlRepository_1.default,
        real_estate_agents_service_1.RealEstateAgentsService,
        client_service_1.ClientService,
        prisma_service_1.PrismaService])
], RealEstateAgentsCommentsService);
exports.RealEstateAgentsCommentsService = RealEstateAgentsCommentsService;
//# sourceMappingURL=real-estate-agents-comments.service.js.map