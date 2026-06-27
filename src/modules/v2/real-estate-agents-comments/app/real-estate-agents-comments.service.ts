import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRealEstateAgentsCommentDto } from "./dto/create-real-estate-agents-comment.dto";
import { ClientService } from "src/modules/v2/client/app/client.service";
import RealEstateAgentsCommentsPostgresqlRepository from "../repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { RealEstateAgentsService } from "src/modules/v2/real-estate-agents/app/real-estate-agents.service";
import { GetCommentsListForRealEstateAgentDto } from "src/modules/v2/real-estate-agents/app/dto/get-list..dto";
import statuses from "src/commons/contracts/Statuses";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { PublicMessage } from "src/commons/enums/messages";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { DeleteCommentDto } from "./dto/update-real-estate-agents-comment.dto";

@Injectable()
export class RealEstateAgentsCommentsService {
  constructor(
    private readonly commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository,
    private readonly agentsService: RealEstateAgentsService,
    private readonly clientService: ClientService,
    private readonly prismaService: PrismaService
  ) {}

  async storeComment(body: CreateRealEstateAgentsCommentDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(Number(body.client_id))
      );
      if (!client) {
        return { status: 403 };
      }

      const agentInfo = await this.agentsService.findOne(Number(body.agent_id));
      if (!agentInfo) {
        return { status: 400 };
      }

      const comment_submitted = await this.commentsPostgresqlRepository.findOne(
        {
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
        }
      );
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
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findComments(query: GetCommentsListForRealEstateAgentDto) {
    try {
      const client = await this.clientService.validateWithID(
        Number(Number(query.client_id))
      );
      if (!client) {
        return { status: 403 };
      }

      const agentInfo = await this.agentsService.findOne(
        Number(query.agent_id)
      );
      if (!agentInfo) {
        return { status: 400 };
      }

      const count = await this.commentsPostgresqlRepository.count({
        where: {
          agent_id: Number(query.agent_id),
          status: statuses.approved,
          NOT: {
            client_id: Number(query.client_id),
          },
        },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const comment_submitted = await this.commentsPostgresqlRepository.findOne(
        {
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
        }
      );

      const result = await this.commentsPostgresqlRepository.findMany({
        where: {
          agent_id: Number(query.agent_id),
          status: statuses.approved,
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

  async deleteCommentForRealEstate(query: DeleteCommentDto) {
    const comment = await this.prismaService.realEstateAgentComments.findFirst({
      where: { id: +query.comment_id },
    });
    if (!comment) {
      throw new BadRequestException();
    }

    await this.prismaService.realEstateAgentComments.deleteMany({
      where: { id: +query.comment_id, agent_id: +query.item_id },
    });

    return {
      statusCode: HttpStatus.OK,
      message: PublicMessage.Deleted,
      data: {},
    };
  }

  private calculateScore(currentScore: number, score: number) {
    let newScore: any = 0;
    newScore = (Math.round(currentScore + score) / 2).toFixed(1);
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
