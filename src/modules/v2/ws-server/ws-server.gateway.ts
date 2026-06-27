import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from "@nestjs/websockets";
import { WsServerService } from "./ws-server.service";
import {
  LeaveAdvisorRoleInRealEstateDto,
  SendMessageRealEstateWsServerDto,
} from "./dto/real-estate-agent/send-message-realEstateAgent-ws-server.dto";
import WsSocketEventTypes from "./contracts/WsSocketEventTypes";
import { Logger, UseGuards } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ConnectUserWsServerDto } from "./dto/connect-user-ws-server.dto";
import WsSocketResponseCodes from "./contracts/WsSocketResponseCodes";
import { SeenMessageRealEstateAgentChatWsServerDto } from "./dto/real-estate-agent/seen-message-RealEstetAgent-ws-server.dto";
import { SeenRealEstateChannelWsServerDto } from "./dto/real-estate-agent/seen-real-estate-channel-ws-server.dto";
import {
  ForwardMessageInPrivateChatWsServerDto,
  ForwardMessageInSaveMessage,
  SendMessageMessengerWsServerDto,
  StartChatInMessengerDTO,
} from "./dto/messenger/channel/send-message-rmessenger-ws-server.dto";
import { SeenMessageInMessengerWsServerDto } from "./dto/messenger/seen-message-messenger-ws-server.dto";
import {
  AddMembersInMessengerWsServerDto,
  ChangeMemberRoleToAdminChannel,
  ChangeMemberRoleToAdminGroup,
} from "./dto/messenger/channel/add-members-messenger-ws-server.dto";
import {
  ForwardMessageIntoChannelMessengerDto,
  SendMessegeInChannelMessengerWsServerDto,
} from "./dto/messenger/channel/send-messege-channel-ws-server.dto";
import { JoinRoomWsServerDto } from "./dto/join-room-ws-server.dto";
import { deleteChannelMessengerWsServerDto } from "./dto/messenger/channel/deleteChannelMessenger-ws-server.dto";
import { AddMembersInGroupMessengerWsServerDto } from "./dto/messenger/channel/add-members-group-messenger-ws-server.dto copy";
import { deleteGroupMessengerWsServerDto } from "./dto/messenger/channel/deleteGroupMessenger-ws-server.dto";
import {
  deleteMessageInMessengerDto,
  ForwardMessagesInGroupMessengerDto,
  SendMessegeInGroupMessengerWsServerDto,
} from "./dto/messenger/channel/send-messege-group-ws-server.dto";
import { MemberCountMessengerWsServerDto } from "./dto/messenger/channel/member-count-messenger-ws-server.dto2";
import { LeftMessenger } from "./dto/messenger/LeftMessenger";
import { UpdateChannelMessenger } from "./dto/messenger/group/UpdateChannelMessenger";
import { BlockUserWsServerDto } from "./dto/messenger/channel/block-user-ws-server.dto";
import { SeenChannelMessengerWsServerDto } from "./dto/messenger/channel/seen-channel-messenger-ws-server.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { TokenService } from "../jwt-auth/services/TokenService";
import ClientTokenAuthGuardSocket from "../jwt-auth/ClientTokenAuthGuard_Socket";
import { ChangeStatusFoNotificationAlertWsServerDto } from "./dto/messenger/change_status_for_notification_alert-ws-server.dto";
import { SendMessageInMarketplaceWs } from "./dto/marketplace/send-message-in-marketplace-ws.dto";
import { SeenMessageMarketplaceWsDto } from "./dto/marketplace/seen-message-marketplace-ws.dto";

@WebSocketGateway({
  transports: ["polling", "websocket"],
  cors: {
    origin: "*",
  },
  allowUpgrades: true,
  allowEIO3: true,
})
export class WsServerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger();
  @WebSocketServer() server: Server;

  constructor(
    private readonly wsServerService: WsServerService,
    private readonly fcmNotificationService: FcmNotificationService,
    private readonly tokenService: TokenService
  ) {}

  async handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    this.logger.log(`handleConnection: Client connected ${socket.id}`);
  }

  private async joinToRequirementRooms(client_id: number, socket: Socket) {
    // join the user key and private room
    const userKey = await this.wsServerService.joinIntoPrivateRoom({
      client_id,
    });

    console.log("joinIntoPrivateRoom");
    console.log(userKey.key);

    socket.join(userKey.key);
    socket.removeAllListeners(userKey.key);

    // join the private chat
    const chatList = await this.wsServerService.joinToPrivateChat({
      client_id,
    });
    chatList.map((item) => {
      socket.removeAllListeners(item.key);
      socket.join(item.key);
    });

    // join the channels
    const channels = await this.wsServerService.joinTheChannels({
      client_id,
    });
    channels.map((item) => {
      socket.removeAllListeners(item.channel.key);
      socket.join(item.channel.key);
    });

    // join the channels
    const saveMessage = await this.wsServerService.joinInSaveMessage({
      client_id,
    });
    socket.join(saveMessage.key);
    socket.removeAllListeners(saveMessage.key);

    // join the groups
    const groups = await this.wsServerService.joinTheGroups({
      client_id,
    });
    groups.map((item) => {
      socket.removeAllListeners(item.group.key);
      socket.join(item.group.key);
    });

    // join the storefront room
    const storefront = await this.wsServerService.getStorefrontInfo({
      client_id,
    });
    if (storefront) {
      socket.removeAllListeners(storefront.trackingCode);
      socket.join(storefront.trackingCode);
    }

    // join the marketplaceChat
    const marketplaceChatList =
      await this.wsServerService.getMarketplaceChatList({
        client_id,
      });
    marketplaceChatList.map((item) => {
      socket.removeAllListeners(item.key);
      socket.join(item.key);
    });

    // join The RealEstateAgent Room
    const realEstateInfo =
      await this.wsServerService.joinTheRealEstateAgentRoom({
        client_id,
      });
    if (realEstateInfo) {
      console.log("joinTheRealEstateAgentRoom");
      console.log(realEstateInfo.tracking_code);

      socket.removeAllListeners(realEstateInfo.tracking_code);
      socket.join(realEstateInfo.tracking_code);
    }
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("------------------------");
    this.logger.log(`handleDisconnect: Client disconnected ${socket.id}`);

    const authorization = socket.handshake.headers.authorization
      ? socket.handshake.headers.authorization
      : socket.handshake.query["authorization"];

    if (authorization) {
      const token = this.tokenService.verifyClientToken(
        authorization as string
      );

      const client = await this.wsServerService.getClientWithID(token);

      console.log({
        clientId: client.id,
        phone: client.phone,
      });

      await this.wsServerService.disconnectUser(client);
      socket.leave(client.key);
    }

    console.log("------------------------");
  }

  afterInit(server: Server) {
    this.logger.log("Initializing AppGateway");
    console.log(server);
  }

  // connect_user
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.connect_user)
  async connectUser(
    @MessageBody() body: ConnectUserWsServerDto,
    @ConnectedSocket() socket: Socket
  ) {
    console.log("------------------------");
    this.logger.log(`connect_user: Client connected ${socket.id}`);
    console.log({
      clientId: socket.data.id,
      phone: socket.data.phone,
    });

    await this.joinToRequirementRooms(socket.data.id, socket);
    await this.wsServerService.connectUser(socket.data, socket.id);

    console.log("------------------------");
  }

  @SubscribeMessage("error")
  handleError(@ConnectedSocket() socket: Socket) {
    console.log("handleError");
    console.log(socket);
  }

  @SubscribeMessage("connect_error")
  handle_connect_error(@ConnectedSocket() socket: Socket) {
    console.log("handle_connect_error");
    console.log(socket);
  }

  // join_room
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.join_room)
  async joinRoom(
    @MessageBody() body: JoinRoomWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    try {
      body.client_id = socket.data.id;
      console.log("*** join_room ***");
      console.log({ body });

      socket.join(body.room_id);

      // subscribe client into chat room in FCM
      const notificationTokens =
        await this.wsServerService.getClientNotificationToken(body.client_id);
      if (notificationTokens.length > 0) {
        await this.fcmNotificationService.subscribeToTopic(
          notificationTokens,
          body.room_id
        );
      }
    } catch (e) {
      console.log("Error In JoinRoom");
      console.log(e);
    }
  }

  // leave_room
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.leave_room)
  async leave_room(
    @MessageBody() body: JoinRoomWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    body.client_id = socket.data.id;
    console.log("*** leave_room ***");
    console.log({ body });

    socket.leave(body.room_id);
  }

  // disconnect_user
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.disconnect_user)
  async disconnect_user(
    @MessageBody() body: ConnectUserWsServerDto,
    @ConnectedSocket() socket: Socket
  ) {
    // TODO: log in WS Server
    console.log("------------------------");
    const client = socket.data;

    console.log(`*** disconnected_user User: ${socket.id} ***`);
    console.log({
      clientId: client.id,
      phone: client.phone,
    });

    socket.leave(client.key);

    await this.wsServerService.disconnectUser(client);
    console.log("------------------------");
  }

  // sendMessage in chat real estate agent
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.message_real_estate_agent)
  async sendMessageInRealEstateAgent(
    @MessageBody() body: SendMessageRealEstateWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    body.user_key = client.key;

    body.socket_id = socket.id;

    // TODO: log in WS Server
    console.log(`*** SendMessage in : Real_estate_agent ***`);

    const result: any =
      await this.wsServerService.sendMessageInRealEstateAgentSection(body);

    result.chatInfoForStarter.private_id = body.private_id;
    result.chatInfoForParticipant.private_id = body.private_id;

    // send message to starter
    result.sourceList.map((socket) => {
      if (socket !== undefined) {
        this.server
          .to(socket)
          .emit(
            WsSocketEventTypes.message_real_estate_agent,
            this.presentedResponse(
              WsSocketResponseCodes.created_response,
              "پیام شما با موفقیت ارسال شد.",
              result.chatInfoForStarter
            )
          );
      }
    });

    // send message to destination client
    result.destinationList.map((socket) => {
      if (socket !== undefined) {
        this.server
          .to(socket)
          .emit(
            WsSocketEventTypes.message_real_estate_agent,
            this.presentedResponse(
              WsSocketResponseCodes.created_response,
              "پیام جدید دریافت شد.",
              result.chatInfoForParticipant
            )
          );
      }
    });
  }

  // sendMessage in chat real estate agent
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.send_message_in_marketplace_chat)
  async sendMessageInMarketplaceChat(
    @MessageBody() body: SendMessageInMarketplaceWs,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    body.user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** send_message_in_marketplace_chat ***`);

    const result = (await this.wsServerService.sendMessageInMarketplaceChat(
      body
    )) as any;

    result.private_id = body.private_id;
    result.message_side = body.message_side;
    result.source = "marketplace_chat";

    this.server
      .to(body.key)
      .emit(
        WsSocketEventTypes.send_message_in_marketplace_chat,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "پیام شما با موفقیت ارسال شد.",
          result
        )
      );
  }

  // delete message in private chat
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_message_in_marketplace_chat)
  async deleteMessageInMarketplaceChat(
    @MessageBody() body: deleteMessageInMessengerDto
  ) {
    // TODO: log in WS Server
    console.log(`*** delete message in marketplace chat ***`);
    console.log(body);

    let result = (await this.wsServerService.deleteMessageInMarketplaceChat(
      body
    )) as any;

    result.source = "marketplace_chat";
    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "پیام با موفقیت حذف شد.",
      result
    );

    this.server
      .to(body.room)
      .emit(
        WsSocketEventTypes.delete_message_in_marketplace_chat,
        presentedResponse
      );
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen_message_in_marketplace_chat)
  async seenMessagesInMarketplaceChat(
    @MessageBody() body: SeenMessageMarketplaceWsDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** seen message in_marketplace chat ***`);
    console.log(body);

    await this.wsServerService.seenMessagesInMarketplaceChat(body);

    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام های شما دیده شد.",
      { flag: "seen", message_ids: body.message_ids, key: body.key }
    );

    this.server
      .to(body.key)
      .emit(
        WsSocketEventTypes.seen_message_in_marketplace_chat,
        presentedResponseToDestination
      );
  }

  // seenMessage
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen)
  async seenMessage(
    @MessageBody() body: SeenMessageRealEstateAgentChatWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Seen Message ***`);
    console.log(body);

    const result: any = await this.wsServerService.seenMessage(body);

    // send message to destination client
    this.server
      .to(result.dest_user_key)
      .emit(
        WsSocketEventTypes.seen,
        this.presentedResponse(
          WsSocketResponseCodes.created_response,
          "پیام شما دیده شد.",
          result.result
        )
      );

    // send message to source client
    this.server
      .to(user_key)
      .emit(
        WsSocketEventTypes.seen,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "درخواست شما با موفقیت انجام شد."
        )
      );
  }

  // seenManyInRealEstetAgentChat
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen_many)
  async seenManyInRealEstetAgentChat(
    @MessageBody() body: SeenMessageRealEstateAgentChatWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Seen Many In RealEstetAgent Chat ***`);
    console.log(body);

    const result: any = await this.wsServerService.seenManyInRealEstetAgentChat(
      body
    );

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام های شما دیده شد.",
      { flag: "seen_many" }
    );
    console.log({ presentedResponseToDestination });
    this.server
      .to(result.dest_socket_id)
      .emit(WsSocketEventTypes.seen_many, presentedResponseToDestination);

    // send message to source client
    const presentedResponseToSource = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "درخواست با موفقیت انجام شد.",
      { flag: "seen_many" }
    );
    console.log({ presentedResponseToSource });
    this.server
      .to(user_key)
      .emit(WsSocketEventTypes.seen_many, presentedResponseToSource);
  }

  // send message into channelRealEstate
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.channel_real_estate)
  async sendMessageIntoRealEstateChannel(
    @MessageBody() body: SendMessageRealEstateWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Send Message For RealEstate Channel Members ***`);
    console.log(body);

    await this.wsServerService.sendMessageForRealEstateChannelMembers(
      this.presentedResponse(
        WsSocketResponseCodes.ok_response,
        "پیام جدید کانال دریافت شد.",
        body
      ),
      socket
    );

    socket
      .to(user_key)
      .emit(
        WsSocketEventTypes.channel_real_estate,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "پیام جدید کانال دریافت شد.",
          body
        )
      );
  }

  // seen message into channelRealEstate
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen_channel_real_estate)
  async seenChannelRealEstate(
    @MessageBody() body: SeenRealEstateChannelWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** Seen Channel RealEstate ***`);
    console.log(body);

    await this.wsServerService.seenChannelRealEstate(body);
  }

  private presentedResponse(status: string, message: string, data: any = {}) {
    return {
      status,
      message,
      data,
    };
  }

  // add members in ChannelMessenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.add_members_channel_messenger)
  async addMembersInChannelMessenger(
    @MessageBody() body: AddMembersInMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;
    body.source_key = user_key;

    // TODO: log in WS Server
    console.log(`*** add_members_channel_messenger ***`);
    console.log({ body });

    const result = (await this.wsServerService.addMembersInChannelMessenger(
      body
    )) as any;

    body.channel_info.member_count = result.member_count + 1;
    console.log("member_count: ", result.member_count);
    console.log("channel member_count: ", body.channel_info.member_count);

    body.source = "add_channel_messenger";
    body.channel_info.source = "add_channel_messenger";

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "به یک کانال جدید دعوت شدید.",
      body.channel_info
    );

    this.server
      .to(body.channel_info.key)
      .emit(
        WsSocketEventTypes.join_channel_messenger,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "مشخصات کانال بروز شد.",
          body.channel_info
        )
      );

    // send messege into clients after added to channel
    body.members.map((item) => {
      console.log("user_key ", item.user_key);
      // send messege with socket
      socket
        .to(item.user_key)
        .emit(
          WsSocketEventTypes.new_channel_messenger,
          presentedResponseToDestination
        );
    });

    if (result.notification_tokens) {
      await result.notification_tokens.map(async (token) => {
        await this.fcmNotificationService.send({
          notification_token: token,
          body: JSON.stringify(presentedResponseToDestination),
          key: "new_channel_messenger",
          title: "به یک کانال جدید دعوت شدید.",
        });
      });
    }
  }

  // add members in ChannelMessenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.add_members_group_messenger)
  async addMembersInGroupMessenger(
    @MessageBody() body: AddMembersInGroupMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;
    body.source_key = user_key;

    // TODO: log in WS Server
    console.log(`*** add members group messenger ***`);
    console.log({ body });
    console.log("members.length: ", body.members.length);

    const result = (await this.wsServerService.addMembersInGroupMessenger(
      body
    )) as any;

    body.group_info.member_count = result.member_count + 1;
    body.group_info.member_ids = result.member_ids;
    console.log("member_count: ", result.member_count);
    console.log("group member_count: ", body.group_info.member_count);

    body.source = "add_group_messenger";
    body.group_info.source = "add_group_messenger";

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "به یک گروه جدید دعوت شدید.",
      body.group_info
    );

    socket
      .to(body.group_info.key)
      .emit(
        WsSocketEventTypes.join_group_messenger,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "مشخصات گروه بروز شد.",
          body.group_info
        )
      );

    // send messege into clients after added to channel
    body.members.map((item) => {
      console.log("user_key ", item.user_key);
      // send messege with socket
      this.server
        .to(item.user_key)
        .emit(
          WsSocketEventTypes.new_group_messenger,
          presentedResponseToDestination
        );
    });

    console.log("send Notification for new group members");

    if (result.notification_tokens) {
      await result.notification_tokens.map(async (item) => {
        console.log("token ", item);

        await this.fcmNotificationService.send({
          notification_token: item,
          body: JSON.stringify(presentedResponseToDestination),
          key: "new_group_messenger",
          title: "به یک گروه جدید اضافه شدید.",
        });
      });
    }
  }

  // send Message In Channel Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.channel_messenger)
  async sendMessageInChannelMessenger(
    @MessageBody() body: SendMessegeInChannelMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Send Message in Messenger Channel ***`);
    console.log(body);

    const newMessage = await this.wsServerService.sendMessageInChannelMessenger(
      body
    );

    newMessage.private_id = body.private_id;
    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام جدید در کانال مسنجر دریافت شد.",
      newMessage
    );

    await this.fcmNotificationService.sendToTopic({
      topic: body.key,
      body: JSON.stringify(presentedResponseToDestination),
      title: "پیام جدید در کانال",
      key: "channel_messenger",
    });

    // send newMessage for sender
    this.server
      .to(user_key)
      .emit(
        WsSocketEventTypes.channel_messenger,
        presentedResponseToDestination
      );

    // send messege in channel
    socket
      .to(body.key)
      .emit(
        WsSocketEventTypes.channel_messenger,
        presentedResponseToDestination
      );
  }

  // send Message In Channel Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.forward_message_into_channel)
  async forwardMessageToChannel(
    @MessageBody() body: ForwardMessageIntoChannelMessengerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Forward Message To Channel ***`);
    console.log(body);
    body.messages.map((item) => {
      console.log(item.content);
    });

    const newMessage = (await this.wsServerService.forwardMessageToChannel(
      body
    )) as any;
    newMessage.key = body.key;
    newMessage.source = "channel_messenger";

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام جدید در کانال مسنجر دریافت شد.",
      newMessage
    );

    await this.fcmNotificationService.sendToTopic({
      topic: body.key,
      body: JSON.stringify(presentedResponseToDestination),
      title: "پیام جدید در کانال",
      key: "channel_messenger",
    });

    // send newMessage for sender
    this.server
      .to(user_key)
      .emit(
        WsSocketEventTypes.forward_message_into_channel,
        presentedResponseToDestination
      );

    // send messege in channel
    socket
      .to(body.key)
      .emit(
        WsSocketEventTypes.forward_message_into_channel,
        presentedResponseToDestination
      );
  }

  // send Message In Group Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.group_messenger)
  async sendMessageInGroupMessenger(
    @MessageBody() body: SendMessegeInGroupMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** Send Message in Messenger Group ***`);
    console.log(body);

    const newMessage = (await this.wsServerService.sendMessageInGroupMessenger(
      body
    )) as any;

    console.log({ newMessage });

    newMessage.source = "group_messenger";

    newMessage.private_id = body.private_id;
    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام جدید در گروه مسنجر دریافت شد.",
      newMessage
    );

    // send message to topic
    await this.fcmNotificationService.sendToTopic({
      topic: body.key,
      body: JSON.stringify(presentedResponse),
      title: "پیام جدید در گروه",
      key: "group_messenger",
    });

    // broadcast message
    this.server
      .to(body.key)
      .emit(WsSocketEventTypes.group_messenger, presentedResponse);
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.forward_message_into_group)
  async forwardMessageIntoGroup(
    @MessageBody() body: ForwardMessagesInGroupMessengerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** forward_message_into_group ***`);
    console.log(body);
    body.messages.map((item) => {
      console.log(item.content);
    });

    const newMessage = (await this.wsServerService.forwardMessageIntoGroup(
      body
    )) as any;

    newMessage.source = "group_messenger";

    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیامی در گروه فوروارد شد.",
      newMessage
    );

    // send message to topic
    await this.fcmNotificationService.sendToTopic({
      topic: body.key,
      body: JSON.stringify(presentedResponse),
      title: "پیام جدید در گروه",
      key: "group_messenger",
    });

    // broadcast message
    this.server
      .to(body.key)
      .emit(WsSocketEventTypes.forward_message_into_group, presentedResponse);
  }

  // delete channel messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_channel_messenger)
  async deleteChannelMessenger(
    @MessageBody() body: deleteChannelMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Delete Channel Messenger ***`);
    console.log(body);

    const result = await this.wsServerService.deleteChannelMessenger(body);

    if (result) {
      // send message to destination client
      const presentedResponseToDestination = this.presentedResponse(
        WsSocketResponseCodes.ok_response,
        "کانال حذف شد.",
        { channel_id: body.channel_id, key: body.key }
      );

      // send messege for sender
      this.server
        .to(user_key)
        .emit(WsSocketEventTypes.delete_channel_messenger, {
          ...presentedResponseToDestination,
          broadcast_type: "owner",
        });

      // send messege in channel
      socket.to(body.key).emit(WsSocketEventTypes.delete_channel_messenger, {
        ...presentedResponseToDestination,
        broadcast_type: "broadcast",
      });
    }
  }

  // delete group messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_group_messenger)
  async deleteGroupMessenger(
    @MessageBody() body: deleteGroupMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Delete Group Messenger ***`);
    console.log(body);

    const result = await this.wsServerService.deleteGroupMessenger(body);

    // send message in group: broadcast
    this.server
      .to(body.key)
      .emit(
        WsSocketEventTypes.delete_group_messenger,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "شما از گروه حذف شدید.",
          { group_id: body.group_id, key: body.key, type: "group_broadcast" }
        )
      );

    console.log("membersNotificationToken");
    console.log(result);
    if (result.length) {
      await this.fcmNotificationService.unSubscribeToTopic(result, body.key);
    }
  }

  // send Member Count In Messenger Group
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.join_group_messenger)
  async joinedGroupMessenger(
    @MessageBody() body: MemberCountMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** joined Group Messenger ***`);
    console.log({ body });

    const result = (await this.wsServerService.joinedGroupMessenger(
      body
    )) as any;

    console.log({ result });

    if (result.status === 201 || result.status === 200) {
      this.joinRoom(
        { client_id: body.client_id, room_id: body.source_key },
        socket
      );

      this.server.to(socket.id).emit(
        WsSocketEventTypes.join_group_messenger,
        this.presentedResponse(
          WsSocketResponseCodes.created_response,
          "عضویت شما با موفقیت انجام شد.",
          {
            member_count: result.member_count + 1,
            client_id: body.client_id,
            source_key: body.source_key,
          }
        )
      );
    }

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "تعداد اعضا جدید ارسال شد.",
      { member_count: result.member_count + 1, source_key: body.source_key }
    );

    socket
      .to(body.source_key)
      .emit(
        WsSocketEventTypes.join_group_messenger,
        presentedResponseToDestination
      );
  }

  // send Member Count In Messenger Channel
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.join_channel_messenger)
  async joinedChannelMessenger(
    @MessageBody() body: MemberCountMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** joined Channel Messenger ***`);
    console.log({ body });

    const result = (await this.wsServerService.joinedChannelMessenger(
      body
    )) as any;

    console.log({ result });

    if (result.status === 201 || result.status === 200) {
      this.joinRoom(
        { client_id: body.client_id, room_id: body.source_key },
        socket
      );

      this.server.to(socket.id).emit(
        WsSocketEventTypes.join_channel_messenger,
        this.presentedResponse(
          WsSocketResponseCodes.created_response,
          "عضویت شما با موفقیت انجام شد.",
          {
            member_count: result.member_count + 1,
            client_id: body.client_id,
            source_key: body.source_key,
          }
        )
      );
    }

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "تعداد اعضا جدید ارسال شد.",
      { member_count: result.member_count + 1, source_key: body.source_key }
    );

    socket
      .to(body.source_key)
      .emit(
        WsSocketEventTypes.join_channel_messenger,
        presentedResponseToDestination
      );
  }

  // LeftMessenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.left_messenger)
  async LeftMessenger(
    @MessageBody() body: LeftMessenger,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Left Messenger ***`);
    console.log({ body });

    const result = (await this.wsServerService.LeftMessenger(body)) as any;

    if (result.status === 201) {
      this.leave_room(
        { client_id: body.client_id, room_id: body.source_key },
        socket
      );

      this.server.to(socket.id).emit(
        WsSocketEventTypes.left_messenger,
        this.presentedResponse(
          WsSocketResponseCodes.created_response,
          "عملیات ترک با موفقیت انجام شد",
          {
            member_count: result.member_count + 1,
            member_ids: result.member_ids ? result.member_ids : [],
            key: body.source_key,
            source_type: body.source_type,
            client_id: body.client_id,
          }
        )
      );
    }

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "عملیات ترک با موفقیت انجام شد",
      {
        member_count: result.member_count + 1,
        member_ids: result.member_ids ? result.member_ids : [],
        key: body.source_key,
        source_type: body.source_type,
        client_id: body.client_id,
      }
    );

    socket
      .to(body.source_key)
      .emit(WsSocketEventTypes.left_messenger, presentedResponseToDestination);
  }

  // update_channel_messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.update_channel_messenger)
  async updateChannelMessenger(
    @MessageBody() body: UpdateChannelMessenger,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** update Channel Messenger ***`);
    console.log({ body });

    socket.to(body.key).emit(WsSocketEventTypes.update_channel_messenger, body);
  }

  // update_group_messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.update_group_messenger)
  async updateGroupMessenger(
    @MessageBody() body: UpdateChannelMessenger,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** update Group Messenger ***`);
    console.log({ body });

    socket.to(body.key).emit(WsSocketEventTypes.update_group_messenger, body);
  }

  // sendMessage in messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.message_messenger)
  async sendMessageInMessenger(
    @MessageBody() body: SendMessageMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** SendMessage in : Messenger ***`);
    console.log({ body });

    const result: any = await this.wsServerService.sendMessageInMessenger(body);

    if (result) {
      result.private_id = body.private_id;
      result.is_blocked = body.chat_blocking_status;

      const transform = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "پیام جدید در چت خصوصی",
        result
      );

      this.server
        .to(body.key)
        .emit(WsSocketEventTypes.message_messenger, transform);

      const transformer = {
        source: "chat_messenger",
        ...transform,
      };

      await this.fcmNotificationService.sendToTopic({
        title: "پیام جدید",
        topic: body.key,
        body: JSON.stringify(transformer),
        key: "chat_messenger",
      });
    }
  }

  // sendMessage in messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.forward_message_into_private_chat)
  async forwardMessageIntoPrivateChat(
    @MessageBody() body: ForwardMessageInPrivateChatWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** Forward Message in : Private Chat ***`);
    console.log({ body });
    body.messages.map((item) => {
      console.log(item.content);
    });

    const result = (await this.wsServerService.forwardMessageInChat(
      body
    )) as any;

    if (result) {
      result.source = "private_chat";
      const transform = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "پیام فوروارد شده در چت شخصی",
        result
      );

      this.server
        .to(body.key)
        .emit(WsSocketEventTypes.forward_message_into_private_chat, transform);

      const transformer = {
        source: "chat_messenger",
        ...transform,
      };

      await this.fcmNotificationService.sendToTopic({
        title: "پیام جدید",
        topic: body.key,
        body: JSON.stringify(transformer),
        key: "chat_messenger",
      });
    }
  }

  // update message in messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.update_message_messenger)
  async updateMessageInPrivateChat(
    @MessageBody() body: SendMessageMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    body.client_id = socket.data.id;
    body.source_key = user_key;

    // TODO: log in WS Server
    console.log(`*** Update Message In Private Chat  : Messenger ***`);
    console.log(body);
    const result: any = await this.wsServerService.sendMessageInMessenger(body);

    if (result) {
      const transform = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "پیام در چت خصوصی ویرایش شد.",
        result
      );

      this.server
        .to(body.key)
        .emit(WsSocketEventTypes.update_message_messenger, transform);
    }
  }

  // delete message in private chat
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_message_in_chat)
  async deleteMessageInChat(@MessageBody() body: deleteMessageInMessengerDto) {
    // TODO: log in WS Server
    console.log(`*** Delete Message in private chat ***`);
    console.log(body);

    let result = (await this.wsServerService.deleteMessageInChat(body)) as any;

    result.source = "chat_messenger";
    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "پیام با موفقیت حذف شد.",
      result
    );

    this.server
      .to(body.room)
      .emit(WsSocketEventTypes.delete_message_in_chat, presentedResponse);
  }

  // sendMessage in messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.start_chat_in_messenger)
  async startChatInMessenger(
    @MessageBody() body: StartChatInMessengerDTO,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** start Chat In Messenger ***`);
    console.log(body);

    // join starter to room
    await this.joinRoom(
      { client_id: body.client_id, room_id: body.chat_key },
      socket
    );

    // send signal to participant for starting chat process
    const clientInfo = await this.wsServerService.getClientFromDB(
      body.destination_phone
    );

    if (clientInfo.online) {
      const transform = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "یک چت جدید با شما ایجاد شد.",
        { chat_key: body.chat_key }
      );

      this.server
        .to(clientInfo.key)
        .emit(WsSocketEventTypes.start_chat_in_messenger, transform);
    }
  }

  // block user
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.block_user)
  async blockUser(
    @MessageBody() body: BlockUserWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Block User ***`);
    console.log(body);

    const result = await this.wsServerService.blockUser(body);

    console.log("participantKey", result.participantKey);
    console.log("source_key", result.source_key);

    const presentedResponseForParticipant = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "بلاک شدی رفت.",
      {
        chat_key: body.chat_key,
      }
    );

    // send message for Participant
    this.server
      .to(result.participantKey)
      .emit(WsSocketEventTypes.block_user, presentedResponseForParticipant);

    // send message for Starter
    this.server.to(result.source_key).emit(
      WsSocketEventTypes.block_user,
      this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "بلاکش کردی. خوب شد؟",
        {
          chat_key: body.chat_key,
        }
      )
    );
  }

  // unblock user
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.unblock_user)
  async unblockUser(
    @MessageBody() body: BlockUserWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** UnBlock User ***`);
    console.log(body);

    const result = await this.wsServerService.unblockUser(body);

    console.log("participantKey", result.participantKey);
    console.log("source_key", result.source_key);

    const presentedResponseForParticipant = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "خوش بحالت از بلاک درومدی :)",
      {
        chat_key: body.chat_key,
      }
    );

    // send message for Participant
    this.server
      .to(result.participantKey)
      .emit(WsSocketEventTypes.unblock_user, presentedResponseForParticipant);

    // send message for Starter
    this.server.to(result.source_key).emit(
      WsSocketEventTypes.unblock_user,
      this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "آفرین کار خوبی کردی :)",
        {
          chat_key: body.chat_key,
        }
      )
    );
  }

  // seenManyInMessenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen_messenger)
  async seenManyInMessenger(
    @MessageBody() body: SeenMessageInMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Seen Messenger ***`);
    console.log(body);

    const result: any = await this.wsServerService.seenMessenger(body);

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام های شما دیده شد.",
      { flag: "seen", message_ids: body.message_ids, chat_key: body.chat_key }
    );

    this.server
      .to(result.chat_key)
      .emit(WsSocketEventTypes.seen_messenger, presentedResponseToDestination);
  }

  // seenManyInMessenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen_channel_messenger)
  async seenChannelMessenger(
    @MessageBody() body: SeenChannelMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Seen channel Messenger ***`);
    console.log(body);

    const result: any = await this.wsServerService.seenChannelMessenger(body);
  }

  // seenManyInMessenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.seen_group_messenger)
  async seenGroupMessenger(
    @MessageBody() body: SeenChannelMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Seen group Messenger ***`);
    console.log(body);

    const result: any = await this.wsServerService.seenGroupMessenger(body);
  }

  // update Message In Channel Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.update_message_in_channel_messenger)
  async updateMessageInChannelMessenger(
    @MessageBody() body: SendMessegeInChannelMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Update Message In Channel Messenger ***`);
    // console.log(body);

    const newMessage = await this.wsServerService.sendMessageInChannelMessenger(
      body
    );

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیام ویرایش شده است.",
      newMessage
    );

    // send message in channel
    this.server
      .to(body.key)
      .emit(
        WsSocketEventTypes.update_message_in_channel_messenger,
        presentedResponseToDestination
      );
  }

  // update Message In Group Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.update_message_in_group_messenger)
  async updateMessageInGroupMessenger(
    @MessageBody() body: SendMessegeInGroupMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Update Message in Messenger Group ***`);
    console.log(body);

    const newMessage = await this.wsServerService.sendMessageInGroupMessenger(
      body
    );

    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "پیامی در گروه ویرایش شده است.",
      newMessage
    );

    this.server
      .to(body.key)
      .emit(
        WsSocketEventTypes.update_message_in_group_messenger,
        presentedResponseToDestination
      );
  }

  // delete message in Channel Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_message_in_channel_messenger)
  async deleteMessageInChannelMessenger(
    @MessageBody() body: deleteMessageInMessengerDto
  ) {
    // TODO: log in WS Server
    console.log(`*** Delete Message in Channel Messenger ***`);
    console.log(body);

    let result = (await this.wsServerService.deleteMessageInChannelMessenger(
      body
    )) as any;

    result.source = "channel_messenger";
    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "پیام با موفقیت حذف شد.",
      result
    );

    this.server
      .to(body.room)
      .emit(
        WsSocketEventTypes.delete_message_in_channel_messenger,
        presentedResponse
      );
  }

  // delete message in Channel Messenger
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_message_in_group_messenger)
  async deleteMessageInGroupMessenger(
    @MessageBody() body: deleteMessageInMessengerDto
  ) {
    // TODO: log in WS Server
    console.log(`*** Delete Message in Group Messenger ***`);
    console.log(body);

    const result = (await this.wsServerService.deleteMessageInGroupMessenger(
      body
    )) as any;

    result.source = "group_messenger";
    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "پیام با موفقیت حذف شد.",
      result
    );

    this.server
      .to(body.room)
      .emit(
        WsSocketEventTypes.delete_message_in_group_messenger,
        presentedResponse
      );
  }

  // save message
  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.messenger_save_message)
  async sendMessageInSaveMessage(
    @MessageBody() body: SendMessageMessengerWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** SendMessage in : SaveMessage ***`);
    console.log({ body });

    const result: any = await this.wsServerService.sendMessageInSaveMessage(
      body
    );

    if (result) {
      result.private_id = body.private_id;

      const transform = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        !body.is_edited
          ? "پیام جدید در سیو مسیج"
          : "پیام ویرایش شده در سیو مسیج",
        result
      );

      this.server
        .to(body.key)
        .emit(WsSocketEventTypes.messenger_save_message, transform);
    }
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.delete_message_in_save_message)
  async deleteMessageInSaveMessage(
    @MessageBody() body: deleteMessageInMessengerDto
  ) {
    // TODO: log in WS Server
    console.log(`*** Delete Message in Save Message ***`);
    console.log(body);

    let result = (await this.wsServerService.deleteMessageInSaveMessage(
      body
    )) as any;

    result.source = "save_message";
    const presentedResponse = this.presentedResponse(
      WsSocketResponseCodes.ok_response,
      "پیام در سیو مسیج حذف شد.",
      result
    );

    this.server
      .to(body.room)
      .emit(
        WsSocketEventTypes.delete_message_in_save_message,
        presentedResponse
      );
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.forward_message_into_save_message)
  async forwardMessageIntoSaveMessage(
    @MessageBody() body: ForwardMessageInSaveMessage,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** Forward Message in : Save Message ***`);
    console.log({ body });

    body.messages.map((item) => {
      console.log(item.content);
    });

    const result: any =
      await this.wsServerService.forwardMessageIntoSaveMessage(body);

    if (result) {
      const transform = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "پیام فوروارد شده در سیو مسیج",
        result
      );

      this.server
        .to(body.key)
        .emit(WsSocketEventTypes.forward_message_into_save_message, transform);
    }
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.change_member_role_in_channel)
  async ChangeMemberRoleToAdminChannel(
    @MessageBody() body: ChangeMemberRoleToAdminChannel,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** Change Member Role To AdminChannel ***`);
    console.log({ body });

    const result = (await this.wsServerService.ChangeMemberRoleToAdminChannel(
      body
    )) as any;

    body.member = result;

    console.log(socket.id);
    this.server
      .to(socket.id)
      .emit(
        WsSocketEventTypes.change_member_role_in_channel,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "درخواست شما با موفقیت انجام شد."
        )
      );

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "شما به عنوان ادمین کانال انتخاب شدید",
      body
    );

    socket
      .to(body.member.user_key)
      .emit(
        WsSocketEventTypes.change_member_role_in_channel,
        presentedResponseToDestination
      );
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.change_member_role_in_group)
  async ChangeMemberRoleToAdminGroup(
    @MessageBody() body: ChangeMemberRoleToAdminGroup,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;

    // TODO: log in WS Server
    console.log(`*** Change Member Role To Admin Group ***`);
    console.log({ body });

    const result = (await this.wsServerService.ChangeMemberRoleToAdminGroup(
      body
    )) as any;

    body.member = result;

    console.log(socket.id);

    this.server
      .to(socket.id)
      .emit(
        WsSocketEventTypes.change_member_role_in_group,
        this.presentedResponse(
          WsSocketResponseCodes.ok_response,
          "درخواست شما با موفقیت انجام شد."
        )
      );

    // send message to destination client
    const presentedResponseToDestination = this.presentedResponse(
      WsSocketResponseCodes.created_response,
      "شما به عنوان ادمین گروه انتخاب شدید",
      body
    );

    socket
      .to(body.member.user_key)
      .emit(
        WsSocketEventTypes.change_member_role_in_group,
        presentedResponseToDestination
      );
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.leave_advisor_role_in_real_estate)
  async leaveAdvisorRoleInRealEstate(
    @MessageBody() body: LeaveAdvisorRoleInRealEstateDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    const user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** leave Advisor Role In RealEstate ***`);
    console.log({ body });

    const result = (await this.wsServerService.leaveAdvisorRoleInRealEstate(
      body
    )) as any;

    console.log({ result });

    if (result.status === 200) {
      console.log(result.realEstateTrackingCode);
      console.log({ user_key });

      this.server
        .to(result.realEstateTrackingCode)
        .emit(
          WsSocketEventTypes.leave_advisor_role_in_real_estate,
          this.presentedResponse(
            WsSocketResponseCodes.ok_response,
            "یک کاربر نقش کارشناس خود را ترک کرد.",
            body
          )
        );

      // send message to destination client
      const presentedResponseToDestination = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "ترک نقش کارشناس با موفقیت انجام شد."
      );

      socket
        .to(user_key)
        .emit(
          WsSocketEventTypes.leave_advisor_role_in_real_estate,
          presentedResponseToDestination
        );
    }
  }

  @UseGuards(ClientTokenAuthGuardSocket)
  @SubscribeMessage(WsSocketEventTypes.change_status_for_notification_alert)
  async changeStatusForNotificationAlert(
    @MessageBody() body: ChangeStatusFoNotificationAlertWsServerDto,
    @ConnectedSocket() socket: any
  ) {
    const client = socket.data;
    body.client_id = client.id;
    body.user_key = client.key;

    // TODO: log in WS Server
    console.log(`*** Change Status For Notification Alert ***`);
    console.log({ body });

    const result = await this.wsServerService.changeStatusForNotificationAlert(
      body
    );

    console.log({ result });
    if (result) {
      const presentedResponseToDestination = this.presentedResponse(
        WsSocketResponseCodes.created_response,
        "تغییر وضعیت انجام شد.",
        body
      );

      this.server
        .to(body.user_key)
        .emit(
          WsSocketEventTypes.change_status_for_notification_alert,
          presentedResponseToDestination
        );
    }
  }
}
