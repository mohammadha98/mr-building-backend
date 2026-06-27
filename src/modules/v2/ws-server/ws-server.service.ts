import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { PrismaService } from "../../../../prisma/prisma.service";
import {
  LeaveAdvisorRoleInRealEstateDto,
  SendMessageRealEstateWsServerDto,
} from "./dto/real-estate-agent/send-message-realEstateAgent-ws-server.dto";
import WsMessageSources from "./contracts/WsMessageSources";
import ChatRealEstetMessageTransformer from "src/modules/v2/chat-real-estate/app/Transformer";
import statuses from "src/commons/contracts/Statuses";
import { SeenMessageRealEstateAgentChatWsServerDto } from "./dto/real-estate-agent/seen-message-RealEstetAgent-ws-server.dto";
import ClientRoles from "src/commons/contracts/ClientRoles";
import { Socket } from "socket.io";
import WsSocketEventTypes from "./contracts/WsSocketEventTypes";
import { SeenRealEstateChannelWsServerDto } from "./dto/real-estate-agent/seen-real-estate-channel-ws-server.dto";
import {
  ForwardMessageInPrivateChatWsServerDto,
  ForwardMessageInSaveMessage,
  sendMessageForSaveMessage,
  SendMessageMessengerWsServerDto,
} from "./dto/messenger/channel/send-message-rmessenger-ws-server.dto";
import MessengerAppTransformer from "src/modules/v2/messenger/app/Transformer";
import { SeenMessageInMessengerWsServerDto } from "./dto/messenger/seen-message-messenger-ws-server.dto";
import {
  AddMembersInMessengerWsServerDto,
  ChangeMemberRoleToAdminChannel,
  ChangeMemberRoleToAdminGroup,
} from "./dto/messenger/channel/add-members-messenger-ws-server.dto";
import { MessengerChannelsService } from "src/modules/v2/messenger_channels/app/messenger-channels.service";
import { MessengerGroupsService } from "src/modules/v2/messenger_groups/app/messenger-groups.service";
import {
  ForwardMessageIntoChannelMessengerDto,
  SendMessegeInChannelMessengerWsServerDto,
} from "./dto/messenger/channel/send-messege-channel-ws-server.dto";
import MessengerChannelTransformer from "src/modules/v2/messenger_channels/app/Transformer";
import { deleteChannelMessengerWsServerDto } from "./dto/messenger/channel/deleteChannelMessenger-ws-server.dto";
import { AddMembersInGroupMessengerWsServerDto } from "./dto/messenger/channel/add-members-group-messenger-ws-server.dto copy";
import { deleteGroupMessengerWsServerDto } from "./dto/messenger/channel/deleteGroupMessenger-ws-server.dto";
import {
  deleteMessageInMessengerDto,
  ForwardMessagesInGroupMessengerDto,
  SendMessegeInGroupMessengerWsServerDto,
} from "./dto/messenger/channel/send-messege-group-ws-server.dto";
import MessengerGroupsTransformer from "src/modules/v2/messenger_groups/app/Transformer";
import { MemberCountMessengerWsServerDto } from "./dto/messenger/channel/member-count-messenger-ws-server.dto2";
import { LeftMessenger } from "./dto/messenger/LeftMessenger";
import { MessengerService } from "../messenger/app/messenger.service";
import { BlockUserWsServerDto } from "./dto/messenger/channel/block-user-ws-server.dto";
import { SeenChannelMessengerWsServerDto } from "./dto/messenger/channel/seen-channel-messenger-ws-server.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { NotificationsService } from "../notifications/app/notifications.service";
import { ChatMessengerMessages } from "@prisma/client";
import UploaderSources from "src/commons/contracts/UploaderSources";
import UploadService from "src/modules/services/UploadService";
import { MessengerSaveMessageService } from "../messenger-save-message/app/save-message.service";
import { RealEstateAgentsAdvisorsService } from "../real-estate-agents-advisors/app/real-estate-agents-advisors.service";
import { ChangeStatusFoNotificationAlertWsServerDto } from "./dto/messenger/change_status_for_notification_alert-ws-server.dto";
import { SendMessageInMarketplaceWs } from "./dto/marketplace/send-message-in-marketplace-ws.dto";
import { MarketplaceMessengerFactory } from "../marketplace-messenger/app/factory/MarketplaceMessenger-factory";
import { SeenMessageMarketplaceWsDto } from "./dto/marketplace/seen-message-marketplace-ws.dto";

@Injectable()
export class WsServerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly chatRealEstetMessageTransformer: ChatRealEstetMessageTransformer,
    private readonly messengerService: MessengerService,
    private readonly messengerTransformer: MessengerAppTransformer,
    private readonly messengerChannelsService: MessengerChannelsService,
    private readonly messengerGroupsService: MessengerGroupsService,
    private readonly messengerChannelTransformer: MessengerChannelTransformer,
    private readonly messengerGroupTransformer: MessengerGroupsTransformer,
    private readonly notificationsService: NotificationsService,
    private readonly fcmNotificationService: FcmNotificationService,
    private readonly saveMessageService: MessengerSaveMessageService,
    private readonly uploadService: UploadService,
    private readonly advisorsService: RealEstateAgentsAdvisorsService,
    private readonly marketplaceMessengerFactory: MarketplaceMessengerFactory
  ) {
    this.cacheManager.reset();
  }

  // get client information
  public async getClientWithID(client_id: number) {
    return await this.prismaService.client.findUnique({
      where: { id: Number(client_id) },
      select: {
        id: true,
        name: true,
        surname: true,
        phone: true,
        key: true,
        token: true,
        roles: true,
        avatar: true,
        status: true,
        province: true,
        city: true,
        notification_tokens: true,
      },
    });
  }

  // get client information with phone number
  private async getClientWithPhone(phone: string) {
    return await this.prismaService.client.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        surname: true,
        phone: true,
        key: true,
        token: true,
        roles: true,
        avatar: true,
        status: true,
        province: true,
        city: true,
        notification_tokens: true,
      },
    });
  }

  // connectUser
  public async connectUser(clientInfo: any, socketId) {
    clientInfo.socket_id = socketId;
    clientInfo.online = true;
    clientInfo.last_online_time = new Date(Date.now());
    await this.cacheManager.set(clientInfo.phone, clientInfo);
  }

  // disconnect_user
  public async disconnectUser(clientInfo: any) {
    try {
      clientInfo.socket_id = clientInfo.key;
      clientInfo.online = false;
      clientInfo.last_online_time = new Date(Date.now());

      await this.cacheManager.set(clientInfo.phone, clientInfo);
      return;
    } catch (error) {
      return false;
    }
  }

  // send message
  public async sendMessageInRealEstateAgentSection(
    body: SendMessageRealEstateWsServerDto
  ) {
    try {
      const clientInfo = await this.prismaService.client.findFirst({
        where: { id: Number(body.client_id) },
      });
      if (
        clientInfo.roles.includes(ClientRoles.admin) &&
        body.chat_type === ClientRoles.estate_agent
      ) {
        const adminInfo =
          await this.prismaService.realEstateAgentAdmins.findFirst({
            where: { client_id: clientInfo.id },
            select: {
              real_estate_agent: {
                select: { client: { select: { id: true } } },
              },
            },
          });
        body.client_id = adminInfo.real_estate_agent.client.id;
      }

      console.log({ body });

      const destinationClient = (await this.getClientFromDB(
        body.destination_phone
      )) as any;
      let destinationList = [destinationClient.key];

      const sourceClient = (await this.getClientFromDB(
        body.source_phone
      )) as any;
      let sourceList = [sourceClient.key];

      //
      if (destinationClient.roles.includes(ClientRoles.estate_agent)) {
        const adminList = await this.prismaService.realEstateAgents.findFirst({
          where: { client_id: destinationClient.id },
          select: {
            real_estate_agent_admins: {
              select: { client: { select: { key: true } } },
            },
          },
        });

        // TODO: test log
        console.log("*** destination Socket List ***");
        console.log(destinationList);

        const adminKeys = adminList.real_estate_agent_admins.map(
          (item) => item.client.key
        );
        destinationList = [...destinationList, ...adminKeys];

        // TODO: test log
        console.log("*** destination Socket List ***");
        console.log(destinationList);
      }

      //
      if (sourceClient.roles.includes(ClientRoles.estate_agent)) {
        const adminList = await this.prismaService.realEstateAgents.findFirst({
          where: { client_id: sourceClient.id },
          select: {
            real_estate_agent_admins: {
              select: { client: { select: { key: true } } },
            },
          },
        });

        // TODO: test log
        console.log("*** Source Socket List ***");
        console.log(sourceList);

        const adminKeys = adminList.real_estate_agent_admins.map(
          (item) => item.client.key
        );
        sourceList = [...sourceList, ...adminKeys];

        // TODO: test log
        console.log("*** Source Socket List ***");
        console.log(sourceList);
      }

      let message = null;
      const countMessages =
        await this.prismaService.chatRealEstateHistoryMessages.count({
          where: { key: body.key },
        });
      if (countMessages === 0) {
        await this.prismaService.chatRealEstateHistory.updateMany({
          where: { key: body.key },
          data: { status: statuses.active },
        });
      }

      body.destination_id = destinationClient.id;
      message = await this.saveMessageInChatRealEstateMessage(body);
      message.size = body.size;
      message.length = body.length;

      // get chat info
      const chatInfoForStarter = await this.getChatInfoForStarter(
        body,
        message
      );
      const chatInfoForParticipant = await this.getChatInfoForParticipant(
        body,
        message,
        destinationClient.id
      );

      console.log("*** message_side ***");
      console.log(message.message_side);

      return {
        chatInfoForStarter,
        chatInfoForParticipant,
        sourceList,
        destinationList,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // sendMessageInMarketplaceChat
  public async sendMessageInMarketplaceChat(body: SendMessageInMarketplaceWs) {
    try {
      return await this.marketplaceMessengerFactory.saveMessage(body);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // sendMessageIntoRealEstateChannel
  public async sendMessageForRealEstateChannelMembers(
    body: any,
    socket: Socket
  ) {
    try {
      const members =
        await this.prismaService.channelRealEstateMembers.findMany({
          where: { channel_id: body.data.last_message.channel_id },
          select: { client: { select: { key: true } } },
        });

      await Promise.all(
        members.map(async (member) => {
          delete body.data.client_id;
          socket
            .to(member.client.key)
            .emit(WsSocketEventTypes.channel_real_estate, body);
        })
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  // seenChannelRealEstate
  public async seenChannelRealEstate(body: SeenRealEstateChannelWsServerDto) {
    try {
      const memberInfo =
        await this.prismaService.channelRealEstateMembers.findFirst({
          where: {
            client_id: Number(body.client_id),
            channel_id: Number(body.channel_id),
          },
          select: {
            number_of_read_messages: true,
            channel: { select: { number_of_messages: true } },
          },
        });
      let number_of_read_messages =
        body.number_of_seen + memberInfo.number_of_read_messages;
      if (number_of_read_messages > memberInfo.channel.number_of_messages) {
        number_of_read_messages = memberInfo.channel.number_of_messages;
      }
      await this.prismaService.channelRealEstateMembers.updateMany({
        where: {
          client_id: Number(body.client_id),
          channel_id: Number(body.channel_id),
        },
        data: {
          number_of_read_messages: number_of_read_messages,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // seenMessage
  public async seenMessage(body: SeenMessageRealEstateAgentChatWsServerDto) {
    const destinationClient = (await this.getClientFromDB(
      body.destination_phone
    )) as any;

    if (body.source === WsMessageSources.chat_real_estate) {
      await this.prismaService.chatRealEstateHistoryMessages.update({
        where: { id: body.message_id },
        data: { seen: true },
      });
    }
    return {
      dest_user_key: destinationClient.key,
      result: {
        source: body.source,
        key: body.key,
        message_id: body.message_id,
        seen: true,
      },
    };
  }

  // seenManyInRealEstetAgentChat
  public async seenManyInRealEstetAgentChat(
    body: SeenMessageRealEstateAgentChatWsServerDto
  ) {
    const destinationClient = (await this.getClientFromDB(
      body.destination_phone
    )) as any;

    if (body.source === WsMessageSources.chat_real_estate) {
      await this.prismaService.chatRealEstateHistoryMessages.updateMany({
        where: {
          NOT: { client_id: body.client_id },
          key: body.key,
          seen: false,
        },
        data: { seen: true },
      });
    }
    return {
      dest_user_key: destinationClient.key,
      result: {
        source: body.source,
        key: body.key,
        message_id: body.message_id,
        seen: true,
      },
    };
  }

  // getChatInfoForStarter in realEstate Agent
  private async getChatInfoForStarter(
    body: SendMessageRealEstateWsServerDto,
    message: any
  ) {
    // get chat info
    const chatInfoForStarter =
      (await this.prismaService.chatRealEstateHistory.findFirst({
        where: { key: body.key },
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
      })) as any;

    chatInfoForStarter.starter = await this.getRealEstateChatInfo(
      chatInfoForStarter.starter
    );
    chatInfoForStarter.participant = await this.getRealEstateChatInfo(
      chatInfoForStarter.participant
    );

    const number_of_unread_messages =
      await this.getNumberOfUnreadMessagesInRealEstateChatHistory(
        body.key,
        body.client_id
      );

    chatInfoForStarter.number_of_unread_messages = number_of_unread_messages;
    chatInfoForStarter.messages = message;
    chatInfoForStarter.source = body.source;
    chatInfoForStarter.size = body.size;
    chatInfoForStarter.length = body.length;

    const transformer =
      this.chatRealEstetMessageTransformer.transform(chatInfoForStarter);
    return transformer;
  }

  // getChatInfoForParticipant in realEstate Agent
  private async getChatInfoForParticipant(
    body: SendMessageRealEstateWsServerDto,
    message: any,
    client_id: number
  ) {
    // get chat info
    const chatInfoForParticipant =
      (await this.prismaService.chatRealEstateHistory.findFirst({
        where: { key: body.key, NOT: { client_id: body.client_id } },
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
      })) as any;

    chatInfoForParticipant.starter = await this.getRealEstateChatInfo(
      chatInfoForParticipant.starter
    );
    chatInfoForParticipant.participant = await this.getRealEstateChatInfo(
      chatInfoForParticipant.participant
    );

    const number_of_unread_messages =
      await this.getNumberOfUnreadMessagesInRealEstateChatHistory(
        body.key,
        client_id
      );

    chatInfoForParticipant.number_of_unread_messages =
      number_of_unread_messages;
    chatInfoForParticipant.messages = message;
    chatInfoForParticipant.source = body.source;
    chatInfoForParticipant.size = body.size;
    chatInfoForParticipant.length = body.length;

    const transformer = this.chatRealEstetMessageTransformer.transform(
      chatInfoForParticipant
    );
    return transformer;
  }

  private async getNumberOfUnreadMessagesInRealEstateChatHistory(
    key: string,
    client_id: number
  ): Promise<number> {
    const count = await this.prismaService.chatRealEstateHistoryMessages.count({
      where: {
        NOT: { client_id },
        key,
        seen: false,
      },
    });
    return count;
  }

  // saveMessageInChatRealEstateMessage
  private async saveMessageInChatRealEstateMessage(
    body: SendMessageRealEstateWsServerDto
  ) {
    try {
      // save new message
      const message =
        (await this.prismaService.chatRealEstateHistoryMessages.create({
          data: {
            key: body.key,
            client_id: body.client_id,
            message_side: body.message_side,
            destination_id: Number(body.destination_id),
            type: body.type,
            content: body.content,
            size: body.size,
            length: body.length,
            thumbnail: body.thumbnail,
          },
          select: {
            id: true,
            client_id: true,
            type: true,
            message_side: true,
            content: true,
            caption: true,
            created_at: true,
            key: true,
            seen: true,
            size: true,
            length: true,
            thumbnail: true,
          },
        })) as any;
      message.source = body.source;

      // update last_message_time for chat
      await this.prismaService.chatRealEstateHistory.updateMany({
        where: { key: body.key },
        data: { last_message_time: new Date(Date.now()) },
      });
      return message;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // getClientFromDB
  public async getClientFromDB(phone: string) {
    try {
      let client_info = (await this.cacheManager.get(phone)) as any;
      if (!client_info) {
        client_info = (await this.getClientWithPhone(phone)) as any;
        client_info.socket_id = client_info.key;
        client_info.online = false;
        client_info.notification_tokens = client_info.notification_tokens;
        await this.cacheManager.set(phone, client_info);
      }

      return client_info;
    } catch (error) {
      console.log(error);
    }
  }

  // getRealEstateChatInfo
  private async getRealEstateChatInfo(client: any) {
    try {
      if (client.roles.includes(ClientRoles.estate_agent)) {
        const info = (await this.prismaService.realEstateAgents.findFirst({
          where: { client_id: client.id },
          select: {
            id: true,
            name: true,
            avatar: true,
            client: { select: { phone: true } },
          },
        })) as any;
        client = {
          id: client.id,
          name: info.name,
          avatar: info.avatar,
          phone: client.phone,
        };
      } else {
        client = client;
        client.name =
          client && client.surname
            ? client.name + " " + client.surname
            : client.name;
      }
      return client;
    } catch (error) {
      return false;
    }
  }

  // send message in Messenger
  public async sendMessageInMessenger(body: SendMessageMessengerWsServerDto) {
    try {
      const sourceClient = (await this.getClientFromDB(
        body.source_phone
      )) as any;
      body.source_key = sourceClient.key;

      const destinationClient = (await this.getClientFromDB(
        body.destination_phone
      )) as any;

      body.destination_id = destinationClient.id;
      body.destination_key = destinationClient.key;

      const totalMessage = await this.prismaService.chatMessengerMessages.count(
        {
          where: { chat_key: body.key },
        }
      );

      if (totalMessage === 0) {
        await this.prismaService.chatMessengerHistory.updateMany({
          where: { key: body.key },
          data: { status: statuses.active },
        });
      }

      const message = await this.saveMessageInMessenger(body);

      return await this.getChatInfoForStarterInMessenger(body, message);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async sendMessageInSaveMessage(body: SendMessageMessengerWsServerDto) {
    try {
      return await this.saveMessageService.saveNewMessage(body);
    } catch (error) {
      return false;
    }
  }

  // saveMessageInMessenger
  private async saveMessageInMessenger(
    body: SendMessageMessengerWsServerDto
  ): Promise<Partial<ChatMessengerMessages>> {
    try {
      // save new message
      let message;
      if (body.is_edited && body.message_id) {
        message = await this.prismaService.chatMessengerMessages.update({
          where: { id: Number(body.message_id) },
          data: {
            is_edited: true,
            type: body.type,
            // seen: false,
            content: body.content,
            caption: body.caption,
            size: body.size,
            length: body.length,
            thumbnail: body.thumbnail,
          },
          select: {
            id: true,
            reaction: true,
            chat_key: true,
            content: true,
            caption: true,
            size: true,
            length: true,
            thumbnail: true,
            created_at: true,
            seen: true,
            is_edited: true,
            is_replied: true,
            is_blocked: true,
            have_reaction: true,
            type: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_from_channel: {
              select: {
                id: true,
                key: true,
                title: true,
                avatar: true,
              },
            },
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
            replied_by: {
              select: {
                id: true,
                reaction: true,
                chat_key: true,
                content: true,
                caption: true,
                size: true,
                length: true,
                created_at: true,
                seen: true,
                is_edited: true,
                is_replied: true,
                have_reaction: true,
                type: true,
              },
            },
          },
        });
      } else {
        let data: any = {
          is_blocked: body.is_blocked,
          chat_key: body.key,
          action_type: body.action_type,
          is_replied: body.is_reply,
          client: { connect: { id: Number(body.client_id) } },
          destination_id: Number(body.destination_id),
          type: body.type,
          content: body.content,
          caption: body.caption,
          size: body.size,
          length: body.length,
          thumbnail: body.thumbnail,
        };
        if (body.is_reply && body.action_type === "reply") {
          data.reply_to = { connect: { id: +body.reply_to } };
        }

        message = await this.prismaService.chatMessengerMessages.create({
          data,
          select: {
            id: true,
            reaction: true,
            chat_key: true,
            content: true,
            caption: true,
            size: true,
            length: true,
            thumbnail: true,
            created_at: true,
            seen: true,
            is_edited: true,
            is_blocked: true,
            have_reaction: true,
            type: true,
            is_forwarded: true,
            action_type: true,
            forward_from: true,
            forward_from_client_id: true,
            forward_from_channel: {
              select: {
                id: true,
                key: true,
                title: true,
                avatar: true,
              },
            },
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
            is_replied: true,
            reply_to: {
              select: {
                id: true,
                reaction: true,
                chat_key: true,
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

            replied_by: {
              select: {
                id: true,
                reaction: true,
                chat_key: true,
                content: true,
                caption: true,
                size: true,
                length: true,
                created_at: true,
                seen: true,
                is_edited: true,
                is_replied: true,
                have_reaction: true,
                type: true,
              },
            },
          },
        });
      }

      // update last_message_time for chat
      await this.prismaService.chatMessengerHistory.updateMany({
        where: { key: body.key },
        data: { last_message_time: new Date(Date.now()) },
      });
      return message;
    } catch (error) {
      console.log("****** Error In Save Message In Messenger ******");
      console.log(error);
    }
  }

  // send message in Messenger
  public async forwardMessageInChat(
    body: ForwardMessageInPrivateChatWsServerDto
  ) {
    try {
      body.destination_id = body.destination_id;

      return await this.forwardMessageIntoPrivateChat(body);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // saveMessageInMessenger
  private async forwardMessageIntoPrivateChat(
    data: ForwardMessageInPrivateChatWsServerDto
  ): Promise<Partial<ChatMessengerMessages>> {
    try {
      let messages = data.messages;

      for (let index = 0; index < data.messages.length; index++) {
        const body = data.messages[index];

        if (body.type !== "text") {
          body.content = await this.copyFileForForward(
            body.content,
            data.key,
            UploaderSources.messenger
          );
        }

        let createData: any = {
          is_forwarded: body.is_forwarded,
          forward_message_id: body.forward_message_id,
          action_type: body.action_type,
          forward_from: body.forward_from,
          chat_key: data.key,
          client_id: Number(data.client_id),
          destination_id: Number(data.destination_id),
          type: body.type,
          content: body.content,
          caption: body.caption,
          size: body.size,
          length: body.length,
          thumbnail: body.thumbnail,
        } as any;

        let forward_from_client = null;
        if (body.forward_from === "user") {
          createData.forward_from_client_id = body.forward_from_id as any;
          const clientInfo = await this.getClientWithID(body.forward_from_id);
          if (clientInfo) {
            forward_from_client = {
              id: clientInfo.id,
              key: "",
              title: clientInfo.name + " " + clientInfo.surname,
              avatar: clientInfo.avatar,
            };
          }
        } else if (body.forward_from === "channel") {
          createData.forward_from_channel_id = body.forward_from_id as any;
        }

        console.log({ createData });

        // save new message
        let newMessage = (await this.prismaService.chatMessengerMessages.create(
          {
            data: createData,
            select: {
              id: true,
              reaction: true,
              chat_key: true,
              content: true,
              caption: true,
              size: true,
              length: true,
              thumbnail: true,
              created_at: true,
              seen: true,
              is_edited: true,
              is_replied: true,
              is_blocked: true,
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
                  title: true,
                  avatar: true,
                },
              },
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
              replied_by: {
                select: {
                  id: true,
                  reaction: true,
                  chat_key: true,
                  content: true,
                  caption: true,
                  size: true,
                  length: true,
                  created_at: true,
                  seen: true,
                  is_edited: true,
                  is_replied: true,
                  have_reaction: true,
                  type: true,
                },
              },
            },
          }
        )) as any;

        newMessage.forward_from_client = forward_from_client;
        const transformer =
          this.messengerTransformer.messageTransformer(newMessage);

        transformer.private_id = body.private_id;
        transformer.is_blocked = body.chat_blocking_status;

        messages[index] = transformer;
      }

      // update last_message_time for chat
      await this.prismaService.chatMessengerHistory.updateMany({
        where: { key: data.key },
        data: { last_message_time: new Date(Date.now()) },
      });

      const chatInfo = (await this.prismaService.chatMessengerHistory.findFirst(
        {
          where: {
            key: data.key,
          },
          select: {
            id: true,
            key: true,
            last_message_time: true,
            created_at: true,
            type: true,
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
        }
      )) as any;
      const transform = this.messengerTransformer.transform(chatInfo) as any;
      transform.messages = messages as any;

      return transform;
    } catch (error) {
      console.log("****** Error In Forward Message in : Private Chat ******");
      console.log(error);
    }
  }

  private async getChatInfoForStarterInForwardMessages(
    body: ForwardMessageInPrivateChatWsServerDto,
    message: any
  ) {
    const chatInfoForStarter =
      (await this.prismaService.chatMessengerHistory.findFirst({
        where: {
          key: body.key,
          client_id: body.client_id,
        },
        select: {
          id: true,
          key: true,
          last_message_time: true,
          created_at: true,
          type: true,
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
      })) as any;

    const number_of_unread_messages =
      await this.getNumberOfUnreadMessagesInMessengerHistory(
        body.key,
        body.client_id
      );

    chatInfoForStarter.number_of_unread_messages = number_of_unread_messages;
    chatInfoForStarter.messages = message;
    chatInfoForStarter.size = message.size;
    chatInfoForStarter.length = message.length;

    return this.messengerTransformer.transform(chatInfoForStarter);
  }

  public async forwardMessageIntoSaveMessage(
    body: ForwardMessageInSaveMessage
  ) {
    try {
      return await this.saveMessageService.forwardMessage(body);
    } catch (error) {
      console.log("****** Error In Forward Message in : Save Message ******");
      console.log(error);
    }
  }

  private async getChatInfoForStarterInMessenger(
    body: SendMessageMessengerWsServerDto,
    message: any
  ) {
    const chatInfoForStarter =
      (await this.prismaService.chatMessengerHistory.findFirst({
        where: {
          key: body.key,
          client_id: body.client_id,
        },
        select: {
          id: true,
          key: true,
          last_message_time: true,
          created_at: true,
          type: true,
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
      })) as any;

    const number_of_unread_messages =
      await this.getNumberOfUnreadMessagesInMessengerHistory(
        body.key,
        body.client_id
      );
    console.log(
      "Starter number_of_unread_messages ",
      number_of_unread_messages
    );

    chatInfoForStarter.number_of_unread_messages = number_of_unread_messages;
    chatInfoForStarter.messages = message;
    chatInfoForStarter.size = body.size;
    chatInfoForStarter.length = body.length;

    return this.messengerTransformer.transform(chatInfoForStarter);
  }

  private async getNumberOfUnreadMessagesInMessengerHistory(
    chat_key: string,
    client_id: number
  ): Promise<number> {
    const count = await this.prismaService.chatMessengerMessages.count({
      where: {
        destination_id: client_id,
        chat_key,
        seen: false,
      },
    });
    return count;
  }

  // seenManyInMessenger
  public async seenMessenger(body: SeenMessageInMessengerWsServerDto) {
    try {
      const destinationClient = (await this.getClientFromDB(
        body.destination_phone
      )) as any;
      body.destination_key = destinationClient.key;

      await this.prismaService.chatMessengerMessages.updateMany({
        where: {
          OR: body.message_ids.map((id) => ({
            id: id,
            chat_key: body.chat_key,
            NOT: { client_id: body.client_id },
          })),
        },
        data: { seen: true },
      });

      return body;
    } catch (e) {
      console.log("Error: seenMessenger");
      console.log(e);
    }
  }

  // seenChannelMessenger
  public async seenChannelMessenger(body: SeenChannelMessengerWsServerDto) {
    const userChannel =
      await this.prismaService.messengerChannlesMembers.findFirst({
        where: {
          client_id: body.client_id,
          channel_id: body.item_id,
        },
      });

    await this.prismaService.messengerChannlesMembers.update({
      where: {
        id: body.item_id,
      },
      data: {
        number_of_read_messages:
          userChannel.number_of_read_messages + body.number_of_read_messages,
      },
    });

    return {
      result: {
        key: body.key,
        seen: true,
      },
    };
  }

  // seenGroupMessenger
  public async seenGroupMessenger(body: SeenChannelMessengerWsServerDto) {
    const userGroup = await this.prismaService.messengerGroupsMembers.findFirst(
      {
        where: {
          client_id: body.client_id,
          group_id: body.item_id,
        },
      }
    );

    await this.prismaService.messengerGroupsMembers.update({
      where: {
        id: body.item_id,
      },
      data: {
        number_of_read_messages:
          userGroup.number_of_read_messages + body.number_of_read_messages,
      },
    });

    return {
      result: {
        key: body.key,
        seen: true,
      },
    };
  }

  // deleteChannelMessenger
  public async deleteChannelMessenger(body: deleteChannelMessengerWsServerDto) {
    const result = await this.messengerChannelsService.deleteChannel(body);

    console.log({ result });

    const membersNotificationToken = [];
    await Promise.all(
      result.map(async (member: any) => {
        const clientInfo =
          await this.notificationsService.getClientNotificationToken(
            member.client_id
          );
        const clientTokens = clientInfo.map((item) => item);
        membersNotificationToken.push(...clientTokens);
      })
    );

    console.log("membersNotificationToken");
    console.log(membersNotificationToken);

    if (membersNotificationToken.length) {
      await this.fcmNotificationService.unSubscribeToTopic(
        membersNotificationToken,
        body.key
      );
    }

    return result;
  }

  public async getClientNotificationToken(clientId: number): Promise<string[]> {
    return await this.notificationsService.getClientNotificationToken(clientId);
  }

  // deleteGroupMessenger
  public async deleteGroupMessenger(body: deleteGroupMessengerWsServerDto) {
    const result = await this.messengerGroupsService.deleteGroup(body);

    const membersNotificationToken = [];
    await Promise.all(
      result.map(async (member: any) => {
        const clientInfo =
          await this.notificationsService.getClientNotificationToken(
            member.client_id
          );
        const clientTokens = clientInfo.map((item) => item);
        membersNotificationToken.push(...clientTokens);
      })
    );

    return membersNotificationToken;
  }

  // sendMessageInGroupMessenger
  public async sendMessageInGroupMessenger(
    body: SendMessegeInGroupMessengerWsServerDto
  ) {
    const newMessege = await this.messengerGroupsService.saveNewMessage(
      body,
      body.client_id
    );
    return this.messengerGroupTransformer.transform(
      newMessege,
      body.client_id
    ) as any;
  }

  public async forwardMessageIntoGroup(
    body: ForwardMessagesInGroupMessengerDto
  ) {
    return await this.messengerGroupsService.forwardMessage(body);
  }

  // sendMessageInChannelMessenger
  public async sendMessageInChannelMessenger(
    body: SendMessegeInChannelMessengerWsServerDto
  ) {
    const newMessage = await this.messengerChannelsService.saveNewMessage(
      body,
      body.client_id
    );
    const transformer = this.messengerChannelTransformer.transform(
      newMessage,
      body.client_id
    ) as any;
    transformer.source = "channel_messenger";
    return transformer;
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

  public async forwardMessageToChannel(
    body: ForwardMessageIntoChannelMessengerDto
  ) {
    return await this.messengerChannelsService.forwardedMessageHanlder(body);
  }

  // add Members In Group Messenger
  public async addMembersInGroupMessenger(
    body: AddMembersInGroupMessengerWsServerDto
  ) {
    const validationChannel = await this.messengerGroupsService.findOneByID(
      body.group_info.id
    );
    if (validationChannel) {
      const result = await this.messengerGroupsService.addMembers(
        body.members,
        body.group_info.id
      );

      let membersNotificationToken = [];
      await Promise.all(
        body.members.map(async (member: any) => {
          const clientTokens =
            await this.notificationsService.getClientNotificationToken(
              member.client_id
            );
          membersNotificationToken = [
            ...membersNotificationToken,
            ...clientTokens,
          ];
        })
      );

      await this.fcmNotificationService.subscribeToTopic(
        membersNotificationToken,
        body.group_info.key
      );

      return {
        member_count: result.member_count,
        member_ids: result.member_ids,
        notification_tokens: membersNotificationToken,
      };
    }
    return {};
  }

  // addMembersInChannelMessenger
  public async addMembersInChannelMessenger(
    body: AddMembersInMessengerWsServerDto
  ) {
    const validationChannel = await this.messengerChannelsService.findOneByID(
      body.channel_info.id
    );
    if (validationChannel) {
      const result = await this.messengerChannelsService.addMembers(
        body.members,
        body.channel_info.id
      );

      let membersNotificationToken = [];
      await Promise.all(
        body.members.map(async (member: any) => {
          const clientTokens =
            await this.notificationsService.getClientNotificationToken(
              member.client_id
            );
          membersNotificationToken = [
            ...membersNotificationToken,
            ...clientTokens,
          ];
        })
      );

      console.log("membersNotificationToken");
      console.log(membersNotificationToken);

      await this.fcmNotificationService.subscribeToTopic(
        membersNotificationToken,
        body.channel_info.key
      );

      return {
        member_count: result.member_count,
        notification_tokens: membersNotificationToken,
      };
    }
    return {};
  }

  public async joinedGroupMessenger(body: MemberCountMessengerWsServerDto) {
    const result = await this.messengerGroupsService.joinGroup({
      client_id: body.client_id,
      group_id: body.item_id,
    });

    const membersNotificationToken = [];
    const clientInfo =
      await this.notificationsService.getClientNotificationToken(
        body.client_id
      );
    const clientTokens = clientInfo.map((item) => item);
    membersNotificationToken.push(...clientTokens);

    console.log("memeber NotificationTokens");
    console.log(membersNotificationToken);

    await this.fcmNotificationService.subscribeToTopic(
      membersNotificationToken,
      body.source_key
    );

    return result;
  }

  public async joinedChannelMessenger(body: MemberCountMessengerWsServerDto) {
    const result = await this.messengerChannelsService.joinChannel({
      client_id: body.client_id,
      channel_id: body.item_id,
    });

    const membersNotificationToken = [];
    const clientInfo =
      await this.notificationsService.getClientNotificationToken(
        body.client_id
      );
    const clientTokens = clientInfo.map((item) => item);
    membersNotificationToken.push(...clientTokens);

    console.log("memeber NotificationTokens");
    console.log(membersNotificationToken);

    await this.fcmNotificationService.subscribeToTopic(
      membersNotificationToken,
      body.source_key
    );
    return { status: result.status, member_count: result.member_count };
  }

  public async LeftMessenger(body: LeftMessenger) {
    let result;
    if (body.source_type === "group") {
      result = await this.messengerGroupsService.leaveGroup(body);
    } else {
      result = await this.messengerChannelsService.leaveChannel(body);
    }

    const membersNotificationToken = [];
    const clientInfo =
      await this.notificationsService.getClientNotificationToken(
        body.client_id
      );
    const clientTokens = clientInfo.map((item) => item);
    membersNotificationToken.push(...clientTokens);

    console.log("NotificationTokens");
    console.log(membersNotificationToken);

    await this.fcmNotificationService.unSubscribeToTopic(
      membersNotificationToken,
      body.source_key
    );

    return result;
  }

  // joinToPrivateChat
  public async joinIntoPrivateRoom(body: any) {
    return await this.getClientWithID(body.client_id);
  }

  // joinToPrivateChat
  public async joinToPrivateChat(body: any) {
    const chatList = await this.messengerService.getChatKeys(body.client_id);
    return chatList;
  }

  // joinTheChannels
  public async joinTheChannels(body: any) {
    const channelsKey = await this.messengerChannelsService.getChannelsKey(
      body.client_id
    );
    return channelsKey;
  }

  // joinInSaveMessage
  public async joinInSaveMessage(body: any) {
    return await this.saveMessageService.getSaveMessage(body.client_id);
  }

  // joinTheGroups
  public async joinTheGroups(body: any) {
    return await this.messengerGroupsService.getGroupsKey(body.client_id);
  }

  // joinTheRealEstateAgent Room
  public async joinTheRealEstateAgentRoom(body: any) {
    return await this.prismaService.realEstateAgents.findFirst({
      where: {
        client_id: body.client_id,
      },
    });
  }

  // joinTheStorefront Room
  public async getStorefrontInfo(body: any) {
    return await this.prismaService.storefront.findFirst({
      where: {
        client_id: body.client_id,
      },
    });
  }

  // get marketplace chat list
  public async getMarketplaceChatList(body: any) {
    return this.prismaService.marketplaceMessengerHistory.findMany({
      where: {
        OR: [
          {
            type: "starter",
            starter_id: body.client_id,
          },
          {
            type: "participant",
            participant_id: body.client_id,
          },
        ],
      },
    });
  }

  // blockUser
  public async blockUser(body: BlockUserWsServerDto) {
    const participantInfo = await this.getClientWithID(body.destination_id);

    await this.messengerService.blockUser(body.source_id, body.destination_id);

    return { participantKey: participantInfo.key, source_key: body.source_key };
  }

  // blockUser
  public async unblockUser(body: BlockUserWsServerDto) {
    const participantInfo = await this.getClientWithID(body.destination_id);

    await this.messengerService.unblockUser(
      body.source_id,
      body.destination_id
    );

    return { participantKey: participantInfo.key, source_key: body.source_key };
  }

  // delete message in private chat
  public async deleteMessageInChat(body: deleteMessageInMessengerDto) {
    try {
      const Client = await this.getClientFromDB(body.destination_phone);
      const result = await this.messengerService.deleteMessageInChat({
        isOnline: Client.online,
        client_id: Client.id,
        message_ids: body.item_ids,
        type: body.type,
        room: body.room,
      });

      const transformer = this.messengerTransformer.messageTransformer(
        result.last_message
      );

      return {
        transformer,
        deleted_messages: result.deleted_messages,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async deleteMessageInMarketplaceChat(
    body: deleteMessageInMessengerDto
  ) {
    try {
      const Client = await this.getClientFromDB(body.destination_phone);
      const result = await this.marketplaceMessengerFactory.deleteMessage({
        isOnline: Client.online,
        client_id: Client.id,
        message_ids: body.item_ids,
        type: body.type,
        room: body.room,
      });

      return {
        transformer: result.last_message,
        deleted_messages: result.deleted_messages,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async seenMessagesInMarketplaceChat(
    body: SeenMessageMarketplaceWsDto
  ) {
    return await this.marketplaceMessengerFactory.seenMessages(body);
  }

  // delete message in channel messenger
  public async deleteMessageInChannelMessenger(
    body: deleteMessageInMessengerDto
  ) {
    try {
      const result = await this.messengerChannelsService.deleteMessage(
        body.item_ids,
        body.type,
        body.room
      );

      console.log({ result });

      if (result) {
        let transformer = null;
        if (result.last_message) {
          transformer = this.messengerChannelTransformer.messageTransformer(
            result.last_message
          );
        }

        return {
          transformer,
          deleted_messages: result.deleted_messages,
        };
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // delete message in channel messenger
  public async deleteMessageInGroupMessenger(
    body: deleteMessageInMessengerDto
  ) {
    try {
      const result = await this.messengerGroupsService.deleteMessage(
        body.item_ids,
        body.type,
        body.room
      );

      console.log({ result });

      if (result) {
        let transformer = null;
        if (result.last_message) {
          transformer = this.messengerGroupTransformer.messageTransformer(
            result.last_message
          );
        }
        return {
          transformer,
          deleted_messages: result.deleted_messages,
        };
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async deleteMessageInSaveMessage(body: deleteMessageInMessengerDto) {
    try {
      return await this.saveMessageService.deleteMessage({
        room: body.room,
        message_ids: body.item_ids,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async ChangeMemberRoleToAdminChannel(
    body: ChangeMemberRoleToAdminChannel
  ) {
    return await this.messengerChannelsService.ChangeMemberRoleToAdminChannel(
      body
    );
  }

  public async ChangeMemberRoleToAdminGroup(
    body: ChangeMemberRoleToAdminGroup
  ) {
    return await this.messengerGroupsService.ChangeMemberRoleToAdminGroup(body);
  }

  // leaveAdvisorRoleInRealEstate
  public async leaveAdvisorRoleInRealEstate(
    body: LeaveAdvisorRoleInRealEstateDto
  ) {
    try {
      return await this.advisorsService.removeAdvisorInRealEstate(body);
    } catch (error) {
      return false;
    }
  }

  public async changeStatusForNotificationAlert(
    body: ChangeStatusFoNotificationAlertWsServerDto
  ) {
    try {
      let result = false;
      if (body.target === "channel_messenger") {
        result =
          await this.messengerChannelsService.changeStatusForNotificationAlert(
            body
          );
      }
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
