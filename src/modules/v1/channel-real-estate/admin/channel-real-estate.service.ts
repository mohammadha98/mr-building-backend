import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { PinnedChannelRealEstateDto } from "./dto/pinned-channel-real-estate.dto";
import ChannelsTypes from "src/commons/contracts/ChannelsTypes";
import { GetChannelsDto } from "./dto/get-channels-pagination..dto";
import statuses from "src/commons/contracts/Statuses";

@Injectable()
export class ChannelRealEstateService {
  constructor(private readonly prismaService: PrismaService) {}

  // pinnedChannel
  async pinnedChannel(body: PinnedChannelRealEstateDto) {
    try {
      const client = await this.prismaService.users.findFirst({
        where: { id: Number(body.user_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const channelInfo =
        await this.prismaService.channelRealEstateAgent.findFirst({
          where: { id: Number(body.channel_id) },
          select: {
            real_estate_agent: { select: { client: { select: { id: true } } } },
          },
        });
      if (!channelInfo) {
        return { status: 400 };
      }

      await this.prismaService.channelRealEstateAgent.update({
        where: { id: Number(body.channel_id) },
        data: { tag: body.tag },
      });

      if (body.tag === ChannelsTypes.pinned) {
        const clientIds = await this.prismaService.client.findMany({
          where: { NOT: { id: channelInfo.real_estate_agent.client.id } },
          select: { id: true },
        });

        const existingMembers =
          await this.prismaService.channelRealEstateMembers.findMany({
            where: {
              channel_id: Number(body.channel_id),
              client_id: {
                in: clientIds.map((item) => item.id),
              },
            },
            select: { client_id: true },
          });
        const existingMembersIds = existingMembers.map(
          (member) => member.client_id
        );

        const newMembers = clientIds
          .filter((client) => !existingMembersIds.includes(client.id))
          .map((client) => client.id);

        await this.prismaService.channelRealEstateMembers.createMany({
          data: newMembers.map((clientId) => ({
            channel_id: Number(body.channel_id),
            client_id: Number(clientId),
          })),
        });
      } else {
        await this.prismaService.channelRealEstateMembers.deleteMany({
          where: {
            channel_id: Number(body.channel_id),
          },
        });
      }

      return {
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // getChannels
  async getChannels(query: GetChannelsDto) {
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
      } else if (query.status === statuses.pinned) {
        condition.where = { tag: statuses.pinned };
      } else if (query.status === statuses.unpinned) {
        condition.where = { NOT: { tag: statuses.pinned } };
      }

      const count = await this.prismaService.channelRealEstateAgent.count({
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

      const channels = await this.prismaService.channelRealEstateAgent.findMany(
        {
          where: condition.where,
          select: {
            id: true,
            key: true,
            last_message_time: true,
            tag: true,
            created_at: true,
            _count: { select: { members: true } },
            real_estate_agent: {
              select: { id: true, name: true, avatar: true },
            },
          },
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          orderBy: { id: "desc" },
        }
      );

      return {
        status: 200,
        channels,
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
}
