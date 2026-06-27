import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetChannelsDto } from "./dto/get-channels.dto";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import { randomBytes } from "crypto";
import UploadService from "src/modules/services/UploadService";
import { UpdateChannelTypeDto } from "./dto/update-channel-type-channel.dto";
import MessengerChannelTypes from "src/commons/contracts/MessengerChannelTypes";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { GetGroupInfoDto } from "src/modules/v1/messenger_groups/app/dto/get-group-info";
import { LeftMessenger } from "src/modules/v1/ws-server/dto/messenger/LeftMessenger";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { GetTypes } from "../../client/admin/dto/client-list.dto";
import statuses from "src/commons/contracts/Statuses";
import sortingTypes from "src/commons/contracts/SortingTypes";
import { ChangeStatusRequestVerifyDto } from "./dto/changeStatus-request-verify.dto";

@Injectable()
export class MessengerChannelsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploaderServer: UploadService
  ) {}

  // updateChannelType
  async UpdateChannelTypeDto(body: UpdateChannelTypeDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const channelInfo = await this.prismaService.messengerChannels.findFirst({
        where: { id: Number(body.channel_id) },
      });
      if (!channelInfo) {
        return { status: 400 };
      }

      const validateChannelLink =
        await this.prismaService.messengerChannels.findFirst({
          where: { username: body.link },
        });
      if (
        validateChannelLink &&
        validateChannelLink.id !== Number(body.channel_id)
      ) {
        const username = await this.generatePrivateUsername();
        await this.prismaService.messengerChannels.update({
          where: { id: Number(body.channel_id) },
          data: {
            type: MessengerChannelTypes.private,
            username,
          },
        });
      } else {
        await this.prismaService.messengerChannels.update({
          where: { id: Number(body.channel_id) },
          data: {
            type: body.channel_type,
            username: body.link,
          },
        });
      }

      return {
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // addMembers
  async addMembers(clients: any[], channel_id: number) {
    try {
      const existMembers =
        await this.prismaService.messengerChannlesMembers.findMany({
          where: { channel_id },
          select: {
            client_id: true,
          },
        });
      const existMembersIds = existMembers.map((item) => item.client_id);
      const newMemberList = clients.map((item) => item.client_id);

      const filteredMembers = newMemberList.filter(
        (item) => !existMembersIds.includes(item)
      );

      await this.prismaService.messengerChannlesMembers.createMany({
        skipDuplicates: true,
        data: filteredMembers.map((item) => ({
          client_id: item,
          channel_id,
        })),
      });

      const member_count = await this.countChannelMembers(channel_id);

      return {
        status: 200,
        member_count,
        newMemberList,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async countChannelMembers(channel_id: number) {
    return await this.prismaService.messengerChannlesMembers.count({
      where: {
        channel_id,
      },
    });
  }

  // leaveChannel
  async leaveChannel(body: LeftMessenger) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const channelInfo = await this.prismaService.messengerChannels.findFirst({
        where: { id: Number(body.item_id) },
      });
      if (!channelInfo) {
        return { status: 400 };
      }

      await this.prismaService.messengerChannlesMembers.deleteMany({
        where: {
          channel_id: Number(body.item_id),
          client_id: Number(body.client_id),
        },
      });
      const member_count = await this.countChannelMembers(channelInfo.id);

      return {
        status: 201,
        member_count,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // channelInfo
  async channelInfo(body: GetGroupInfoDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const channels = await this.prismaService.messengerChannels.findMany({
        where: {
          username: body.username,
        },
        select: {
          id: true,
          key: true,
          title: true,
          verified_channel: true,
          description: true,
          avatar: true,
          type: true,
          username: true,
          notification: true,
          owner_id: true,
          number_of_messages: true,
          last_message_time: true,
          messages: {
            take: 12,
            orderBy: { created_at: "desc" },
            select: {
              id: true,
              size: true,
              length: true,
              thumbnail: true,
              type: true,
              content: true,
              key: true,
              created_at: true,
              channel_id: true,
            },
          },
          members: {
            where: { client_id: Number(body.client_id) },
            select: { number_of_read_messages: true },
            take: 1,
          },
        },
        orderBy: { last_message_time: "desc" },
      });
      const presentedChannels = await this.getChannelsInfo(channels);

      console.log(channels[0].members);
      return {
        status: 200,
        is_joined: channels[0].members.length > 0 ? true : false,
        channels: presentedChannels,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getChannels(query: PaginationDto) {
    try {
      let condition = {};

      if (query.type === GetTypes.search) {
        condition = {
          OR: [
            {
              title: {
                contains: query.keyword,
                mode: "insensitive",
              },
            },
            {
              owner: {
                phone: {
                  contains: query.keyword,
                  mode: "insensitive",
                },
              },
            },
          ],
        };
      }

      let orderBy: any = { created_at: "desc" };
      if (query.sort === sortingTypes.oldest) {
        orderBy = { created_at: "asc" };
      }

      console.log(condition);

      const count = await this.prismaService.messengerChannels.count({
        where: { ...condition },
      });

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const channels = await this.prismaService.messengerChannels.findMany({
        where: { ...condition },
        select: {
          id: true,
          key: true,
          title: true,
          verified_channel: true,
          request: true,
          description: true,
          avatar: true,
          type: true,
          username: true,
          owner_id: true,
          last_message_time: true,
          owner: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
            },
          },
          created_at: true,
        },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
        orderBy,
      });
      const presentedChannels = await this.getChannelsInfo(channels);

      return {
        status: 200,
        channels: presentedChannels,
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

  async channelOfficials(query: PaginationDto) {
    console.log("**** channelOfficials ******");
    try {
      let condition = {};

      if (query.status !== statuses.all) {
        condition = { status: query.status };
      }
      if (query.type === GetTypes.search) {
        condition = {
          ...condition,
          OR: [
            {
              channel: {
                owner: {
                  phone: {
                    contains: query.keyword,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              channel: {
                title: {
                  contains: query.keyword,
                  mode: "insensitive",
                },
              },
            },
          ],
        };
      }

      let orderBy: any = { createdAt: "desc" };
      if (query.sort === sortingTypes.oldest) {
        orderBy = { createdAt: "asc" };
      }

      console.log(condition);

      const count =
        await this.prismaService.messengerChannelsRequestTheOfficial.count({
          where: { ...condition },
        });

      const total = this.getTotalPageNumber(
        Number(count),
        Number(query.per_page)
      );

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      const channels =
        await this.prismaService.messengerChannelsRequestTheOfficial.findMany({
          where: { ...condition },
          select: {
            status: true,
            verified_channel: true,
            createdAt: true,
            id: true,
            description: true,
            updatedAt: true,
            ownerId: true,
            channelId: true,
            channel: {
              select: {
                id: true,
                key: true,
                title: true,
                verified_channel: true,
                request: true,
                description: true,
                avatar: true,
                type: true,
                username: true,
                owner_id: true,
                last_message_time: true,
                owner: {
                  select: {
                    id: true,
                    name: true,
                    surname: true,
                    phone: true,
                  },
                },
                created_at: true,
              },
            },
          },
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          orderBy,
        });

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

  async changeStatusRequests(body: ChangeStatusRequestVerifyDto) {
    try {
      await body.requestIds.map(async (id) => {
        const checkExistRequest =
          await this.prismaService.messengerChannelsRequestTheOfficial.findFirst(
            {
              where: { id },
            }
          );
        if (checkExistRequest) {
          await this.prismaService.messengerChannels.update({
            where: { id: checkExistRequest.channelId },
            data: {
              verified_channel: body.verified_channel,
            },
          });

          await this.prismaService.messengerChannelsRequestTheOfficial.update({
            where: { id },
            data: {
              status: body.status,
              verified_channel: body.verified_channel,
            },
          });
        }
      });
      return {
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getChannelsInfo(channels: any[]) {
    return await Promise.all(
      channels.map(async (item) => {
        const count = await this.prismaService.messengerChannlesMembers.count({
          where: { channel_id: item.id },
        });
        item.member_count = count + 1;
        return item;
      })
    );
  }

  // getMessages
  async getMessages(body: GetChannelsMessagesDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const count = await this.prismaService.messengerChannelsMessages.count({
        where: {
          channel_id: Number(body.channel_id),
        },
      });

      const total = this.getTotalPageNumber(
        Number(count),
        Number(body.per_page)
      );

      const paginationValue = this.makePagination(
        Number(body.page),
        Number(body.per_page)
      );

      const messages =
        await this.prismaService.messengerChannelsMessages.findMany({
          where: { channel_id: Number(body.channel_id) },
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          orderBy: { created_at: "desc" },
        });

      let membership_status = false;
      const membership =
        await this.prismaService.messengerChannlesMembers.findFirst({
          where: {
            channel_id: Number(body.channel_id),
            client_id: Number(body.client_id),
          },
        });
      if (membership) {
        membership_status = true;
      }

      return {
        status: 200,
        membership_status,
        messages,
        metadata: this.makeMetadata(
          Number(body.page),
          Number(body.per_page),
          Number(total)
        ),
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  // getMembers
  async getMembers(body: GetChannelsMembersDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const channelInfo = await this.prismaService.messengerChannels.findFirst({
        where: { id: Number(body.channel_id) },
      });
      if (!channelInfo) {
        return { status: 400 };
      }
      const members =
        await this.prismaService.messengerChannlesMembers.findMany({
          where: { channel_id: Number(body.channel_id) },
          orderBy: { created_at: "desc" },
          select: {
            role: true,
            client: {
              select: {
                id: true,
                key: true,
                avatar: true,
                name: true,
                surname: true,
              },
            },
          },
        });
      const ownerInfo = await this.prismaService.client.findFirst({
        where: { id: channelInfo.owner_id },
      });
      members.unshift({
        role: "owner",
        client: {
          id: ownerInfo.id,
          key: ownerInfo.key,
          avatar: ownerInfo.avatar,
          name: ownerInfo.name,
          surname: ownerInfo.surname,
        },
      });

      return {
        status: 200,
        members,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findOneByID(item_id: number) {
    return await this.prismaService.messengerChannels.findFirst({
      where: { id: Number(item_id) },
    });
  }

  async deleteChannel(body: any) {
    try {
      const channelInfo = await this.prismaService.messengerChannels.findFirst({
        where: {
          owner_id: Number(body.client_id),
          id: Number(body.channel_id),
          key: body.key,
        },
      });

      const members =
        await this.prismaService.messengerChannlesMembers.findMany({
          where: { channel_id: Number(channelInfo.id) },
          select: {
            client_id: true,
          },
        });

      await this.prismaService.messengerChannlesMembers.deleteMany({
        where: { channel_id: Number(channelInfo.id) },
      });

      await this.prismaService.messengerChannelsMessages.deleteMany({
        where: { channel_id: Number(channelInfo.id) },
      });
      await this.prismaService.messengerChannels.delete({
        where: {
          id: Number(body.channel_id),
        },
      });
      await this.uploaderServer.removeDir(`messenger/${channelInfo.key}`);

      return members;
    } catch (error) {
      console.log(error);
    }
  }

  async getChannelsKey(client_id: number) {
    const channelIsJoined =
      await this.prismaService.messengerChannlesMembers.findMany({
        where: { client_id: Number(client_id) },
        select: { channel: { select: { key: true } } },
      });
    const channelIsOwnered =
      await this.prismaService.messengerChannels.findMany({
        where: { owner_id: Number(client_id) },
      });

    const ownerChannels = channelIsOwnered.map((item) => {
      return { channel: { key: item.key } };
    });
    const channelList = [...channelIsJoined, ...ownerChannels];
    return channelList;
  }

  async findMessagesByID(item_id: number) {
    return await this.prismaService.messengerChannelsMessages.findFirst({
      where: { id: Number(item_id) },
      select: {
        id: true,
        content: true,
      },
    });
  }

  // Get my channels
  async getChannelVerified(body: GetChannelsDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      const channels = await this.prismaService.messengerChannels.findMany({
        where: {
          verified_channel: true,
          OR: [
            { owner_id: Number(body.client_id) },
            { members: { some: { client_id: Number(body.client_id) } } },
          ],
        },
        select: {
          id: true,
          key: true,
          title: true,
          verified_channel: true,
          description: true,
          avatar: true,
          type: true,
          username: true,
          notification: true,
          owner_id: true,
          number_of_messages: true,
          last_message_time: true,
          messages: {
            take: 1,
            orderBy: { created_at: "desc" },
            select: {
              id: true,
              size: true,
              length: true,
              thumbnail: true,
              type: true,
              content: true,
              key: true,
              created_at: true,
              channel_id: true,
            },
          },
          members: {
            where: { client_id: Number(body.client_id) },
            select: { number_of_read_messages: true },
            take: 1,
          },
        },
        orderBy: { last_message_time: "desc" },
      });
      const presentedChannels = await this.getChannelsInfo(channels);

      return {
        status: 200,
        channels: presentedChannels,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async generatePrivateUsername() {
    const username = "MSGCHP" + randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateUsername =
      await this.prismaService.messengerChannels.findFirst({
        where: { username },
      });
    if (isDuplicateUsername) {
      await this.generatePrivateUsername();
    }
    return username;
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
