import {  Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import statuses from "src/commons/contracts/Statuses";
import { ChangeStatusAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";

@Injectable()
export class RealEstateAgentsAdvisorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: GetRealEstateAgentsAdvisorsDto) {
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

      let condition: any = {};
      if (query.status === statuses.active) {
        condition = {
          where: {
            real_estate_agent_id: Number(query.agent_id),
            status: statuses.active,
          },
        };
      } else {
        condition = {
          where: {
            real_estate_agent_id: Number(query.agent_id),
          },
        };
      }

      const advisors = await this.prismaService.realEstateAdvisors.findMany({
        ...condition,
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
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async changeStatus(body: ChangeStatusAdvisorsDto) {
    try {
      await body.items.map(async (item: number) => {
        // update agent score
        if (body.status === statuses.approved) {
          const comment =
            await this.prismaService.realEstateAdvisorsComments.findUnique({
              where: { id: Number(item) },
            });

          if (!comment) {
            return { status: 400 };
          }

          const advisorInfo =
            await this.prismaService.realEstateAdvisors.findFirst({
              where: { id: comment.advisor_id },
            });
          const total_count =
            await this.prismaService.realEstateAdvisorsComments.count({
              where: {
                advisor_id: Number(advisorInfo.id),
                status: statuses.approved,
              },
            });

          const newScore = this.calculateScore(
            Number(advisorInfo.total_score),
            Number(comment.score),
            Number(total_count + 1)
          );
          await this.prismaService.realEstateAdvisors.update({
            where: { id: Number(advisorInfo.id) },
            data: {
              score: Number(newScore),
              total_score:
                Number(comment.score) + Number(advisorInfo.total_score),
            },
          });
        }

        await this.prismaService.realEstateAdvisorsComments.update({
          where: { id: Number(item) },
          data: { status: body.status },
        });
      });

      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
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

  async findComments(query: GetAdvisorCommentsDto) {
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
      if (query.status === statuses.all) {
        condition.where = {};
      } else {
        condition.where = { status: query.status };
      }

      const count = await this.prismaService.realEstateAdvisorsComments.count({
        where: condition.where,
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const result =
        await this.prismaService.realEstateAdvisorsComments.findMany({
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

  async findOneByID(item_id: number) {
    return await this.prismaService.realEstateAdvisors.findFirst({
      where: { id: Number(item_id) },
      select: { id: true, client: { select: { name: true, surname: true } } },
    });
  }

  private generateRedisKey(query: any) {
    const resourceKey = `get_real_estate_agents_advisors_status_${query.status}_agentId_${query.agent_id}_clientId_${query.client_id}`;

    // TODO: log for caching ads
    console.log("* resourceKey *");
    console.log(resourceKey);
    return resourceKey;
  }
}
