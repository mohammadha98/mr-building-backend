import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../prisma/prisma.service";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetMessagesDto, GetMessagesTypes } from "./dto/get-messages.dto";
import { randomBytes } from "crypto";
import MessengerSaveMessageTransformer from "./Transformer";
import UploaderSources from "src/commons/contracts/UploaderSources";
import UploadService from "src/modules/services/UploadService";
import { ForwardMessageInSaveMessage } from "../../ws-server/dto/messenger/channel/send-message-rmessenger-ws-server.dto";

@Injectable()
export class MessengerSaveMessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly saveMessageTransformer: MessengerSaveMessageTransformer,
    private readonly uploadService: UploadService
  ) {}

  async storeSaveMessage(client_id: number) {
    const key = await this.generateKey();
    return await this.prismaService.messengerSaveMessageHistory.create({
      data: {
        client_id,
        key: key,
      },
      select: {
        id: true,
        key: true,
        created_at: true,
        client_id: true,
        last_message_time: true,
        messages: {
          take: 1,
          orderBy: { created_at: "desc" },
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
            is_edited: true,
            is_replied: true,
            have_reaction: true,
            type: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_message_id: true,
            forward_from_channel: {
              select: {
                id: true,
                key: true,
                username: true,
                title: true,
                avatar: true,
              },
            },
            forward_from_client: {
              select: {
                id: true,
                key: true,
                name: true,
                surname: true,
                avatar: true,
                phone: true,
              },
            },
            replied_by: {
              select: {
                id: true,
                reaction: true,
                key: true,
                content: true,
                caption: true,
                size: true,
                length: true,
                created_at: true,
                is_edited: true,
                is_replied: true,
                have_reaction: true,
                type: true,
              },
            },
          },
        },
      },
    });
  }

  async saveNewMessage(body: any) {
    try {
      let result;
      let saveMessage;

      if (body.is_edited && body.message_id) {
        result = await this.prismaService.messengerSaveMessageMessages.update({
          where: { id: Number(body.message_id) },
          data: {
            is_edited: true,
            type: body.type,
            content: body.content,
            caption: body.caption,
            size: body.size,
            length: body.length,
            thumbnail: body.thumbnail,
          },
          select: {
            save_message_id: true,
          },
        });

        saveMessage =
          await this.prismaService.messengerSaveMessageHistory.findFirst({
            where: { id: result.save_message_id },
            select: {
              id: true,
              key: true,
              created_at: true,
              client_id: true,
              last_message_time: true,
              messages: {
                where: { id: body.message_id },
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
                  is_edited: true,
                  have_reaction: true,
                  type: true,
                  is_forwarded: true,
                  action_type: true,
                  forward_from: true,
                  forward_from_client_id: true,
                  forward_message_id: true,
                  forward_from_channel: {
                    select: {
                      id: true,
                      key: true,
                      username: true,
                      title: true,
                      avatar: true,
                    },
                  },
                  forward_from_client: {
                    select: {
                      id: true,
                      key: true,
                      name: true,
                      surname: true,
                      avatar: true,
                      phone: true,
                    },
                  },
                  is_replied: true,
                  reply_to: {
                    select: {
                      id: true,
                      reaction: true,
                      key: true,
                      type: true,
                      action_type: true,
                      content: true,
                      caption: true,
                      size: true,
                      length: true,
                      thumbnail: true,
                      created_at: true,
                    },
                  },
                  replied_by: {
                    select: {
                      id: true,
                      reaction: true,
                      key: true,
                      content: true,
                      caption: true,
                      size: true,
                      length: true,
                      created_at: true,
                      is_edited: true,
                      is_replied: true,
                      have_reaction: true,
                      type: true,
                    },
                  },
                },
              },
            },
          });
      } else {
        let data: any = {
          key: body.key,
          action_type: body.action_type,
          is_replied: body.is_reply,
          save_message_id: body.save_message_id,
          type: body.type,
          content: body.content,
          caption: body.caption,
          size: body.size,
          length: body.length,
          thumbnail: body.thumbnail,
        };

        if (body.is_reply && body.action_type === "reply") {
          data.reply_to_id = +body.reply_to;
        }

        console.log({ data });

        result = await this.prismaService.messengerSaveMessageMessages.create({
          data,
          select: {
            save_message_id: true,
          },
        });

        saveMessage =
          await this.prismaService.messengerSaveMessageHistory.findFirst({
            where: { id: result.save_message_id },
            select: {
              id: true,
              key: true,
              created_at: true,
              client_id: true,
              last_message_time: true,
              messages: {
                orderBy: { created_at: "desc" },
                take: 1,
                select: {
                  id: true,
                  reaction: true,
                  key: true,
                  type: true,
                  action_type: true,
                  content: true,
                  caption: true,
                  size: true,
                  length: true,
                  thumbnail: true,
                  created_at: true,

                  is_edited: true,
                  have_reaction: true,
                  is_forwarded: true,
                  forward_from: true,
                  forward_from_client_id: true,
                  forward_message_id: true,
                  forward_from_channel: {
                    select: {
                      id: true,
                      key: true,
                      username: true,
                      title: true,
                      avatar: true,
                    },
                  },
                  forward_from_client: {
                    select: {
                      id: true,
                      key: true,
                      name: true,
                      surname: true,
                      avatar: true,
                      phone: true,
                    },
                  },
                  is_replied: true,
                  reply_to: {
                    select: {
                      id: true,
                      reaction: true,
                      key: true,
                      type: true,
                      action_type: true,
                      content: true,
                      caption: true,
                      size: true,
                      length: true,
                      thumbnail: true,
                      created_at: true,
                    },
                  },
                  replied_by: {
                    select: {
                      id: true,
                      reaction: true,
                      key: true,
                      content: true,
                      caption: true,
                      size: true,
                      length: true,
                      created_at: true,
                      is_edited: true,
                      is_replied: true,
                      have_reaction: true,
                      type: true,
                    },
                  },
                },
              },
            },
          });
      }

      // update last_message_time
      await this.prismaService.messengerSaveMessageHistory.updateMany({
        where: { key: body.key },
        data: { last_message_time: new Date(Date.now()) },
      });

      const presentedMessage = await this.prepaireMessage(
        saveMessage.messages[0]
      );
      saveMessage.messages = presentedMessage;

      return this.saveMessageTransformer.transform(saveMessage);
    } catch (e) {
      console.log(e);
    }
  }

  private async copyFileForForward(
    content: string,
    key: string,
    enumSource: string
  ) {
    const sourcePath = content.split("/").slice(4).join("/");
    const destinationPath = `uploader/${enumSource}/${key}`;

    const filename = content.split("/").slice(4)[3];
    console.log({ filename });
    return await this.uploadService.copyFile(
      sourcePath,
      destinationPath,
      filename
    );
  }

  public async forwardMessage(messageBody: ForwardMessageInSaveMessage) {
    let messages = messageBody.messages;

    for (let index = 0; index < messageBody.messages.length; index++) {
      let body = messageBody.messages[index];

      if (body.type !== "text") {
        body.content = await this.copyFileForForward(
          body.content,
          messageBody.key,
          UploaderSources.messenger_save_message
        );
      }

      let data: any = {
        is_forwarded: body.is_forwarded,
        forward_message_id: body.forward_message_id,
        action_type: body.action_type,
        forward_from: body.forward_from,
        key: messageBody.key,
        save_message_id: messageBody.save_message_id,
        type: body.type,
        content: body.content,
        caption: body.caption,
        size: body.size,
        length: body.length,
        thumbnail: body.thumbnail,
      } as any;

      if (body.forward_from === "user") {
        data.forward_from_client_id = body.forward_from_id;
      } else if (body.forward_from === "channel") {
        data.forward_from_channel_id = body.forward_from_id;
      }

      // save new message
      let newMessage =
        (await this.prismaService.messengerSaveMessageMessages.create({
          data,
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
            is_edited: true,
            is_replied: true,
            have_reaction: true,
            type: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_message_id: true,
            forward_from_channel: {
              select: {
                id: true,
                key: true,
                username: true,
                title: true,
                avatar: true,
              },
            },
            forward_from_client: {
              select: {
                id: true,
                key: true,
                name: true,
                surname: true,
                avatar: true,
                phone: true,
              },
            },
            replied_by: {
              select: {
                id: true,
                reaction: true,
                key: true,
                content: true,
                caption: true,
                size: true,
                length: true,
                created_at: true,
                is_edited: true,
                is_replied: true,
                have_reaction: true,
                type: true,
              },
            },
          },
        })) as any;

      const prepaireMessage = await this.prepaireMessage(newMessage);

      const transformMessage =
        this.saveMessageTransformer.messageTransformer(prepaireMessage);
      transformMessage.private_id = messageBody.private_id;

      messages[index] = transformMessage;
    }

    // update last_message_time
    await this.prismaService.messengerSaveMessageHistory.updateMany({
      where: { id: messageBody.save_message_id },
      data: { last_message_time: new Date(Date.now()) },
    });

    let saveMessageInfo =
      (await this.prismaService.messengerSaveMessageHistory.findFirst({
        where: { id: messageBody.save_message_id },
      })) as any;
    saveMessageInfo = this.saveMessageTransformer.transform(saveMessageInfo);

    saveMessageInfo.messages = messages;

    return saveMessageInfo;
  }

  async deleteMessage({ room, message_ids }: any) {
    let deleted_messages = [];

    await Promise.all(
      message_ids.map(async (message_id) => {
        const messageInfo =
          await this.prismaService.messengerSaveMessageMessages.findFirst({
            where: { id: message_id },
          });

        await this.prismaService.messengerSaveMessageMessages.delete({
          where: { id: message_id },
        });

        if (messageInfo.type !== "text") {
          this.uploadService.removeFile(
            messageInfo.content,
            `uploader/${UploaderSources.messenger_save_message}/${messageInfo.key}/`
          );
        }

        deleted_messages.push({
          message_id: message_id,
          room,
        });
      })
    );

    const last_message =
      await this.prismaService.messengerSaveMessageMessages.findFirst({
        where: { key: room },
        orderBy: { created_at: "desc" },
      });

    if (last_message) {
      await this.prismaService.messengerSaveMessageHistory.updateMany({
        where: {
          key: room,
        },
        data: {
          last_message_time: last_message.created_at,
        },
      });
    }

    return {
      last_message,
      deleted_messages,
    };
  }

  async getSaveMessage(client_id: number) {
    let saveMessage =
      await this.prismaService.messengerSaveMessageHistory.findFirst({
        where: { client_id },
        select: {
          id: true,
          key: true,
          created_at: true,
          client_id: true,
          last_message_time: true,
          messages: {
            take: 1,
            orderBy: { created_at: "desc" },
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
              is_edited: true,
              is_replied: true,
              have_reaction: true,
              type: true,
              is_forwarded: true,
              action_type: true,
              forward_from: true,
              forward_from_client_id: true,
              forward_message_id: true,
              forward_from_channel: {
                select: {
                  id: true,
                  key: true,
                  username: true,
                  title: true,
                  avatar: true,
                },
              },
              forward_from_client: {
                select: {
                  id: true,
                  key: true,
                  name: true,
                  surname: true,
                  avatar: true,
                  phone: true,
                },
              },
              replied_by: {
                select: {
                  id: true,
                  reaction: true,
                  key: true,
                  content: true,
                  caption: true,
                  size: true,
                  length: true,
                  created_at: true,
                  is_edited: true,
                  is_replied: true,
                  have_reaction: true,
                  type: true,
                },
              },
            },
          },
        },
      });
    if (!saveMessage) {
      saveMessage = await this.storeSaveMessage(client_id);
    }

    const result = await this.presentedMessage(saveMessage);
    return this.saveMessageTransformer.transform(result);
  }

  private async presentedMessage(saveMessage: any) {
    let saveMessageItem = saveMessage as any;

    let last_message =
      (await this.prismaService.messengerSaveMessageMessages.findFirst({
        where: { key: saveMessageItem.key },
        orderBy: { created_at: "desc" },
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
          is_edited: true,
          is_replied: true,
          have_reaction: true,
          type: true,
          is_forwarded: true,
          action_type: true,
          forward_from: true,
          forward_from_client_id: true,
          forward_message_id: true,
          forward_from_channel: {
            select: {
              id: true,
              key: true,
              username: true,
              title: true,
              avatar: true,
            },
          },
          forward_from_client: {
            select: {
              id: true,
              key: true,
              name: true,
              surname: true,
              avatar: true,
              phone: true,
            },
          },
          replied_by: {
            select: {
              id: true,
              reaction: true,
              key: true,
              content: true,
              caption: true,
              size: true,
              length: true,
              created_at: true,
              is_edited: true,
              is_replied: true,
              have_reaction: true,
              type: true,
            },
          },
        },
      })) as any;

    if (last_message) {
      last_message = await this.prepaireMessage(last_message);
    } else {
      saveMessage.messages = null;
    }

    saveMessageItem.messages = last_message;
    return saveMessageItem;
  }

  private async prepaireMessage(last_message: any) {
    if (last_message.is_forwarded) {
      if (last_message.forward_from === "user") {
        const forward_from_client = {
          id: last_message.forward_from_client.id,
          key: last_message.forward_from_client.key,
          title:
            last_message.forward_from_client.name +
            " " +
            last_message.forward_from_client.surname,
          avatar: last_message.forward_from_client.avatar,
        };
        last_message.forward_from_client = forward_from_client;
        last_message.forward_from = last_message.forward_from;
      } else {
        let forward_from_channel = {
          id: 0,
          key: "",
          title: "",
          avatar: "",
        };

        if (last_message.forward_from_channel) {
          forward_from_channel = {
            id: last_message.forward_from_channel.id,
            key: last_message.forward_from_channel.key,
            title: last_message.forward_from_channel.title,
            avatar: last_message.forward_from_channel.avatar,
          };
        }

        last_message.forward_from_channel = forward_from_channel;
        last_message.forward_from = last_message.forward_from;
      }
    }
    return last_message;
  }

  async findMessages(query: GetMessagesDto) {
    try {
      const { condition, total } = await this.generateQuery(query as any);

      const result =
        await this.prismaService.messengerSaveMessageMessages.findMany({
          ...condition,
          orderBy: { created_at: "desc" },
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
            is_edited: true,
            have_reaction: true,
            type: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_message_id: true,
            forward_from_channel: {
              select: {
                id: true,
                key: true,
                username: true,
                title: true,
                avatar: true,
              },
            },
            forward_from_client: {
              select: {
                id: true,
                key: true,
                name: true,
                surname: true,
                avatar: true,
                phone: true,
              },
            },
            is_replied: true,
            reply_to: {
              select: {
                id: true,
                reaction: true,
                key: true,
                type: true,
                action_type: true,
                content: true,
                caption: true,
                size: true,
                length: true,
                thumbnail: true,
                created_at: true,
              },
            },
            replied_by: {
              select: {
                id: true,
                reaction: true,
                key: true,
                content: true,
                caption: true,
                size: true,
                length: true,
                created_at: true,
                is_edited: true,
                is_replied: true,
                have_reaction: true,
                type: true,
              },
            },
          },
        });

      const presentedMessages = await Promise.all(
        result.map(async (item) => {
          return this.prepaireMessage(item);
        })
      );

      const transformer =
        this.saveMessageTransformer.messageCollection(presentedMessages);

      return {
        statusCode: 200,
        data: {
          data: transformer,
          metadata: this.makeMetadata(
            Number(query.page),
            Number(query.per_page),
            Number(total)
          ),
        },
      };
    } catch (error) {
      return { status: 500 };
    }
  }

  private async generateQuery(query: GetMessagesDto) {
    let condition = {};
    let total = 1;

    if (query.type === GetMessagesTypes.pagination) {
      const count = await this.prismaService.messengerSaveMessageMessages.count(
        {
          where: { key: query.key },
        }
      );

      total = this.getTotalPageNumber(Number(count), Number(query.per_page));

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      condition = {
        where: { key: query.key },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      };
    } else if (query.type === GetMessagesTypes.before_date) {
      const count = await this.prismaService.messengerSaveMessageMessages.count(
        {
          where: { key: query.key, created_at: { lt: query.date } },
        }
      );

      total = this.getTotalPageNumber(Number(count), Number(query.per_page));

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      condition = {
        where: { key: query.key, created_at: { lt: query.date } },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      };
    } else if (query.type === GetMessagesTypes.after_date) {
      const count = await this.prismaService.messengerSaveMessageMessages.count(
        {
          where: { key: query.key, created_at: { gt: query.date } },
        }
      );

      total = this.getTotalPageNumber(Number(count), Number(query.per_page));

      const paginationValue = this.makePagination(
        Number(query.page),
        Number(query.per_page)
      );

      condition = {
        where: { key: query.key, created_at: { gt: query.date } },
        skip: paginationValue.offset,
        take: paginationValue.per_page,
      };
    }

    return { condition, total };
  }

  private async generateKey() {
    const key = "MSG_SM_" + randomBytes(12).toString("hex").toUpperCase();
    const isDuplicateChatId =
      await this.prismaService.messengerSaveMessageHistory.findFirst({
        where: { key },
      });
    if (isDuplicateChatId) {
      await this.generateKey();
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
