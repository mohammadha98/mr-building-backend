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
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
let RealEstateAgentsCommentsService = class RealEstateAgentsCommentsService {
    constructor(commentsPostgresqlRepository, agentsService, clientService, userPrismaRepository) {
        this.commentsPostgresqlRepository = commentsPostgresqlRepository;
        this.agentsService = agentsService;
        this.clientService = clientService;
        this.userPrismaRepository = userPrismaRepository;
    }
    async changeStatus(body) {
        try {
            await body.items.map(async (item) => {
                console.log(item);
                if (body.status === Statuses_1.default.approved) {
                    const comment = await this.commentsPostgresqlRepository.findOne({
                        where: { id: Number(item) },
                    });
                    const agentInfo = await this.agentsService.findOne(Number(comment.agent_id));
                    const total_count = await this.commentsPostgresqlRepository.count({
                        where: {
                            agent_id: Number(comment.agent_id),
                            status: Statuses_1.default.approved,
                        },
                    });
                    const newScore = this.calculateScore(Number(agentInfo.total_score), Number(comment.score), Number(total_count + 1));
                    await this.agentsService.updateScore({ id: Number(agentInfo.id) }, {
                        score: Number(newScore),
                        total_score: Number(comment.score) + Number(agentInfo.total_score),
                    });
                }
                await this.commentsPostgresqlRepository.updateOne({
                    id: Number(item),
                }, { status: body.status });
            });
            return {
                status: 201,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findAllComments(query) {
        try {
            let condition = {};
            if (query.status === Statuses_1.default.all) {
                condition = { orderBy: { id: "desc" } };
            }
            else {
                condition = {
                    where: { status: query.status },
                    orderBy: { id: "desc" },
                };
            }
            if (query.agent_id) {
                condition = {
                    where: Object.assign(Object.assign({}, condition.where), { agent_id: Number(query.agent_id) }),
                    orderBy: { id: "desc" },
                };
            }
            console.log(condition);
            const count = await this.commentsPostgresqlRepository.count(condition);
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.commentsPostgresqlRepository.findMany(Object.assign(Object.assign({}, condition), { skip: paginationValue.offset, take: paginationValue.per_page, select: {
                    id: true,
                    agent_id: true,
                    comment: true,
                    score: true,
                    status: true,
                    created_at: true,
                    client: { select: { id: true, name: true, surname: true } },
                    real_estate_agent: { select: { id: true, name: true, avatar: true } },
                } }));
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
    async findOne(id) {
        return `This action returns a #${id} realEstateAgentsComment`;
    }
    async update(id, updateRealEstateAgentsCommentDto) {
        return `This action updates a #${id} realEstateAgentsComment`;
    }
    async remove(id) {
        return `This action removes a #${id} realEstateAgentsComment`;
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
        UserPrismaRepository_1.default])
], RealEstateAgentsCommentsService);
exports.RealEstateAgentsCommentsService = RealEstateAgentsCommentsService;
//# sourceMappingURL=real-estate-agents-comments.service.js.map