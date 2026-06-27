import { Injectable } from "@nestjs/common";
import { UpdateRealEstateAgentsCommentDto } from "./dto/update-real-estate-agents-comment.dto";
import { ClientService } from "src/modules/v2/client/app/client.service";
import RealEstateAgentsCommentsPostgresqlRepository from "../repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { RealEstateAgentsService } from "src/modules/v2/real-estate-agents/app/real-estate-agents.service";
import { ChangeStatusCommentAgentDto } from "./dto/change-status.dto";
import statuses from "src/commons/contracts/Statuses";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import UserPrismaRepository from "src/modules/v2/users/admin/repositories/UserPrismaRepository";
import { GetCommentsListForRealEstateAgentDto } from "./dto/get-list..dto copy";

@Injectable()
export class RealEstateAgentsCommentsService {
  constructor(
    private readonly commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository,
    private readonly agentsService: RealEstateAgentsService,
    private readonly clientService: ClientService,
    private readonly userPrismaRepository: UserPrismaRepository
  ) {}

  async changeStatus(body: ChangeStatusCommentAgentDto) {
    try {
      await body.items.map(async (item) => {
        console.log(item);

        if (body.status === statuses.approved) {
          const comment = await this.commentsPostgresqlRepository.findOne({
            where: { id: Number(item) },
          });

          const agentInfo = await this.agentsService.findOne(
            Number(comment.agent_id)
          );

          const total_count = await this.commentsPostgresqlRepository.count({
            where: {
              agent_id: Number(comment.agent_id),
              status: statuses.approved,
            },
          });

          const newScore = this.calculateScore(
            Number(agentInfo.total_score),
            Number(comment.score),
            Number(total_count + 1)
          );
          await this.agentsService.updateScore(
            { id: Number(agentInfo.id) },
            {
              score: Number(newScore),
              total_score:
                Number(comment.score) + Number(agentInfo.total_score),
            }
          );
        }

        await this.commentsPostgresqlRepository.updateOne(
          {
            id: Number(item),
          },
          { status: body.status }
        );
      });

      return {
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findAllComments(query: GetCommentsListForRealEstateAgentDto) {
    try {
      let condition = {} as any;
      if (query.status === statuses.all) {
        condition = { orderBy: { id: "desc" } };
      } else {
        condition = {
          where: { status: query.status },
          orderBy: { id: "desc" },
        };
      }

      if (query.agent_id) {
        condition = {
          where: {
            ...condition.where,
            agent_id: Number(query.agent_id),
          },
          orderBy: { id: "desc" },
        };
      }
      console.log(condition);

      const count = await this.commentsPostgresqlRepository.count(condition);
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result = await this.commentsPostgresqlRepository.findMany({
        ...condition,
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
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} realEstateAgentsComment`;
  }

  async update(
    id: number,
    updateRealEstateAgentsCommentDto: UpdateRealEstateAgentsCommentDto
  ) {
    return `This action updates a #${id} realEstateAgentsComment`;
  }

  async remove(id: number) {
    return `This action removes a #${id} realEstateAgentsComment`;
  }

  private calculateScore(
    total_score: number,
    new_score: number,
    total_count: number
  ) {
    let newScore: any = 0;
    newScore = (Math.floor(total_score + new_score) / total_count).toFixed(1);
    if (newScore > 5) {
      newScore = 5;
    } else if (newScore === 0) {
      newScore = 0;
    }
    return newScore;
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
