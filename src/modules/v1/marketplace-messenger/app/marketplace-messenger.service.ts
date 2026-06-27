import { Inject, Injectable, Scope } from "@nestjs/common";
import { CreateChatInMarketplaceDto } from "./dto/create-chat-in-marketplace.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import ClientRoles from "src/commons/contracts/ClientRoles";
import MarketplaceMessengerTransformer from "./Transformer";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";
import {
  NotFoundMessage,
  PublicMessage,
} from "src/commons/enums/messages";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { HttpStatusCode } from "axios";
import * as process from "process";
import {
  PaginationGenerator,
  PaginationSolver,
} from "src/commons/utils/pagination.util";
import {
  GetMessagesDto,
  GetMessagesTypes,
} from "../../messenger/app/dto/get-messages.dto";

@Injectable({ scope: Scope.REQUEST })
export class MarketplaceMessengerService {
  private messageSelector: object;
  private chatSelector: object;

  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly prismaService: PrismaService,
    private readonly messageTransformer: MarketplaceMessengerTransformer
  ) {
    this.messageSelector = {
      id: true,
      reaction: true,
      key: true,
      content: true,
      caption: true,
      size: true,
      length: true,
      thumbnail: true,
      created_at: true,
      seen: true,
      is_blocked: true,
      is_deleted: true,
      is_edited: true,
      is_replied: true,
      action_type: true,
      have_reaction: true,
      type: true,
      client_id: true,
      client: {
        select: {
          id: true,
          name: true,
          surname: true,
          avatar: true,
          phone: true,
        },
      },
      reply_to: {
        select: {
          id: true,
          reaction: true,
          key: true,
          content: true,
          caption: true,
          size: true,
          length: true,
          thumbnail: true,
          created_at: true,
          type: true,
          action_type: true,
          client_id: true,
          client: {
            select: {
              id: true,
              name: true,
              surname: true,
              avatar: true,
              phone: true,
            },
          },
        },
      },
    };
    this.chatSelector = {
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
          avatar: true,
        },
      },
      participant: {
        select: {
          id: true,
          name: true,
          surname: true,
          phone: true,
          avatar: true,
        },
      },
    };
  }

  private async checkExistStorefront(storefrontId: string) {
    const checkExistStorefront = await this.prismaService.storefront.findFirst({
      where: { id: storefrontId },
      select: {
        id: true,
        client: { select: { id: true } },
      },
    });
    if (!checkExistStorefront) {
      throw new BadRequestErrorHandler(NotFoundMessage.NotFoundStorefront);
    }
    return checkExistStorefront;
  }

  private async checkExistStorefrontByClientId(client_id: number) {
    return this.prismaService.storefront.findFirst({
      where: { client_id },
      select: {
        id: true,
        client: { select: { id: true } },
      },
    });
  }

  private async generateTrackingCode(): Promise<string> {
    // const uniqueCode = randomBytes(6).toString("hex").toUpperCase();
    const uniqueCode =
      "mrkt_chat_" +
      (Math.random() * (100000000 - 1000000) + 100000000).toFixed(0);
    const isCodeUnique =
      await this.prismaService.marketplaceMessengerHistory.findFirst({
        where: { key: uniqueCode },
      });

    if (isCodeUnique) {
      return this.generateTrackingCode();
    }

    return uniqueCode;
  }

  async storeChatRequest(body: CreateChatInMarketplaceDto) {
    const { id: clientId } = this.request.client;
    const isStorefront = await this.checkExistStorefrontByClientId(clientId);

    const storefront = await this.checkExistStorefront(body.item_id);
    const participantInfo = storefront.client;

    console.log({ participantInfo });

    const isDuplicateChat =
      await this.prismaService.marketplaceMessengerHistory.findFirst({
        where: {
          OR: [
            {
              client_id: clientId,
              type: "starter",
              starter_id: clientId,
              participant_id: Number(participantInfo.id),
            },
            {
              client_id: clientId,
              type: "participant",
              starter_id: Number(participantInfo.id),
              participant_id: clientId,
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

    if (!isDuplicateChat) {
      const key = await this.generateTrackingCode();
      // create new chat for starter
      let starter_chat_type = !isStorefront
        ? ClientRoles.personal
        : ClientRoles.storefront;

      const result =
        await this.prismaService.marketplaceMessengerHistory.create({
          data: {
            client_id: clientId,
            type: "starter",
            chat_type: starter_chat_type,
            starter: {
              connect: { id: clientId },
            },
            participant: {
              connect: { id: Number(participantInfo.id) },
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
                avatar: true,
              },
            },
            participant: {
              select: {
                id: true,
                name: true,
                surname: true,
                phone: true,
                avatar: true,
              },
            },
          },
        });
      result.starter = (await this.starterInfo(
        result.starter,
        !!isStorefront
      )) as any;
      result.participant = (await this.starterInfo(
        result.participant,
        true
      )) as any;

      // create new chat for participant
      let participant_chat_type = !isStorefront
        ? ClientRoles.personal
        : ClientRoles.storefront;

      await this.prismaService.marketplaceMessengerHistory.create({
        data: {
          client_id: clientId,
          type: "participant",
          chat_type: participant_chat_type,
          starter: {
            connect: { id: clientId },
          },
          participant: {
            connect: { id: Number(participantInfo.id) },
          },
          key,
        },
      });

      const transform = this.messageTransformer.transform(result);
      return {
        status: HttpStatusCode.Created,
        message: PublicMessage.Created,
        data: transform,
      };
    }
    console.log({ isDuplicateChat });
    isDuplicateChat.starter = (await this.starterInfo(
      isDuplicateChat.starter,
      !!isStorefront
    )) as any;
    isDuplicateChat.participant = (await this.starterInfo(
      isDuplicateChat.participant,
      true
    )) as any;

    const transform = this.messageTransformer.transform(isDuplicateChat);
    return {
      status: HttpStatusCode.Ok,
      message: PublicMessage.Created,
      data: transform,
    };
  }

  async findMyChats() {
    const { id: clientId } = this.request.client;

    const chatList =
      await this.prismaService.marketplaceMessengerHistory.findMany({
        where: {
          OR: [
            {
              type: "starter",
              starter_id: clientId,
            },
            {
              type: "participant",
              participant_id: clientId,
            },
          ],
        },
        select: this.chatSelector,
        orderBy: { created_at: "desc" },
      });

    const list = await this.presentedChat(chatList);
    const presentedChatList = await Promise.all(
      list.map(async (item: any) => {
        item.messages = await this.getLastMessage(item.key);
        return item;
      })
    );

    const transform = this.messageTransformer.collection(presentedChatList);
    return {
      status: HttpStatusCode.Ok,
      message: PublicMessage.Created,
      data: transform,
    };
  }

  private async presentedChat(chatList: any[]) {
    return await Promise.all(
      chatList.map(async (item: any) => {
        let isStorefront = await this.storefrontInfoByClientId(item.starter.id);
        item.starter = (await this.starterInfo(
          item.starter,
          !!isStorefront
        )) as any;

        isStorefront = await this.storefrontInfoByClientId(item.participant.id);
        item.participant = (await this.starterInfo(
          item.participant,
          !!isStorefront
        )) as any;

        return item;
      })
    );
  }

  private async getLastMessage(chatKey: string) {
    return this.prismaService.marketplaceMessages.findFirst({
      where: { key: chatKey },
      select: this.messageSelector,
      orderBy: { created_at: "desc" },
    });
  }

  private async starterInfo(client: any, isStorefront: boolean = false) {
    let info;
    if (isStorefront) {
      info = await this.storefrontInfoByClientId(client.id);
      info = {
        name: info.name,
        avatar: info.avatar
          ? `${process.env.APP_CONTENT_PATH}/storefront/${info.id}/avatars/${info.avatar}`
          : "",
        phone: info.phone,
      };
    } else {
      info = await this.getClientInfo(client.id);
      info = {
        name: info.name + " " + info.surname,
        avatar: info.avatar
          ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${info.avatar}`
          : "",
        phone: info.phone,
      };
    }

    return {
      name: info.name,
      avatar: info.avatar,
      phone: info.phone,
    };
  }

  private async getClientInfo(clientId: number) {
    return this.prismaService.client.findFirst({
      where: { id: clientId },
    });
  }

  private async storefrontInfoByClientId(client_id: number) {
    return this.prismaService.storefront.findFirst({
      where: { client_id },
      select: {
        id: true,
        name: true,
        avatar: true,
        phone: true,
      },
    });
  }

  async findMessages(query: GetMessagesDto) {
    const { id: client_id } = this.request.client;
    const { skip } = PaginationSolver(query);

    const { where, count } = await this.generateConditions(
      client_id,
      skip,
      query
    );
    const result = await this.prismaService.marketplaceMessages.findMany({
      where,
      select: this.messageSelector,
      skip,
      take: +query.per_page,
      orderBy: { created_at: "desc" },
    });

    const editedTransform = await this.getEditedMessage(client_id, query.key);
    const deletedMessage = await this.getDeletedMessages(client_id, query.key);
    const transform = this.messageTransformer.messageCollection(result);

    return {
      status: HttpStatusCode.Ok,
      message: PublicMessage.OkResponse,
      data: {
        messages: transform,
        edited: editedTransform,
        deleted: deletedMessage,
        metadata: PaginationGenerator(query.page, query.per_page, count),
      },
    };
  }

  private async generateConditions(
    client_id: number,
    skip: number,
    query: GetMessagesDto
  ) {
    let count = 0;
    let where = {};

    if (query.type === GetMessagesTypes.pagination) {
      count = await this.prismaService.marketplaceMessages.count({
        where: { key: query.key },
      });
    } else if (query.type === GetMessagesTypes.before_date) {
      count = await this.prismaService.marketplaceMessages.count({
        where: { key: query.key, created_at: { lt: query.date } },
      });
      where = {
        where: { key: query.key, created_at: { lt: query.date } },
        skip,
        take: +query.per_page,
      };
    } else if (query.type === GetMessagesTypes.after_date) {
      count = await this.prismaService.marketplaceMessages.count({
        where: { key: query.key, created_at: { gt: query.date } },
      });
      where = {
        where: { key: query.key, created_at: { gt: query.date } },
        skip,
        take: +query.per_page,
      };
    } else if (query.type === GetMessagesTypes.unseen) {
      where = {
        where: {
          key: query.key,
          seen: false,
          NOT: { client_id: client_id },
        },
      };
    }
    return { where, count };
  }

  private async getEditedMessage(client_id: number, key: string) {
    const edited = await this.prismaService.marketplaceMessages.findMany({
      where: {
        key,
        client_id: { not: client_id },
        is_edited: true,
      },
      orderBy: { created_at: "desc" },
      select: this.messageSelector,
    });
    return this.messageTransformer.messageCollection(edited);
  }

  private async getDeletedMessages(client_id: number, chat_key: string) {
    const deletedResult =
      await this.prismaService.marketplaceChatMessengerMessageDeleted.findMany({
        where: {
          client_id,
          chat_key,
        },
      });

    await this.prismaService.marketplaceChatMessengerMessageDeleted.deleteMany({
      where: {
        client_id,
        chat_key,
      },
    });

    let deleted = [];
    deletedResult.map(async (item) => {
      deleted.push(item.message_id);
    });

    return deleted;
  }
}
