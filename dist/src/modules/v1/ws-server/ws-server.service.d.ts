import { Cache } from "cache-manager";
import { PrismaService } from "../../../../prisma/prisma.service";
import { LeaveAdvisorRoleInRealEstateDto, SendMessageRealEstateWsServerDto } from "./dto/real-estate-agent/send-message-realEstateAgent-ws-server.dto";
import ChatRealEstetMessageTransformer from "src/modules/v1/chat-real-estate/app/Transformer";
import { SeenMessageRealEstateAgentChatWsServerDto } from "./dto/real-estate-agent/seen-message-RealEstetAgent-ws-server.dto";
import { Socket } from "socket.io";
import { SeenRealEstateChannelWsServerDto } from "./dto/real-estate-agent/seen-real-estate-channel-ws-server.dto";
import { ForwardMessageInPrivateChatWsServerDto, ForwardMessageInSaveMessage, SendMessageMessengerWsServerDto } from "./dto/messenger/channel/send-message-rmessenger-ws-server.dto";
import MessengerAppTransformer from "src/modules/v1/messenger/app/Transformer";
import { SeenMessageInMessengerWsServerDto } from "./dto/messenger/seen-message-messenger-ws-server.dto";
import { AddMembersInMessengerWsServerDto, ChangeMemberRoleToAdminChannel, ChangeMemberRoleToAdminGroup } from "./dto/messenger/channel/add-members-messenger-ws-server.dto";
import { MessengerChannelsService } from "src/modules/v1/messenger_channels/app/messenger-channels.service";
import { MessengerGroupsService } from "src/modules/v1/messenger_groups/app/messenger-groups.service";
import { ForwardMessageIntoChannelMessengerDto, SendMessegeInChannelMessengerWsServerDto } from "./dto/messenger/channel/send-messege-channel-ws-server.dto";
import MessengerChannelTransformer from "src/modules/v1/messenger_channels/app/Transformer";
import { deleteChannelMessengerWsServerDto } from "./dto/messenger/channel/deleteChannelMessenger-ws-server.dto";
import { AddMembersInGroupMessengerWsServerDto } from "./dto/messenger/channel/add-members-group-messenger-ws-server.dto copy";
import { deleteGroupMessengerWsServerDto } from "./dto/messenger/channel/deleteGroupMessenger-ws-server.dto";
import { deleteMessageInMessengerDto, ForwardMessagesInGroupMessengerDto, SendMessegeInGroupMessengerWsServerDto } from "./dto/messenger/channel/send-messege-group-ws-server.dto";
import MessengerGroupsTransformer from "src/modules/v1/messenger_groups/app/Transformer";
import { MemberCountMessengerWsServerDto } from "./dto/messenger/channel/member-count-messenger-ws-server.dto2";
import { LeftMessenger } from "./dto/messenger/LeftMessenger";
import { MessengerService } from "../messenger/app/messenger.service";
import { BlockUserWsServerDto } from "./dto/messenger/channel/block-user-ws-server.dto";
import { SeenChannelMessengerWsServerDto } from "./dto/messenger/channel/seen-channel-messenger-ws-server.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { NotificationsService } from "../notifications/app/notifications.service";
import UploadService from "src/modules/services/UploadService";
import { MessengerSaveMessageService } from "../messenger-save-message/app/save-message.service";
import { RealEstateAgentsAdvisorsService } from "../real-estate-agents-advisors/app/real-estate-agents-advisors.service";
import { ChangeStatusFoNotificationAlertWsServerDto } from "./dto/messenger/change_status_for_notification_alert-ws-server.dto";
import { SendMessageInMarketplaceWs } from "./dto/marketplace/send-message-in-marketplace-ws.dto";
import { MarketplaceMessengerFactory } from "../marketplace-messenger/app/factory/MarketplaceMessenger-factory";
import { SeenMessageMarketplaceWsDto } from "./dto/marketplace/seen-message-marketplace-ws.dto";
export declare class WsServerService {
    private cacheManager;
    private readonly prismaService;
    private readonly chatRealEstetMessageTransformer;
    private readonly messengerService;
    private readonly messengerTransformer;
    private readonly messengerChannelsService;
    private readonly messengerGroupsService;
    private readonly messengerChannelTransformer;
    private readonly messengerGroupTransformer;
    private readonly notificationsService;
    private readonly fcmNotificationService;
    private readonly saveMessageService;
    private readonly uploadService;
    private readonly advisorsService;
    private readonly marketplaceMessengerFactory;
    constructor(cacheManager: Cache, prismaService: PrismaService, chatRealEstetMessageTransformer: ChatRealEstetMessageTransformer, messengerService: MessengerService, messengerTransformer: MessengerAppTransformer, messengerChannelsService: MessengerChannelsService, messengerGroupsService: MessengerGroupsService, messengerChannelTransformer: MessengerChannelTransformer, messengerGroupTransformer: MessengerGroupsTransformer, notificationsService: NotificationsService, fcmNotificationService: FcmNotificationService, saveMessageService: MessengerSaveMessageService, uploadService: UploadService, advisorsService: RealEstateAgentsAdvisorsService, marketplaceMessengerFactory: MarketplaceMessengerFactory);
    getClientWithID(client_id: number): Promise<{
        id: number;
        name: string;
        surname: string;
        phone: string;
        key: string;
        token: string;
        roles: string[];
        avatar: string;
        status: string;
        province: import("@prisma/client/runtime").GetResult<{
            id: number;
            name: string;
            slug: string;
        }, unknown, never> & {};
        city: import("@prisma/client/runtime").GetResult<{
            id: number;
            name: string;
            slug: string;
            province_id: number;
        }, unknown, never> & {};
        notification_tokens: (import("@prisma/client/runtime").GetResult<{
            id: string;
            notification_token: string;
            device_info: string;
            client_id: number;
            created_at: Date;
        }, unknown, never> & {})[];
    }>;
    private getClientWithPhone;
    connectUser(clientInfo: any, socketId: any): Promise<void>;
    disconnectUser(clientInfo: any): Promise<boolean>;
    sendMessageInRealEstateAgentSection(body: SendMessageRealEstateWsServerDto): Promise<false | {
        chatInfoForStarter: {
            id: any;
            key: any;
            type: any;
            chat_type: any;
            source: any;
            number_of_unread_messages: any;
            starter_info: {
                id: any;
                name: any;
                phone: any;
                avatar: string;
            };
            participant_info: {
                id: any;
                name: any;
                phone: any;
                avatar: string;
            };
            last_message: {
                id: any;
                client_id: any;
                type: any;
                message_side: any;
                content: any;
                size: any;
                length: any;
                thumbnail: any;
                key: any;
                seen: any;
                created_at: {
                    day: number;
                    month: string;
                    year: number;
                    time: string;
                };
            };
        };
        chatInfoForParticipant: {
            id: any;
            key: any;
            type: any;
            chat_type: any;
            source: any;
            number_of_unread_messages: any;
            starter_info: {
                id: any;
                name: any;
                phone: any;
                avatar: string;
            };
            participant_info: {
                id: any;
                name: any;
                phone: any;
                avatar: string;
            };
            last_message: {
                id: any;
                client_id: any;
                type: any;
                message_side: any;
                content: any;
                size: any;
                length: any;
                thumbnail: any;
                key: any;
                seen: any;
                created_at: {
                    day: number;
                    month: string;
                    year: number;
                    time: string;
                };
            };
        };
        sourceList: any[];
        destinationList: any[];
    }>;
    sendMessageInMarketplaceChat(body: SendMessageInMarketplaceWs): Promise<false | {
        id: any;
        key: any;
        type: any;
        notification: any;
        action_type: any;
        message_type: any;
        number_of_unread_messages: any;
        starter_info: {
            id: any;
            name: string;
            phone: any;
            avatar: string;
        };
        participant_info: {
            id: any;
            name: string;
            phone: any;
            avatar: string;
        };
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    sendMessageForRealEstateChannelMembers(body: any, socket: Socket): Promise<boolean>;
    seenChannelRealEstate(body: SeenRealEstateChannelWsServerDto): Promise<boolean>;
    seenMessage(body: SeenMessageRealEstateAgentChatWsServerDto): Promise<{
        dest_user_key: any;
        result: {
            source: string;
            key: string;
            message_id: number;
            seen: boolean;
        };
    }>;
    seenManyInRealEstetAgentChat(body: SeenMessageRealEstateAgentChatWsServerDto): Promise<{
        dest_user_key: any;
        result: {
            source: string;
            key: string;
            message_id: number;
            seen: boolean;
        };
    }>;
    private getChatInfoForStarter;
    private getChatInfoForParticipant;
    private getNumberOfUnreadMessagesInRealEstateChatHistory;
    private saveMessageInChatRealEstateMessage;
    getClientFromDB(phone: string): Promise<any>;
    private getRealEstateChatInfo;
    sendMessageInMessenger(body: SendMessageMessengerWsServerDto): Promise<false | {
        id: any;
        key: any;
        type: any;
        notification: any;
        is_blocked: any;
        is_forwarded: any;
        action_type: any;
        chat_blocking_status: any;
        blocked_account_ids: any;
        blocked_participant: any;
        blocked_by_participant: any;
        message_type: any;
        number_of_unread_messages: any;
        starter_info: {
            id: any;
            name: string;
            phone: any;
            avatar: string;
        };
        participant_info: {
            id: any;
            name: string;
            phone: any;
            avatar: string;
        };
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    sendMessageInSaveMessage(body: SendMessageMessengerWsServerDto): Promise<false | {
        id: any;
        key: any;
        message_type: string;
        created_at: any;
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    private saveMessageInMessenger;
    forwardMessageInChat(body: ForwardMessageInPrivateChatWsServerDto): Promise<false | Partial<import("@prisma/client/runtime").GetResult<{
        id: number;
        client_id: number;
        destination_id: number;
        chat_key: string;
        notification: boolean;
        type: string;
        content: string;
        caption: string;
        seen: boolean;
        size: number;
        length: number;
        thumbnail: string;
        is_blocked: boolean;
        is_replied: boolean;
        is_edited: boolean;
        action_type: string;
        is_forwarded: boolean;
        forward_from: string;
        forward_message_id: number;
        forward_from_client_id: number;
        forward_from_channel_id: number;
        have_reaction: boolean;
        is_deleted: boolean;
        reaction: string;
        created_at: Date;
        received_at: Date;
        reply_to_id: number;
    }, unknown, never> & {}>>;
    private forwardMessageIntoPrivateChat;
    private getChatInfoForStarterInForwardMessages;
    forwardMessageIntoSaveMessage(body: ForwardMessageInSaveMessage): Promise<any>;
    private getChatInfoForStarterInMessenger;
    private getNumberOfUnreadMessagesInMessengerHistory;
    seenMessenger(body: SeenMessageInMessengerWsServerDto): Promise<SeenMessageInMessengerWsServerDto>;
    seenChannelMessenger(body: SeenChannelMessengerWsServerDto): Promise<{
        result: {
            key: string;
            seen: boolean;
        };
    }>;
    seenGroupMessenger(body: SeenChannelMessengerWsServerDto): Promise<{
        result: {
            key: string;
            seen: boolean;
        };
    }>;
    deleteChannelMessenger(body: deleteChannelMessengerWsServerDto): Promise<{
        client_id: number;
    }[]>;
    getClientNotificationToken(clientId: number): Promise<string[]>;
    deleteGroupMessenger(body: deleteGroupMessengerWsServerDto): Promise<any[]>;
    sendMessageInGroupMessenger(body: SendMessegeInGroupMessengerWsServerDto): Promise<any>;
    forwardMessageIntoGroup(body: ForwardMessagesInGroupMessengerDto): Promise<{
        id: any;
        owner_id: any;
        is_owner: boolean;
        member_is_muted: boolean;
        notification: any;
        role: any;
        permissions: any;
        user_member_id: number;
        parent_ids: any[];
        key: any;
        title: any;
        member_count: any;
        member_ids: any;
        description: any;
        avatar: string;
        type: any;
        message_type: any;
        link: any;
        number_of_unread_messages: any;
        last_message: any[];
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    sendMessageInChannelMessenger(body: SendMessegeInChannelMessengerWsServerDto): Promise<any>;
    private copyFileForForward;
    forwardMessageToChannel(body: ForwardMessageIntoChannelMessengerDto): Promise<any>;
    addMembersInGroupMessenger(body: AddMembersInGroupMessengerWsServerDto): Promise<{
        member_count: number;
        member_ids: any[];
        notification_tokens: any[];
    } | {
        member_count?: undefined;
        member_ids?: undefined;
        notification_tokens?: undefined;
    }>;
    addMembersInChannelMessenger(body: AddMembersInMessengerWsServerDto): Promise<{
        member_count: number;
        notification_tokens: any[];
    } | {
        member_count?: undefined;
        notification_tokens?: undefined;
    }>;
    joinedGroupMessenger(body: MemberCountMessengerWsServerDto): Promise<{
        status: number;
        member_count?: undefined;
    } | {
        status: number;
        member_count: number;
    }>;
    joinedChannelMessenger(body: MemberCountMessengerWsServerDto): Promise<{
        status: number;
        member_count: number;
    }>;
    LeftMessenger(body: LeftMessenger): Promise<any>;
    joinIntoPrivateRoom(body: any): Promise<{
        id: number;
        name: string;
        surname: string;
        phone: string;
        key: string;
        token: string;
        roles: string[];
        avatar: string;
        status: string;
        province: import("@prisma/client/runtime").GetResult<{
            id: number;
            name: string;
            slug: string;
        }, unknown, never> & {};
        city: import("@prisma/client/runtime").GetResult<{
            id: number;
            name: string;
            slug: string;
            province_id: number;
        }, unknown, never> & {};
        notification_tokens: (import("@prisma/client/runtime").GetResult<{
            id: string;
            notification_token: string;
            device_info: string;
            client_id: number;
            created_at: Date;
        }, unknown, never> & {})[];
    }>;
    joinToPrivateChat(body: any): Promise<{
        id: number;
        key: string;
    }[]>;
    joinTheChannels(body: any): Promise<{
        channel: {
            key: string;
        };
    }[]>;
    joinInSaveMessage(body: any): Promise<{
        id: any;
        key: any;
        message_type: string;
        created_at: any;
        last_message: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }>;
    joinTheGroups(body: any): Promise<{
        group: {
            key: string;
        };
    }[]>;
    joinTheRealEstateAgentRoom(body: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        tracking_code: string;
        name: string;
        phone: string;
        validate_phone: boolean;
        avatar: string;
        license: string;
        license_status: string;
        status: string;
        score: number;
        total_score: number;
        number_of_ads: number;
        created_at: Date;
        approved_at: Date;
        client_id: number;
        province_id: number;
        city_id: number;
        published_count: number;
        approved_count: number;
        rejected_count: number;
        published_ad_time: Date;
    }, unknown, never> & {}>;
    getStorefrontInfo(body: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        trackingCode: string;
        name: string;
        description: string;
        color: string;
        phone: string;
        validate_phone: boolean;
        avatar: string;
        avatar_thumbnail: string;
        license: string;
        license_status: string;
        status: string;
        score: number;
        total_score: number;
        number_of_products: number;
        number_of_sales: number;
        latitude: number;
        longitude: number;
        created_at: Date;
        approved_at: Date;
        rejected_at: Date;
        client_id: number;
        province_id: number;
        city_id: number;
        categoryId: string;
    }, unknown, never> & {}>;
    getMarketplaceChatList(body: any): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        key: string;
        client_id: number;
        type: string;
        chat_type: string;
        starter_id: number;
        participant_id: number;
        status: string;
        last_message_time: Date;
        created_at: Date;
    }, unknown, never> & {})[]>;
    blockUser(body: BlockUserWsServerDto): Promise<{
        participantKey: string;
        source_key: string;
    }>;
    unblockUser(body: BlockUserWsServerDto): Promise<{
        participantKey: string;
        source_key: string;
    }>;
    deleteMessageInChat(body: deleteMessageInMessengerDto): Promise<false | {
        transformer: any;
        deleted_messages: any[];
    }>;
    deleteMessageInMarketplaceChat(body: deleteMessageInMessengerDto): Promise<false | {
        transformer: any;
        deleted_messages: any[];
    }>;
    seenMessagesInMarketplaceChat(body: SeenMessageMarketplaceWsDto): Promise<void>;
    deleteMessageInChannelMessenger(body: deleteMessageInMessengerDto): Promise<false | {
        transformer: any;
        deleted_messages: any[];
    }>;
    deleteMessageInGroupMessenger(body: deleteMessageInMessengerDto): Promise<false | {
        transformer: any;
        deleted_messages: any[];
    }>;
    deleteMessageInSaveMessage(body: deleteMessageInMessengerDto): Promise<false | {
        last_message: import("@prisma/client/runtime").GetResult<{
            id: number;
            key: string;
            type: string;
            content: string;
            caption: string;
            size: number;
            length: number;
            thumbnail: string;
            is_replied: boolean;
            is_edited: boolean;
            action_type: string;
            is_forwarded: boolean;
            forward_from: string;
            forward_message_id: number;
            have_reaction: boolean;
            reaction: string;
            save_message_id: number;
            forward_from_client_id: number;
            forward_from_channel_id: number;
            created_at: Date;
            reply_to_id: number;
        }, unknown, never> & {};
        deleted_messages: any[];
    }>;
    ChangeMemberRoleToAdminChannel(body: ChangeMemberRoleToAdminChannel): Promise<{
        member_id: any;
        creator_id: any;
        parent_ids: any;
        role: any;
        permissions: any;
        client_id: any;
        user_key: any;
        phone: any;
        name: string;
        avatar: string;
    } | {
        status: number;
    }>;
    ChangeMemberRoleToAdminGroup(body: ChangeMemberRoleToAdminGroup): Promise<{
        member_id: any;
        creator_id: any;
        parent_ids: any;
        role: any;
        permissions: any;
        client_id: any;
        user_key: any;
        phone: any;
        name: string;
        avatar: string;
    } | {
        status: number;
    }>;
    leaveAdvisorRoleInRealEstate(body: LeaveAdvisorRoleInRealEstateDto): Promise<false | {
        status: number;
        realEstateTrackingCode?: undefined;
    } | {
        status: number;
        realEstateTrackingCode: string;
    }>;
    changeStatusForNotificationAlert(body: ChangeStatusFoNotificationAlertWsServerDto): Promise<boolean>;
}
