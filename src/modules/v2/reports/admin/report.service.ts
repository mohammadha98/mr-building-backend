import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import IPagination from "src/commons/contracts/IPagination";
import { GetReportsViolationsDto } from "./dto/get-reports-violations.dto";
import { WebinarService } from "src/modules/v2/webinar/app/webinar.service";
import { EventRoomsService } from "src/modules/v2/event-rooms/app/event-rooms.service";
import { eventGroupsService } from "src/modules/v2/events/group/app/event-groups.service";

import { RealEstateAgentsService } from "src/modules/v2/real-estate-agents/admin/real-estate-agents.service";
import { RealEstateAgentsAdvisorsService } from "src/modules/v2/real-estate-agents-advisors/admin/real-estate-agents-advisors.service";
import { ChannelRealEstateService } from "src/modules/v2/channel-real-estate/app/channel-real-estate.service";
import { ChatRealEstateService } from "src/modules/v2/chat-real-estate/app/chat-real-estate.service";
import ViolationTypes from "src/commons/contracts/ViolationTypes";
import { RealEstateAdsService } from "src/modules/v2/real-estate-ads/admin/real-estate-ads.service";

@Injectable()
export class ReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly webinarService: WebinarService,
    private readonly eventRoomsService: EventRoomsService,
    private readonly eventGroupsService: eventGroupsService,
    private readonly realEstateAgentsService: RealEstateAgentsService,
    private readonly realEstateAdsService: RealEstateAdsService,
    private readonly realEstateAgentsAdvisorsService: RealEstateAgentsAdvisorsService,
    private readonly channelRealEstateService: ChannelRealEstateService,
    private readonly chatRealEstateService: ChatRealEstateService
  ) {}

  async getAll(query: PaginationDto) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: Number(query.user_id) },
      });
      if (!user) {
        return { status: 403 };
      }

      const count = await this.prismaService.reportBugs.count({});
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const list = await this.prismaService.reportBugs.findMany({
        select: {
          id: true,
          content: true,
          image: true,
          voice: true,
          type: true,
          created_at: true,
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
        },
        orderBy: { id: "desc" },
        take: paginationValue.per_page,
        skip: paginationValue.offset,
      });

      return {
        status: 200,
        list,
        metadata: this.makeMetadata(
          Number(query.page),
          Number(query.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  async getAllViolations(query: GetReportsViolationsDto) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: Number(query.user_id) },
      });
      if (!user) {
        return { status: 403 };
      }

      const count = await this.prismaService.reportViolations.count({
        where: { type: query.type },
      });
      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );
      console.log(count);

      const list = await this.prismaService.reportViolations.findMany({
        where: { type: query.type },
        select: {
          id: true,
          item_id: true,
          description: true,
          type: true,
          created_at: true,
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
        },
        orderBy: { id: "desc" },
        take: paginationValue.per_page,
        skip: paginationValue.offset,
      });

      const transformer = await this.reportViolationTransform(list, query.type);

      return {
        status: 200,
        transformer,
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

  async reportViolationTransform(violations: any[], type: string) {
    let result;
    if (type === ViolationTypes.webinars) {
      result = await this.getWebinarInfo(violations);
    } else if (type === ViolationTypes.event_rooms) {
      result = await this.getEventRoomInfo(violations);
    } else if (type === ViolationTypes.event_groups) {
      result = await this.getEventGroupInfo(violations);
    } else if (type === ViolationTypes.real_estate_agents) {
      result = await this.getRealEstateAgentInfo(violations);
    } else if (type === ViolationTypes.real_estate_agent_ads) {
      result = await this.getRealEstateAdsInfo(violations);
    } else if (type === ViolationTypes.real_estate_agent_advisors) {
      result = await this.getRealEstateAdvisorsInfo(violations);
    } else if (type === ViolationTypes.real_estate_agent_channels) {
      result = await this.getRealEstateChannelsInfo(violations);
    } else if (type === ViolationTypes.real_estate_agent_channel_messages) {
      result = await this.getRealEstateChannelsMessagesInfo(violations);
    }
    return result;
  }

  async getWebinarInfo(items: any[]) {
    console.log("getWebinarInfo");

    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const webinarInfo = await this.webinarService.findOneByID(
          Number(item.item_id)
        );
        itemInfo.item_info = webinarInfo;

        return itemInfo;
      })
    );
    return result;
  }

  async getEventRoomInfo(items: any[]) {
    console.log("getEventRoomInfo");
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const eventRoomInfo = await this.eventRoomsService.findOneByID(
          Number(item.item_id)
        );
        itemInfo.item_info = eventRoomInfo;
        return itemInfo;
      })
    );
    return result;
  }

  async getEventGroupInfo(items: any[]) {
    console.log("getEventGroupInfo");
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const eventGroupInfo = await this.eventGroupsService.findOneByID(
          Number(item.item_id)
        );
        itemInfo.item_info = eventGroupInfo;
        return itemInfo;
      })
    );
    return result;
  }

  async getRealEstateAgentInfo(items: any[]) {
    console.log("getRealEstateAgentInfo");
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const agentInfoInfo = await this.realEstateAgentsService.findOneByID(
          Number(item.item_id)
        );
        itemInfo.item_info = {
          id: agentInfoInfo.id,
          title: agentInfoInfo.name,
        };
        return itemInfo;
      })
    );
    return result;
  }

  async getRealEstateAdsInfo(items: any[]) {
    console.log("getRealEstateAdsInfo");
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const adInfo = await this.realEstateAdsService.findOneByID(
          Number(item.item_id)
        );
        itemInfo.item_info = adInfo;
        return itemInfo;
      })
    );
    return result;
  }

  async getRealEstateAdvisorsInfo(items: any[]) {
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const advisorInfo =
          await this.realEstateAgentsAdvisorsService.findOneByID(
            Number(item.item_id)
          );
        itemInfo.item_info = {
          id: advisorInfo.id,
          title: advisorInfo.client.name + " " + advisorInfo.client.surname,
        };
        return itemInfo;
      })
    );
    return result;
  }

  async getRealEstateChannelsInfo(items: any[]) {
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const channelInfo = await this.channelRealEstateService.findOneByID(
          Number(item.item_id)
        );
        itemInfo.item_info = {
          id: channelInfo.real_estate_agent.id,
          title: channelInfo.real_estate_agent.name,
        };
        return itemInfo;
      })
    );
    return result;
  }

  async getRealEstateChannelsMessagesInfo(items: any[]) {
    const result = await Promise.all(
      items.map(async (item) => {
        const itemInfo = item;
        const messageInfo =
          await this.channelRealEstateService.findMessagesByID(
            Number(item.item_id)
          );
        itemInfo.item_info = {
          id: messageInfo.id,
          title: messageInfo.content,
        };
        return itemInfo;
      })
    );
    return result;
  }

  async single(query: any) {
    try {
      const client = await this.prismaService.client.findUnique({
        where: { id: Number(query.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const item = await this.prismaService.reportBugs.findFirst({
        where: { id: Number(query.id) },
        select: {
          id: true,
          content: true,
          image: true,
          type: true,
          voice: true,
          created_at: true,
          client: {
            select: { id: true, name: true, surname: true, phone: true },
          },
        },
      });

      return {
        status: 200,
        item,
      };
    } catch (error) {
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
