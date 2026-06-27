import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MarketplaceMessengerTransformer from "./Transformer";
import { SendMessageInMarketplaceWs } from "../../ws-server/dto/marketplace/send-message-in-marketplace-ws.dto";
import { MessengerActionTypes } from "../../ws-server/enums/MessengerActionTypes";
import * as process from "process";
import UploaderSources from "src/commons/contracts/UploaderSources";
import UploadService from "src/modules/services/UploadService";
import { SeenMessageMarketplaceWsDto } from "../../ws-server/dto/marketplace/seen-message-marketplace-ws.dto";

@Injectable()
export class MarketplaceMessenger_MessageSection {
  private messageSelector: object;
  private chatSelector: object;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly messageTransformer: MarketplaceMessengerTransformer,
    private readonly uploadService: UploadService
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

  private async getChatInfoByKey(chatKey: string) {
    const chatList =
      await this.prismaService.marketplaceMessengerHistory.findFirst({
        where: {
          key: chatKey,
        },
        select: this.chatSelector,
      });

    const result = await this.presentedChat([chatList]);
    return result[0];
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

  private async getMessageInfoById(messageId: number) {
    return this.prismaService.marketplaceMessages.findFirst({
      where: { id: messageId },
      select: this.messageSelector,
    });
  }

  public async saveMessage(body: SendMessageInMarketplaceWs) {
    console.log("save Message In Marketplace");

    if (body.action_type === MessengerActionTypes.edit && body.is_edited) {
      await this.prismaService.marketplaceMessages.update({
        where: {
          id: body.message_id,
        },
        data: {
          action_type: body.action_type,
          content: body.content,
          is_edited: true,
          // seen: true,
          thumbnail: body.thumbnail,
          size: body.size,
          length: body.length,
          type: body.type,
          caption: body.caption,
        },
      });

      const chatInfo = await this.getChatInfoByKey(body.key);
      const message = await this.getMessageInfoById(body.message_id);
      chatInfo.messages = message;
      return this.messageTransformer.transform(chatInfo);
    } else {
      const data: any = {
        client_id: body.client_id,
        action_type: body.action_type,
        content: body.content,
        thumbnail: body.thumbnail,
        size: body.size,
        length: body.length,
        type: body.type,
        caption: body.caption,
        key: body.key,
        is_replied: body.is_reply,
      };

      if (body.is_reply && body.action_type === "reply") {
        data.reply_to_id = +body.reply_to;
      }

      const result = await this.prismaService.marketplaceMessages.create({
        data,
      });
      const chatInfo = await this.getChatInfoByKey(body.key);
      const message = await this.getMessageInfoById(result.id);
      chatInfo.messages = message;
      return this.messageTransformer.transform(chatInfo);
    }
  }

  async deleteMessage({ message_ids, type, room, client_id, isOnline }: any) {
    try {
      let deleted_messages = [];

      for (let index = 0; index < message_ids.length; index++) {
        const message_id = message_ids[index];

        const messageInfo =
          await this.prismaService.marketplaceMessages.findFirst({
            where: { id: message_id },
          });

        if (messageInfo) {
          if (type === "me") {
            await this.prismaService.marketplaceMessages.updateMany({
              where: { id: message_id },
              data: { is_deleted: true },
            });
          } else {
            if (!isOnline) {
              await this.prismaService.marketplaceChatMessengerMessageDeleted.create(
                {
                  data: {
                    message_id,
                    chat_key: room,
                    client_id,
                  },
                }
              );
            }

            await this.prismaService.marketplaceMessages.delete({
              where: { id: message_id },
            });

            if (messageInfo.type !== "text") {
              const filename = messageInfo.content.split("/").slice(7)[0];
              this.uploadService.removeFile(
                filename,
                `uploader/${UploaderSources.marketplace_chat}/${messageInfo.key}/`
              );
            }
          }

          deleted_messages.push({
            message_id: message_id,
            type,
            room,
            owner_id: messageInfo.client_id,
            seen: messageInfo.seen,
          });
        }
      }

      const last_message: any =
        await this.prismaService.marketplaceMessages.findFirst({
          where: {
            key: room,
          },
          orderBy: { id: "desc" },
          select: this.messageSelector,
        });

      if (last_message) {
        await this.prismaService.chatMessengerHistory.updateMany({
          where: {
            key: room,
          },
          data: {
            last_message_time: last_message?.created_at,
          },
        });
      }

      const transform =
        this.messageTransformer.messageTransformer(last_message);

      return {
        last_message: transform,
        deleted_messages,
      };
    } catch (e) {
      console.log(e);
    }
  }

  public async seenMessages(body: SeenMessageMarketplaceWsDto) {
    await this.prismaService.marketplaceMessages.updateMany({
      where: {
        OR: body.message_ids.map((id) => ({
          id: id,
          key: body.key,
          NOT: { client_id: body.client_id },
        })),
      },
      data: { seen: true },
    });
  }
}
