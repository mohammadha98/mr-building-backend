"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsServerGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_server_service_1 = require("./ws-server.service");
const send_message_realEstateAgent_ws_server_dto_1 = require("./dto/real-estate-agent/send-message-realEstateAgent-ws-server.dto");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const connect_user_ws_server_dto_1 = require("./dto/connect-user-ws-server.dto");
const seen_message_RealEstetAgent_ws_server_dto_1 = require("./dto/real-estate-agent/seen-message-RealEstetAgent-ws-server.dto");
const seen_real_estate_channel_ws_server_dto_1 = require("./dto/real-estate-agent/seen-real-estate-channel-ws-server.dto");
const send_message_rmessenger_ws_server_dto_1 = require("./dto/messenger/channel/send-message-rmessenger-ws-server.dto");
const seen_message_messenger_ws_server_dto_1 = require("./dto/messenger/seen-message-messenger-ws-server.dto");
const add_members_messenger_ws_server_dto_1 = require("./dto/messenger/channel/add-members-messenger-ws-server.dto");
const send_messege_channel_ws_server_dto_1 = require("./dto/messenger/channel/send-messege-channel-ws-server.dto");
const join_room_ws_server_dto_1 = require("./dto/join-room-ws-server.dto");
const deleteChannelMessenger_ws_server_dto_1 = require("./dto/messenger/channel/deleteChannelMessenger-ws-server.dto");
const add_members_group_messenger_ws_server_dto_copy_1 = require("./dto/messenger/channel/add-members-group-messenger-ws-server.dto copy");
const deleteGroupMessenger_ws_server_dto_1 = require("./dto/messenger/channel/deleteGroupMessenger-ws-server.dto");
const send_messege_group_ws_server_dto_1 = require("./dto/messenger/channel/send-messege-group-ws-server.dto");
const member_count_messenger_ws_server_dto2_1 = require("./dto/messenger/channel/member-count-messenger-ws-server.dto2");
const LeftMessenger_1 = require("./dto/messenger/LeftMessenger");
const UpdateChannelMessenger_1 = require("./dto/messenger/group/UpdateChannelMessenger");
const block_user_ws_server_dto_1 = require("./dto/messenger/channel/block-user-ws-server.dto");
const seen_channel_messenger_ws_server_dto_1 = require("./dto/messenger/channel/seen-channel-messenger-ws-server.dto");
const FcmNotificationService_1 = require("../../services/notifications/fcm/FcmNotificationService");
const TokenService_1 = require("../jwt-auth/services/TokenService");
const ClientTokenAuthGuard_Socket_1 = require("../jwt-auth/ClientTokenAuthGuard_Socket");
const change_status_for_notification_alert_ws_server_dto_1 = require("./dto/messenger/change_status_for_notification_alert-ws-server.dto");
const send_message_in_marketplace_ws_dto_1 = require("./dto/marketplace/send-message-in-marketplace-ws.dto");
const seen_message_marketplace_ws_dto_1 = require("./dto/marketplace/seen-message-marketplace-ws.dto");
let WsServerGateway = class WsServerGateway {
    constructor(wsServerService, fcmNotificationService, tokenService) {
        this.wsServerService = wsServerService;
        this.fcmNotificationService = fcmNotificationService;
        this.tokenService = tokenService;
        this.logger = new common_1.Logger();
    }
    async handleConnection(socket, ...args) {
        this.logger.log(`handleConnection: Client connected ${socket.id}`);
    }
    async joinToRequirementRooms(client_id, socket) {
        const userKey = await this.wsServerService.joinIntoPrivateRoom({
            client_id,
        });
        console.log("joinIntoPrivateRoom");
        console.log(userKey.key);
        socket.join(userKey.key);
        socket.removeAllListeners(userKey.key);
        const chatList = await this.wsServerService.joinToPrivateChat({
            client_id,
        });
        chatList.map((item) => {
            socket.removeAllListeners(item.key);
            socket.join(item.key);
        });
        const channels = await this.wsServerService.joinTheChannels({
            client_id,
        });
        channels.map((item) => {
            socket.removeAllListeners(item.channel.key);
            socket.join(item.channel.key);
        });
        const saveMessage = await this.wsServerService.joinInSaveMessage({
            client_id,
        });
        socket.join(saveMessage.key);
        socket.removeAllListeners(saveMessage.key);
        const groups = await this.wsServerService.joinTheGroups({
            client_id,
        });
        groups.map((item) => {
            socket.removeAllListeners(item.group.key);
            socket.join(item.group.key);
        });
        const storefront = await this.wsServerService.getStorefrontInfo({
            client_id,
        });
        if (storefront) {
            socket.removeAllListeners(storefront.trackingCode);
            socket.join(storefront.trackingCode);
        }
        const marketplaceChatList = await this.wsServerService.getMarketplaceChatList({
            client_id,
        });
        marketplaceChatList.map((item) => {
            socket.removeAllListeners(item.key);
            socket.join(item.key);
        });
        const realEstateInfo = await this.wsServerService.joinTheRealEstateAgentRoom({
            client_id,
        });
        if (realEstateInfo) {
            console.log("joinTheRealEstateAgentRoom");
            console.log(realEstateInfo.tracking_code);
            socket.removeAllListeners(realEstateInfo.tracking_code);
            socket.join(realEstateInfo.tracking_code);
        }
    }
    async handleDisconnect(socket) {
        console.log("------------------------");
        this.logger.log(`handleDisconnect: Client disconnected ${socket.id}`);
        const authorization = socket.handshake.headers.authorization
            ? socket.handshake.headers.authorization
            : socket.handshake.query["authorization"];
        if (authorization) {
            const token = this.tokenService.verifyClientToken(authorization);
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
    afterInit(server) {
        this.logger.log("Initializing AppGateway");
        console.log(server);
    }
    async connectUser(body, socket) {
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
    handleError(socket) {
        console.log("handleError");
        console.log(socket);
    }
    handle_connect_error(socket) {
        console.log("handle_connect_error");
        console.log(socket);
    }
    async joinRoom(body, socket) {
        try {
            body.client_id = socket.data.id;
            console.log("*** join_room ***");
            console.log({ body });
            socket.join(body.room_id);
            const notificationTokens = await this.wsServerService.getClientNotificationToken(body.client_id);
            if (notificationTokens.length > 0) {
                await this.fcmNotificationService.subscribeToTopic(notificationTokens, body.room_id);
            }
        }
        catch (e) {
            console.log("Error In JoinRoom");
            console.log(e);
        }
    }
    async leave_room(body, socket) {
        body.client_id = socket.data.id;
        console.log("*** leave_room ***");
        console.log({ body });
        socket.leave(body.room_id);
    }
    async disconnect_user(body, socket) {
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
    async sendMessageInRealEstateAgent(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        body.user_key = client.key;
        body.socket_id = socket.id;
        console.log(`*** SendMessage in : Real_estate_agent ***`);
        const result = await this.wsServerService.sendMessageInRealEstateAgentSection(body);
        result.chatInfoForStarter.private_id = body.private_id;
        result.chatInfoForParticipant.private_id = body.private_id;
        result.sourceList.map((socket) => {
            if (socket !== undefined) {
                this.server
                    .to(socket)
                    .emit("message_real_estate_agent", this.presentedResponse("created_response", "پیام شما با موفقیت ارسال شد.", result.chatInfoForStarter));
            }
        });
        result.destinationList.map((socket) => {
            if (socket !== undefined) {
                this.server
                    .to(socket)
                    .emit("message_real_estate_agent", this.presentedResponse("created_response", "پیام جدید دریافت شد.", result.chatInfoForParticipant));
            }
        });
    }
    async sendMessageInMarketplaceChat(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        body.user_key = client.key;
        console.log(`*** send_message_in_marketplace_chat ***`);
        const result = (await this.wsServerService.sendMessageInMarketplaceChat(body));
        result.private_id = body.private_id;
        result.message_side = body.message_side;
        result.source = "marketplace_chat";
        this.server
            .to(body.key)
            .emit("send_message_in_marketplace_chat", this.presentedResponse("ok_response", "پیام شما با موفقیت ارسال شد.", result));
    }
    async deleteMessageInMarketplaceChat(body) {
        console.log(`*** delete message in marketplace chat ***`);
        console.log(body);
        let result = (await this.wsServerService.deleteMessageInMarketplaceChat(body));
        result.source = "marketplace_chat";
        const presentedResponse = this.presentedResponse("ok_response", "پیام با موفقیت حذف شد.", result);
        this.server
            .to(body.room)
            .emit("delete_message_in_marketplace_chat", presentedResponse);
    }
    async seenMessagesInMarketplaceChat(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** seen message in_marketplace chat ***`);
        console.log(body);
        await this.wsServerService.seenMessagesInMarketplaceChat(body);
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیام های شما دیده شد.", { flag: "seen", message_ids: body.message_ids, key: body.key });
        this.server
            .to(body.key)
            .emit("seen_message_in_marketplace_chat", presentedResponseToDestination);
    }
    async seenMessage(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Seen Message ***`);
        console.log(body);
        const result = await this.wsServerService.seenMessage(body);
        this.server
            .to(result.dest_user_key)
            .emit("seen", this.presentedResponse("created_response", "پیام شما دیده شد.", result.result));
        this.server
            .to(user_key)
            .emit("seen", this.presentedResponse("ok_response", "درخواست شما با موفقیت انجام شد."));
    }
    async seenManyInRealEstetAgentChat(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Seen Many In RealEstetAgent Chat ***`);
        console.log(body);
        const result = await this.wsServerService.seenManyInRealEstetAgentChat(body);
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیام های شما دیده شد.", { flag: "seen_many" });
        console.log({ presentedResponseToDestination });
        this.server
            .to(result.dest_socket_id)
            .emit("seen_many", presentedResponseToDestination);
        const presentedResponseToSource = this.presentedResponse("ok_response", "درخواست با موفقیت انجام شد.", { flag: "seen_many" });
        console.log({ presentedResponseToSource });
        this.server
            .to(user_key)
            .emit("seen_many", presentedResponseToSource);
    }
    async sendMessageIntoRealEstateChannel(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Send Message For RealEstate Channel Members ***`);
        console.log(body);
        await this.wsServerService.sendMessageForRealEstateChannelMembers(this.presentedResponse("ok_response", "پیام جدید کانال دریافت شد.", body), socket);
        socket
            .to(user_key)
            .emit("channel_real_estate", this.presentedResponse("ok_response", "پیام جدید کانال دریافت شد.", body));
    }
    async seenChannelRealEstate(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** Seen Channel RealEstate ***`);
        console.log(body);
        await this.wsServerService.seenChannelRealEstate(body);
    }
    presentedResponse(status, message, data = {}) {
        return {
            status,
            message,
            data,
        };
    }
    async addMembersInChannelMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        body.source_key = user_key;
        console.log(`*** add_members_channel_messenger ***`);
        console.log({ body });
        const result = (await this.wsServerService.addMembersInChannelMessenger(body));
        body.channel_info.member_count = result.member_count + 1;
        console.log("member_count: ", result.member_count);
        console.log("channel member_count: ", body.channel_info.member_count);
        body.source = "add_channel_messenger";
        body.channel_info.source = "add_channel_messenger";
        const presentedResponseToDestination = this.presentedResponse("created_response", "به یک کانال جدید دعوت شدید.", body.channel_info);
        this.server
            .to(body.channel_info.key)
            .emit("join_channel_messenger", this.presentedResponse("ok_response", "مشخصات کانال بروز شد.", body.channel_info));
        body.members.map((item) => {
            console.log("user_key ", item.user_key);
            socket
                .to(item.user_key)
                .emit("new_channel_messenger", presentedResponseToDestination);
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
    async addMembersInGroupMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        body.source_key = user_key;
        console.log(`*** add members group messenger ***`);
        console.log({ body });
        console.log("members.length: ", body.members.length);
        const result = (await this.wsServerService.addMembersInGroupMessenger(body));
        body.group_info.member_count = result.member_count + 1;
        body.group_info.member_ids = result.member_ids;
        console.log("member_count: ", result.member_count);
        console.log("group member_count: ", body.group_info.member_count);
        body.source = "add_group_messenger";
        body.group_info.source = "add_group_messenger";
        const presentedResponseToDestination = this.presentedResponse("created_response", "به یک گروه جدید دعوت شدید.", body.group_info);
        socket
            .to(body.group_info.key)
            .emit("join_group_messenger", this.presentedResponse("ok_response", "مشخصات گروه بروز شد.", body.group_info));
        body.members.map((item) => {
            console.log("user_key ", item.user_key);
            this.server
                .to(item.user_key)
                .emit("new_group_messenger", presentedResponseToDestination);
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
    async sendMessageInChannelMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Send Message in Messenger Channel ***`);
        console.log(body);
        const newMessage = await this.wsServerService.sendMessageInChannelMessenger(body);
        newMessage.private_id = body.private_id;
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیام جدید در کانال مسنجر دریافت شد.", newMessage);
        await this.fcmNotificationService.sendToTopic({
            topic: body.key,
            body: JSON.stringify(presentedResponseToDestination),
            title: "پیام جدید در کانال",
            key: "channel_messenger",
        });
        this.server
            .to(user_key)
            .emit("channel_messenger", presentedResponseToDestination);
        socket
            .to(body.key)
            .emit("channel_messenger", presentedResponseToDestination);
    }
    async forwardMessageToChannel(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Forward Message To Channel ***`);
        console.log(body);
        body.messages.map((item) => {
            console.log(item.content);
        });
        const newMessage = (await this.wsServerService.forwardMessageToChannel(body));
        newMessage.key = body.key;
        newMessage.source = "channel_messenger";
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیام جدید در کانال مسنجر دریافت شد.", newMessage);
        await this.fcmNotificationService.sendToTopic({
            topic: body.key,
            body: JSON.stringify(presentedResponseToDestination),
            title: "پیام جدید در کانال",
            key: "channel_messenger",
        });
        this.server
            .to(user_key)
            .emit("forward_message_into_channel", presentedResponseToDestination);
        socket
            .to(body.key)
            .emit("forward_message_into_channel", presentedResponseToDestination);
    }
    async sendMessageInGroupMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** Send Message in Messenger Group ***`);
        console.log(body);
        const newMessage = (await this.wsServerService.sendMessageInGroupMessenger(body));
        console.log({ newMessage });
        newMessage.source = "group_messenger";
        newMessage.private_id = body.private_id;
        const presentedResponse = this.presentedResponse("created_response", "پیام جدید در گروه مسنجر دریافت شد.", newMessage);
        await this.fcmNotificationService.sendToTopic({
            topic: body.key,
            body: JSON.stringify(presentedResponse),
            title: "پیام جدید در گروه",
            key: "group_messenger",
        });
        this.server
            .to(body.key)
            .emit("group_messenger", presentedResponse);
    }
    async forwardMessageIntoGroup(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** forward_message_into_group ***`);
        console.log(body);
        body.messages.map((item) => {
            console.log(item.content);
        });
        const newMessage = (await this.wsServerService.forwardMessageIntoGroup(body));
        newMessage.source = "group_messenger";
        const presentedResponse = this.presentedResponse("created_response", "پیامی در گروه فوروارد شد.", newMessage);
        await this.fcmNotificationService.sendToTopic({
            topic: body.key,
            body: JSON.stringify(presentedResponse),
            title: "پیام جدید در گروه",
            key: "group_messenger",
        });
        this.server
            .to(body.key)
            .emit("forward_message_into_group", presentedResponse);
    }
    async deleteChannelMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Delete Channel Messenger ***`);
        console.log(body);
        const result = await this.wsServerService.deleteChannelMessenger(body);
        if (result) {
            const presentedResponseToDestination = this.presentedResponse("ok_response", "کانال حذف شد.", { channel_id: body.channel_id, key: body.key });
            this.server
                .to(user_key)
                .emit("delete_channel_messenger", Object.assign(Object.assign({}, presentedResponseToDestination), { broadcast_type: "owner" }));
            socket.to(body.key).emit("delete_channel_messenger", Object.assign(Object.assign({}, presentedResponseToDestination), { broadcast_type: "broadcast" }));
        }
    }
    async deleteGroupMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Delete Group Messenger ***`);
        console.log(body);
        const result = await this.wsServerService.deleteGroupMessenger(body);
        this.server
            .to(body.key)
            .emit("delete_group_messenger", this.presentedResponse("ok_response", "شما از گروه حذف شدید.", { group_id: body.group_id, key: body.key, type: "group_broadcast" }));
        console.log("membersNotificationToken");
        console.log(result);
        if (result.length) {
            await this.fcmNotificationService.unSubscribeToTopic(result, body.key);
        }
    }
    async joinedGroupMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** joined Group Messenger ***`);
        console.log({ body });
        const result = (await this.wsServerService.joinedGroupMessenger(body));
        console.log({ result });
        if (result.status === 201 || result.status === 200) {
            this.joinRoom({ client_id: body.client_id, room_id: body.source_key }, socket);
            this.server.to(socket.id).emit("join_group_messenger", this.presentedResponse("created_response", "عضویت شما با موفقیت انجام شد.", {
                member_count: result.member_count + 1,
                client_id: body.client_id,
                source_key: body.source_key,
            }));
        }
        const presentedResponseToDestination = this.presentedResponse("created_response", "تعداد اعضا جدید ارسال شد.", { member_count: result.member_count + 1, source_key: body.source_key });
        socket
            .to(body.source_key)
            .emit("join_group_messenger", presentedResponseToDestination);
    }
    async joinedChannelMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** joined Channel Messenger ***`);
        console.log({ body });
        const result = (await this.wsServerService.joinedChannelMessenger(body));
        console.log({ result });
        if (result.status === 201 || result.status === 200) {
            this.joinRoom({ client_id: body.client_id, room_id: body.source_key }, socket);
            this.server.to(socket.id).emit("join_channel_messenger", this.presentedResponse("created_response", "عضویت شما با موفقیت انجام شد.", {
                member_count: result.member_count + 1,
                client_id: body.client_id,
                source_key: body.source_key,
            }));
        }
        const presentedResponseToDestination = this.presentedResponse("ok_response", "تعداد اعضا جدید ارسال شد.", { member_count: result.member_count + 1, source_key: body.source_key });
        socket
            .to(body.source_key)
            .emit("join_channel_messenger", presentedResponseToDestination);
    }
    async LeftMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Left Messenger ***`);
        console.log({ body });
        const result = (await this.wsServerService.LeftMessenger(body));
        if (result.status === 201) {
            this.leave_room({ client_id: body.client_id, room_id: body.source_key }, socket);
            this.server.to(socket.id).emit("left_messenger", this.presentedResponse("created_response", "عملیات ترک با موفقیت انجام شد", {
                member_count: result.member_count + 1,
                member_ids: result.member_ids ? result.member_ids : [],
                key: body.source_key,
                source_type: body.source_type,
                client_id: body.client_id,
            }));
        }
        const presentedResponseToDestination = this.presentedResponse("ok_response", "عملیات ترک با موفقیت انجام شد", {
            member_count: result.member_count + 1,
            member_ids: result.member_ids ? result.member_ids : [],
            key: body.source_key,
            source_type: body.source_type,
            client_id: body.client_id,
        });
        socket
            .to(body.source_key)
            .emit("left_messenger", presentedResponseToDestination);
    }
    async updateChannelMessenger(body, socket) {
        const client = socket.data;
        const user_key = client.key;
        console.log(`*** update Channel Messenger ***`);
        console.log({ body });
        socket.to(body.key).emit("update_channel_messenger", body);
    }
    async updateGroupMessenger(body, socket) {
        const client = socket.data;
        const user_key = client.key;
        console.log(`*** update Group Messenger ***`);
        console.log({ body });
        socket.to(body.key).emit("update_group_messenger", body);
    }
    async sendMessageInMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** SendMessage in : Messenger ***`);
        console.log({ body });
        const result = await this.wsServerService.sendMessageInMessenger(body);
        if (result) {
            result.private_id = body.private_id;
            result.is_blocked = body.chat_blocking_status;
            const transform = this.presentedResponse("created_response", "پیام جدید در چت خصوصی", result);
            this.server
                .to(body.key)
                .emit("message_messenger", transform);
            const transformer = Object.assign({ source: "chat_messenger" }, transform);
            await this.fcmNotificationService.sendToTopic({
                title: "پیام جدید",
                topic: body.key,
                body: JSON.stringify(transformer),
                key: "chat_messenger",
            });
        }
    }
    async forwardMessageIntoPrivateChat(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** Forward Message in : Private Chat ***`);
        console.log({ body });
        body.messages.map((item) => {
            console.log(item.content);
        });
        const result = (await this.wsServerService.forwardMessageInChat(body));
        if (result) {
            result.source = "private_chat";
            const transform = this.presentedResponse("created_response", "پیام فوروارد شده در چت شخصی", result);
            this.server
                .to(body.key)
                .emit("forward_message_into_private_chat", transform);
            const transformer = Object.assign({ source: "chat_messenger" }, transform);
            await this.fcmNotificationService.sendToTopic({
                title: "پیام جدید",
                topic: body.key,
                body: JSON.stringify(transformer),
                key: "chat_messenger",
            });
        }
    }
    async updateMessageInPrivateChat(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        body.client_id = socket.data.id;
        body.source_key = user_key;
        console.log(`*** Update Message In Private Chat  : Messenger ***`);
        console.log(body);
        const result = await this.wsServerService.sendMessageInMessenger(body);
        if (result) {
            const transform = this.presentedResponse("created_response", "پیام در چت خصوصی ویرایش شد.", result);
            this.server
                .to(body.key)
                .emit("update_message_messenger", transform);
        }
    }
    async deleteMessageInChat(body) {
        console.log(`*** Delete Message in private chat ***`);
        console.log(body);
        let result = (await this.wsServerService.deleteMessageInChat(body));
        result.source = "chat_messenger";
        const presentedResponse = this.presentedResponse("ok_response", "پیام با موفقیت حذف شد.", result);
        this.server
            .to(body.room)
            .emit("delete_message_in_chat", presentedResponse);
    }
    async startChatInMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** start Chat In Messenger ***`);
        console.log(body);
        await this.joinRoom({ client_id: body.client_id, room_id: body.chat_key }, socket);
        const clientInfo = await this.wsServerService.getClientFromDB(body.destination_phone);
        if (clientInfo.online) {
            const transform = this.presentedResponse("created_response", "یک چت جدید با شما ایجاد شد.", { chat_key: body.chat_key });
            this.server
                .to(clientInfo.key)
                .emit("start_chat_in_messenger", transform);
        }
    }
    async blockUser(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Block User ***`);
        console.log(body);
        const result = await this.wsServerService.blockUser(body);
        console.log("participantKey", result.participantKey);
        console.log("source_key", result.source_key);
        const presentedResponseForParticipant = this.presentedResponse("ok_response", "بلاک شدی رفت.", {
            chat_key: body.chat_key,
        });
        this.server
            .to(result.participantKey)
            .emit("block_user", presentedResponseForParticipant);
        this.server.to(result.source_key).emit("block_user", this.presentedResponse("created_response", "بلاکش کردی. خوب شد؟", {
            chat_key: body.chat_key,
        }));
    }
    async unblockUser(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** UnBlock User ***`);
        console.log(body);
        const result = await this.wsServerService.unblockUser(body);
        console.log("participantKey", result.participantKey);
        console.log("source_key", result.source_key);
        const presentedResponseForParticipant = this.presentedResponse("ok_response", "خوش بحالت از بلاک درومدی :)", {
            chat_key: body.chat_key,
        });
        this.server
            .to(result.participantKey)
            .emit("unblock_user", presentedResponseForParticipant);
        this.server.to(result.source_key).emit("unblock_user", this.presentedResponse("created_response", "آفرین کار خوبی کردی :)", {
            chat_key: body.chat_key,
        }));
    }
    async seenManyInMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Seen Messenger ***`);
        console.log(body);
        const result = await this.wsServerService.seenMessenger(body);
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیام های شما دیده شد.", { flag: "seen", message_ids: body.message_ids, chat_key: body.chat_key });
        this.server
            .to(result.chat_key)
            .emit("seen_messenger", presentedResponseToDestination);
    }
    async seenChannelMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Seen channel Messenger ***`);
        console.log(body);
        const result = await this.wsServerService.seenChannelMessenger(body);
    }
    async seenGroupMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Seen group Messenger ***`);
        console.log(body);
        const result = await this.wsServerService.seenGroupMessenger(body);
    }
    async updateMessageInChannelMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Update Message In Channel Messenger ***`);
        const newMessage = await this.wsServerService.sendMessageInChannelMessenger(body);
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیام ویرایش شده است.", newMessage);
        this.server
            .to(body.key)
            .emit("update_message_in_channel_messenger", presentedResponseToDestination);
    }
    async updateMessageInGroupMessenger(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** Update Message in Messenger Group ***`);
        console.log(body);
        const newMessage = await this.wsServerService.sendMessageInGroupMessenger(body);
        const presentedResponseToDestination = this.presentedResponse("created_response", "پیامی در گروه ویرایش شده است.", newMessage);
        this.server
            .to(body.key)
            .emit("update_message_in_group_messenger", presentedResponseToDestination);
    }
    async deleteMessageInChannelMessenger(body) {
        console.log(`*** Delete Message in Channel Messenger ***`);
        console.log(body);
        let result = (await this.wsServerService.deleteMessageInChannelMessenger(body));
        result.source = "channel_messenger";
        const presentedResponse = this.presentedResponse("ok_response", "پیام با موفقیت حذف شد.", result);
        this.server
            .to(body.room)
            .emit("delete_message_in_channel_messenger", presentedResponse);
    }
    async deleteMessageInGroupMessenger(body) {
        console.log(`*** Delete Message in Group Messenger ***`);
        console.log(body);
        const result = (await this.wsServerService.deleteMessageInGroupMessenger(body));
        result.source = "group_messenger";
        const presentedResponse = this.presentedResponse("ok_response", "پیام با موفقیت حذف شد.", result);
        this.server
            .to(body.room)
            .emit("delete_message_in_group_messenger", presentedResponse);
    }
    async sendMessageInSaveMessage(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** SendMessage in : SaveMessage ***`);
        console.log({ body });
        const result = await this.wsServerService.sendMessageInSaveMessage(body);
        if (result) {
            result.private_id = body.private_id;
            const transform = this.presentedResponse("created_response", !body.is_edited
                ? "پیام جدید در سیو مسیج"
                : "پیام ویرایش شده در سیو مسیج", result);
            this.server
                .to(body.key)
                .emit("messenger_save_message", transform);
        }
    }
    async deleteMessageInSaveMessage(body) {
        console.log(`*** Delete Message in Save Message ***`);
        console.log(body);
        let result = (await this.wsServerService.deleteMessageInSaveMessage(body));
        result.source = "save_message";
        const presentedResponse = this.presentedResponse("ok_response", "پیام در سیو مسیج حذف شد.", result);
        this.server
            .to(body.room)
            .emit("delete_message_in_save_message", presentedResponse);
    }
    async forwardMessageIntoSaveMessage(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** Forward Message in : Save Message ***`);
        console.log({ body });
        body.messages.map((item) => {
            console.log(item.content);
        });
        const result = await this.wsServerService.forwardMessageIntoSaveMessage(body);
        if (result) {
            const transform = this.presentedResponse("created_response", "پیام فوروارد شده در سیو مسیج", result);
            this.server
                .to(body.key)
                .emit("forward_message_into_save_message", transform);
        }
    }
    async ChangeMemberRoleToAdminChannel(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** Change Member Role To AdminChannel ***`);
        console.log({ body });
        const result = (await this.wsServerService.ChangeMemberRoleToAdminChannel(body));
        body.member = result;
        console.log(socket.id);
        this.server
            .to(socket.id)
            .emit("change_member_role_in_channel", this.presentedResponse("ok_response", "درخواست شما با موفقیت انجام شد."));
        const presentedResponseToDestination = this.presentedResponse("created_response", "شما به عنوان ادمین کانال انتخاب شدید", body);
        socket
            .to(body.member.user_key)
            .emit("change_member_role_in_channel", presentedResponseToDestination);
    }
    async ChangeMemberRoleToAdminGroup(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        console.log(`*** Change Member Role To Admin Group ***`);
        console.log({ body });
        const result = (await this.wsServerService.ChangeMemberRoleToAdminGroup(body));
        body.member = result;
        console.log(socket.id);
        this.server
            .to(socket.id)
            .emit("change_member_role_in_group", this.presentedResponse("ok_response", "درخواست شما با موفقیت انجام شد."));
        const presentedResponseToDestination = this.presentedResponse("created_response", "شما به عنوان ادمین گروه انتخاب شدید", body);
        socket
            .to(body.member.user_key)
            .emit("change_member_role_in_group", presentedResponseToDestination);
    }
    async leaveAdvisorRoleInRealEstate(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        const user_key = client.key;
        console.log(`*** leave Advisor Role In RealEstate ***`);
        console.log({ body });
        const result = (await this.wsServerService.leaveAdvisorRoleInRealEstate(body));
        console.log({ result });
        if (result.status === 200) {
            console.log(result.realEstateTrackingCode);
            console.log({ user_key });
            this.server
                .to(result.realEstateTrackingCode)
                .emit("leave_advisor_role_in_real_estate", this.presentedResponse("ok_response", "یک کاربر نقش کارشناس خود را ترک کرد.", body));
            const presentedResponseToDestination = this.presentedResponse("created_response", "ترک نقش کارشناس با موفقیت انجام شد.");
            socket
                .to(user_key)
                .emit("leave_advisor_role_in_real_estate", presentedResponseToDestination);
        }
    }
    async changeStatusForNotificationAlert(body, socket) {
        const client = socket.data;
        body.client_id = client.id;
        body.user_key = client.key;
        console.log(`*** Change Status For Notification Alert ***`);
        console.log({ body });
        const result = await this.wsServerService.changeStatusForNotificationAlert(body);
        console.log({ result });
        if (result) {
            const presentedResponseToDestination = this.presentedResponse("created_response", "تغییر وضعیت انجام شد.", body);
            this.server
                .to(body.user_key)
                .emit("change_status_for_notification_alert", presentedResponseToDestination);
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WsServerGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "handleConnection", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("connect_user"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_user_ws_server_dto_1.ConnectUserWsServerDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "connectUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("error"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WsServerGateway.prototype, "handleError", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("connect_error"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WsServerGateway.prototype, "handle_connect_error", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("join_room"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_room_ws_server_dto_1.JoinRoomWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "joinRoom", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("leave_room"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_room_ws_server_dto_1.JoinRoomWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "leave_room", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("disconnect_user"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_user_ws_server_dto_1.ConnectUserWsServerDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "disconnect_user", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("message_real_estate_agent"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_realEstateAgent_ws_server_dto_1.SendMessageRealEstateWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageInRealEstateAgent", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("send_message_in_marketplace_chat"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_in_marketplace_ws_dto_1.SendMessageInMarketplaceWs, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageInMarketplaceChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_message_in_marketplace_chat"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.deleteMessageInMessengerDto]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteMessageInMarketplaceChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen_message_in_marketplace_chat"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_message_marketplace_ws_dto_1.SeenMessageMarketplaceWsDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenMessagesInMarketplaceChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_message_RealEstetAgent_ws_server_dto_1.SeenMessageRealEstateAgentChatWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenMessage", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen_many"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_message_RealEstetAgent_ws_server_dto_1.SeenMessageRealEstateAgentChatWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenManyInRealEstetAgentChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("channel_real_estate"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_realEstateAgent_ws_server_dto_1.SendMessageRealEstateWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageIntoRealEstateChannel", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen_channel_real_estate"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_real_estate_channel_ws_server_dto_1.SeenRealEstateChannelWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenChannelRealEstate", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("add_members_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_members_messenger_ws_server_dto_1.AddMembersInMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "addMembersInChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("add_members_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_members_group_messenger_ws_server_dto_copy_1.AddMembersInGroupMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "addMembersInGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_channel_ws_server_dto_1.SendMessegeInChannelMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageInChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("forward_message_into_channel"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_channel_ws_server_dto_1.ForwardMessageIntoChannelMessengerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "forwardMessageToChannel", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.SendMessegeInGroupMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageInGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("forward_message_into_group"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "forwardMessageIntoGroup", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deleteChannelMessenger_ws_server_dto_1.deleteChannelMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deleteGroupMessenger_ws_server_dto_1.deleteGroupMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("join_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_count_messenger_ws_server_dto2_1.MemberCountMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "joinedGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("join_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [member_count_messenger_ws_server_dto2_1.MemberCountMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "joinedChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("left_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LeftMessenger_1.LeftMessenger, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "LeftMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("update_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateChannelMessenger_1.UpdateChannelMessenger, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "updateChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("update_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateChannelMessenger_1.UpdateChannelMessenger, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "updateGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("message_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_rmessenger_ws_server_dto_1.SendMessageMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageInMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("forward_message_into_private_chat"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_rmessenger_ws_server_dto_1.ForwardMessageInPrivateChatWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "forwardMessageIntoPrivateChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("update_message_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_rmessenger_ws_server_dto_1.SendMessageMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "updateMessageInPrivateChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_message_in_chat"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.deleteMessageInMessengerDto]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteMessageInChat", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("start_chat_in_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_rmessenger_ws_server_dto_1.StartChatInMessengerDTO, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "startChatInMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("block_user"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_user_ws_server_dto_1.BlockUserWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "blockUser", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("unblock_user"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_user_ws_server_dto_1.BlockUserWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "unblockUser", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_message_messenger_ws_server_dto_1.SeenMessageInMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenManyInMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_channel_messenger_ws_server_dto_1.SeenChannelMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("seen_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [seen_channel_messenger_ws_server_dto_1.SeenChannelMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "seenGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("update_message_in_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_channel_ws_server_dto_1.SendMessegeInChannelMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "updateMessageInChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("update_message_in_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.SendMessegeInGroupMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "updateMessageInGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_message_in_channel_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.deleteMessageInMessengerDto]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteMessageInChannelMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_message_in_group_messenger"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.deleteMessageInMessengerDto]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteMessageInGroupMessenger", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("messenger_save_message"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_rmessenger_ws_server_dto_1.SendMessageMessengerWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "sendMessageInSaveMessage", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("delete_message_in_save_message"),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_messege_group_ws_server_dto_1.deleteMessageInMessengerDto]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "deleteMessageInSaveMessage", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("forward_message_into_save_message"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_rmessenger_ws_server_dto_1.ForwardMessageInSaveMessage, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "forwardMessageIntoSaveMessage", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("change_member_role_in_channel"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_members_messenger_ws_server_dto_1.ChangeMemberRoleToAdminChannel, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "ChangeMemberRoleToAdminChannel", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("change_member_role_in_group"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_members_messenger_ws_server_dto_1.ChangeMemberRoleToAdminGroup, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "ChangeMemberRoleToAdminGroup", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("leave_advisor_role_in_real_estate"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_realEstateAgent_ws_server_dto_1.LeaveAdvisorRoleInRealEstateDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "leaveAdvisorRoleInRealEstate", null);
__decorate([
    (0, common_1.UseGuards)(ClientTokenAuthGuard_Socket_1.default),
    (0, websockets_1.SubscribeMessage)("change_status_for_notification_alert"),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_status_for_notification_alert_ws_server_dto_1.ChangeStatusFoNotificationAlertWsServerDto, Object]),
    __metadata("design:returntype", Promise)
], WsServerGateway.prototype, "changeStatusForNotificationAlert", null);
WsServerGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        transports: ["polling", "websocket"],
        cors: {
            origin: "*",
        },
        allowUpgrades: true,
        allowEIO3: true,
    }),
    __metadata("design:paramtypes", [ws_server_service_1.WsServerService,
        FcmNotificationService_1.default,
        TokenService_1.TokenService])
], WsServerGateway);
exports.WsServerGateway = WsServerGateway;
//# sourceMappingURL=ws-server.gateway.js.map