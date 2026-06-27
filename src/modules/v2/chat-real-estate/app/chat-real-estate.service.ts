import { Injectable } from "@nestjs/common";
import { CreateChatRealEstateDto } from "./dto/create-chat-real-estate.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import ChatRealEstateTypes from "src/commons/contracts/ChatRealEstateTypes";
import { GetChatRealEstateDto } from "./dto/get-chat-real-estate.dto";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetMessagesChatRealEstateDto } from "./dto/get-messages-chat-real-estate.dto";
import { randomBytes } from "crypto";
import statuses from "src/commons/contracts/Statuses";
import ClientRoles from "src/commons/contracts/ClientRoles";
import MessageTransformer from "./Transformer";

@Injectable()
export class ChatRealEstateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageTransformer: MessageTransformer
  ) {}

  async storeChatRequest(createChatRealEstateDto: CreateChatRealEstateDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(createChatRealEstateDto.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      let participantInfo = null;
      if (createChatRealEstateDto.type === ChatRealEstateTypes.advertisement) {
        const advertisementInfo =
          await this.prismaService.realEstateAds.findUnique({
            where: { id: Number(createChatRealEstateDto.item_id) },
            select: {
              client_id: true,
              client: { select: { roles: true } },
            },
          });
        participantInfo = advertisementInfo;
      } else if (
        createChatRealEstateDto.type === ChatRealEstateTypes.real_estate_agent
      ) {
        const agentInfo = await this.prismaService.realEstateAgents.findFirst({
          where: { id: Number(createChatRealEstateDto.item_id) },
          select: {
            client_id: true,
            client: { select: { roles: true } },
          },
        });
        participantInfo = agentInfo;
      } else if (createChatRealEstateDto.type === ChatRealEstateTypes.advisor) {
        const advisorInfo =
          await this.prismaService.realEstateAdvisors.findFirst({
            where: { id: Number(createChatRealEstateDto.item_id) },
            select: {
              client_id: true,
              client: { select: { roles: true } },
            },
          });
        participantInfo = advisorInfo;
      }

      console.log({ participantInfo });

      const isDuplicateChat =
        await this.prismaService.chatRealEstateHistory.findFirst({
          where: {
            OR: [
              {
                client_id: Number(createChatRealEstateDto.client_id),
                type: "starter",
                starter_id: Number(createChatRealEstateDto.client_id),
                participant_id: Number(participantInfo.client_id),
              },
              {
                client_id: Number(createChatRealEstateDto.client_id),
                type: "participant",
                starter_id: Number(participantInfo.client_id),
                participant_id: Number(createChatRealEstateDto.client_id),
              },
            ],
          },
          select: {
            id: true,
            key: true,
            last_message_time: true,
            created_at: true,
            type: true,
            chat_type: true,
            starter: {
              select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                roles: true,
                avatar: true,
              },
            },
            participant: {
              select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                roles: true,
                avatar: true,
              },
            },
          },
        });

      const key = await this.generateChatKey();
      if (!isDuplicateChat) {
        // create new chat for starter
        let starter_chat_type = ClientRoles.personal;
        if (
          client.roles.includes(ClientRoles.estate_agent) &&
          createChatRealEstateDto.type === ChatRealEstateTypes.advertisement
        ) {
          starter_chat_type = ClientRoles.personal;
        } else if (
          client.roles.includes(ClientRoles.estate_agent) &&
          createChatRealEstateDto.type !== ChatRealEstateTypes.advertisement
        ) {
          starter_chat_type = ClientRoles.estate_agent;
        }

        const result = await this.prismaService.chatRealEstateHistory.create({
          data: {
            client_id: Number(createChatRealEstateDto.client_id),
            type: "starter",
            chat_type: starter_chat_type,
            starter: {
              connect: { id: Number(createChatRealEstateDto.client_id) },
            },
            participant: {
              connect: { id: Number(participantInfo.client_id) },
            },
            key,
          },
          select: {
            id: true,
            key: true,
            last_message_time: true,
            created_at: true,
            type: true,
            chat_type: true,
            starter: {
              select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                roles: true,
                avatar: true,
              },
            },
            participant: {
              select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                roles: true,
                avatar: true,
              },
            },
          },
        });
        result.starter = await this.getRealEstateChatInfo(result.starter);
        result.participant = await this.getRealEstateChatInfo(
          result.participant
        );

        // create new chat for participant
        let participant_chat_type = ClientRoles.personal;
        if (
          participantInfo.client.roles.includes(ClientRoles.estate_agent) ||
          participantInfo.client.roles.includes(ClientRoles.advisor)
        ) {
          participant_chat_type = ClientRoles.estate_agent;
        }

        await this.prismaService.chatRealEstateHistory.create({
          data: {
            client_id: Number(participantInfo.client_id),
            type: "participant",
            chat_type: participant_chat_type,
            starter: {
              connect: { id: Number(createChatRealEstateDto.client_id) },
            },
            participant: {
              connect: { id: Number(participantInfo.client_id) },
            },
            key,
          },
        });

        if (createChatRealEstateDto.type === ChatRealEstateTypes.advisor) {
          const advisorInfo =
            await this.prismaService.realEstateAdvisors.findFirst({
              where: { id: Number(createChatRealEstateDto.item_id) },
            });

          if (result.participant.id === advisorInfo.client_id) {
            await this.prismaService.realEstateAdvisors.update({
              where: { id: Number(createChatRealEstateDto.item_id) },
              data: { total_customers: advisorInfo.total_customers + 1 },
            });
          }
        }
        return { status: 201, result };
      }
      console.log({ isDuplicateChat });
      isDuplicateChat.starter = await this.getRealEstateChatInfo(
        isDuplicateChat.starter
      );
      isDuplicateChat.participant = await this.getRealEstateChatInfo(
        isDuplicateChat.participant
      );
      return { status: 200, result: isDuplicateChat };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async findMyChats(query: GetChatRealEstateDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(query.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }

      let presentedPersonal = [];
      let presentedRealEstateChats = [];

      if (client.roles.includes(ClientRoles.estate_agent)) {
        const agentInfo = await this.prismaService.realEstateAgents.findFirst({
          where: { client_id: Number(query.client_id) },
          select: {
            client_id: true,
            avatar: true,
            phone: true,
            name: true,
            id: true,
          },
        });

        presentedRealEstateChats = await this.getChatsForRealEstate(
          agentInfo,
          undefined
        );
      } else if (client.roles.includes(ClientRoles.advisor)) {
        const advisorInfo =
          await this.prismaService.realEstateAdvisors.findFirst({
            where: { client_id: Number(query.client_id) },
            select: {
              real_estate_agent: {
                select: {
                  client_id: true,
                  avatar: true,
                  phone: true,
                  name: true,
                  id: true,
                },
              },
            },
          });

        const agentInfo = {
          id: advisorInfo.real_estate_agent.id,
          client_id: advisorInfo.real_estate_agent.client_id,
          name: advisorInfo.real_estate_agent.name,
          phone: advisorInfo.real_estate_agent.phone,
          avatar: advisorInfo.real_estate_agent.avatar,
        };

        presentedRealEstateChats = await this.getChatsForRealEstate(
          agentInfo,
          "estate_agent"
        );

        const personalCondition = { where: {} };
        personalCondition.where = {
          status: statuses.active,
          OR: [
            {
              client_id: Number(query.client_id),
              type: "starter",
              chat_type: "personal",
            },
            {
              client_id: Number(query.client_id),
              type: "participant",
              chat_type: "personal",
            },
          ],
        };
        presentedPersonal = await this.getChatsForClient(
          query,
          personalCondition
        );
      } else {
        const personalCondition = { where: {} };
        personalCondition.where = {
          status: statuses.active,
          OR: [
            {
              client_id: Number(query.client_id),
              type: "starter",
            },
            {
              client_id: Number(query.client_id),
              type: "participant",
            },
          ],
        };
        presentedPersonal = await this.getChatsForClient(
          query,
          personalCondition
        );
      }

      /*
      const total_number_of_unread_messages =
        await this.prismaService.chatRealEstateHistoryMessages.count({
          where: { destination_id: Number(query.client_id), seen: false },
        });
      */

      return {
        status: 200,
        presentedPersonal,
        presentedRealEstateChats,
        // total_number_of_unread_messages,
      };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async getChatsForClient(query: any, personalCondition: any) {
    const personal_chats =
      await this.prismaService.chatRealEstateHistory.findMany({
        where: personalCondition.where,
        select: {
          id: true,
          key: true,
          type: true,
          chat_type: true,
          starter: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
              roles: true,
              avatar: true,
            },
          },
          participant: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
              roles: true,
              avatar: true,
            },
          },
        },
        orderBy: { last_message_time: "desc" },
      });

    const presentedPersonal = await Promise.all(
      personal_chats.map(async (item: any) => {
        item.starter = await this.getRealEstateChatInfo(item.starter);
        item.participant = await this.getRealEstateChatInfo(item.participant);

        const last_message =
          await this.prismaService.chatRealEstateHistoryMessages.findFirst({
            where: { key: item.key },
            orderBy: { created_at: "desc" },
          });
        item.messages = last_message;

        // دریافت تعداد پیام های خوانده نشده
        const number_of_unread_messages =
          await this.prismaService.chatRealEstateHistoryMessages.count({
            where: {
              NOT: { client_id: Number(query.client_id) },
              key: item.key,
              seen: false,
            },
          });
        item.number_of_unread_messages = number_of_unread_messages;
        return item;
      })
    );

    return presentedPersonal;
  }

  private async getChatsForRealEstate(agentInfo: any, chat_type: string) {
    let real_estate_agent_chats = [];
    let presentedRealEstateChats = [];
    const realEstateCondition = { where: {} };

    realEstateCondition.where = {
      status: statuses.active,
      OR: [
        {
          client_id: agentInfo.client_id,
          type: "starter",
          chat_type,
        },
        {
          client_id: agentInfo.client_id,
          type: "participant",
          chat_type,
        },
      ],
    };

    real_estate_agent_chats =
      await this.prismaService.chatRealEstateHistory.findMany({
        where: realEstateCondition.where,
        select: {
          id: true,
          key: true,
          type: true,
          chat_type: true,
          starter: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
              roles: true,
              avatar: true,
            },
          },
          participant: {
            select: {
              id: true,
              name: true,
              surname: true,
              phone: true,
              roles: true,
              avatar: true,
            },
          },
        },
        orderBy: { last_message_time: "desc" },
      });

    presentedRealEstateChats = await Promise.all(
      real_estate_agent_chats.map(async (item: any) => {
        item.starter = await this.getRealEstateChatInfo(item.starter);
        item.participant = await this.getRealEstateChatInfo(item.participant);

        const last_message =
          await this.prismaService.chatRealEstateHistoryMessages.findFirst({
            where: { key: item.key },
            orderBy: { created_at: "desc" },
          });
        item.messages = last_message;

        // دریافت تعداد پیام های خوانده نشده
        const number_of_unread_messages =
          await this.prismaService.chatRealEstateHistoryMessages.count({
            where: {
              NOT: { client_id: Number(agentInfo.client_id) },
              key: item.key,
              seen: false,
            },
          });
        item.number_of_unread_messages = number_of_unread_messages;
        return item;
      })
    );

    return presentedRealEstateChats;
  }

  // getRealEstateChatInfo
  private async clientInfoForChat(client: any) {
    client.name = client.name + " " + client.surname;
    return client;
  }

  private async realEstateInfoForChat(realEstate: any) {
    realEstate = {
      id: realEstate.id,
      name: realEstate.name,
      avatar: realEstate.avatar,
      phone: realEstate.phone,
    };

    return realEstate;
  }

  private async getRealEstateChatInfo(client: any) {
    if (client.roles.includes(ClientRoles.estate_agent)) {
      const info = await this.realEstateInfoByClientId(client.id);
      client = {
        id: client.id,
        name: info.name,
        avatar: info.avatar,
        phone: client.phone,
      };
    } else {
      client = client;
      client.name = client.name + " " + client.surname;
    }
    return client;
  }

  private async getRealEstateInfoForChat(clientId: number) {
    console.log({ clientId });
    const info = await this.realEstateInfoByClientId(clientId);
    const realEstate = {
      id: info.id,
      name: info.name,
      avatar: info.avatar,
      phone: info.client.phone,
    };
    return realEstate;
  }

  private async getClientInfoForChat(clientId: number) {
    const info = await this.prismaService.client.findFirst({
      where: { id: clientId },
    });
    const clientInfo = {
      id: info.id,
      name: info.name,
      avatar: info.avatar,
      phone: info.phone,
    };
    return clientInfo;
  }

  private async realEstateInfoByClientId(clientId: number) {
    return await this.prismaService.realEstateAgents.findFirst({
      where: { client_id: clientId },
      select: {
        id: true,
        name: true,
        avatar: true,
        client: { select: { phone: true } },
      },
    });
  }

  async findMessages(query: GetMessagesChatRealEstateDto) {
    try {
      const client = await this.prismaService.client.findFirst({
        where: { id: Number(query.client_id) },
      });
      if (!client) {
        return { status: 403 };
      }
      const count =
        await this.prismaService.chatRealEstateHistoryMessages.count({
          where: { key: query.key },
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
        await this.prismaService.chatRealEstateHistoryMessages.findMany({
          where: { key: query.key },
          skip: paginationValue.offset,
          take: paginationValue.per_page,
          orderBy: { created_at: "desc" },
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

  private async generateChatKey() {
    const key = randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateChatId =
      await this.prismaService.chatRealEstateHistory.findFirst({
        where: { key },
      });
    if (isDuplicateChatId) {
      await this.generateChatKey();
    }
    return key;
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
