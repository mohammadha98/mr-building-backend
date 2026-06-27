import { CreateChannelDto } from "./dto/create-channel.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetChannelsDto } from "./dto/get-channels.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import { JoinChannelDto } from "./dto/join-channel.dto";
import UploadService from "src/modules/services/UploadService";
import { UpdateChannelTypeDto } from "./dto/update-channel-type-channel.dto";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { GetGroupInfoDto } from "src/modules/v2/messenger_groups/app/dto/get-group-info";
import { LeftMessenger } from "src/modules/v2/ws-server/dto/messenger/LeftMessenger";
import { RequestVerifyChannelDto } from "./dto/request-verify-channel.dto";
import { ChangeMemberRoleToAdminChannel } from "../../ws-server/dto/messenger/channel/add-members-messenger-ws-server.dto";
import MessengerChannelTransformer from "./Transformer";
import { ChangeStatusFoNotificationAlertWsServerDto } from "../../ws-server/dto/messenger/change_status_for_notification_alert-ws-server.dto";
import { ForwardMessageIntoChannelMessengerDto } from "../../ws-server/dto/messenger/channel/send-messege-channel-ws-server.dto";
export declare class MessengerChannelsService {
    private readonly prismaService;
    private readonly uploadService;
    private readonly messengerChannelTransformer;
    constructor(prismaService: PrismaService, uploadService: UploadService, messengerChannelTransformer: MessengerChannelTransformer);
    createChannel(body: CreateChannelDto): Promise<{
        status: number;
        result: any;
    } | {
        status: number;
        result?: undefined;
    }>;
    joinChannel(body: JoinChannelDto): Promise<{
        status: number;
        member_count?: undefined;
    } | {
        status: number;
        member_count: number;
    }>;
    changeStatusForNotificationAlert(body: ChangeStatusFoNotificationAlertWsServerDto): Promise<boolean>;
    UpdateChannelTypeDto(body: UpdateChannelTypeDto): Promise<{
        status: number;
    }>;
    validateChannelLink(body: UpdateChannelTypeDto): Promise<{
        status: number;
        validateStatus?: undefined;
    } | {
        status: number;
        validateStatus: boolean;
    }>;
    addMembers(clients: any[], channel_id: number): Promise<{
        status: number;
        member_count: number;
        newMemberList: any[];
    } | {
        status: number;
        member_count?: undefined;
        newMemberList?: undefined;
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
    countChannelMembers(channel_id: number): Promise<number>;
    deleteMessage(message_ids: [number], type: string, room: string): Promise<{
        last_message: any;
        deleted_messages: any[];
    }>;
    leaveChannel(body: LeftMessenger): Promise<{
        status: number;
        member_count?: undefined;
    } | {
        status: number;
        member_count: number;
    }>;
    channelInfo(body: GetGroupInfoDto): Promise<{
        status: number;
        is_joined?: undefined;
        channels?: undefined;
    } | {
        status: number;
        is_joined: boolean;
        channels: any[];
    }>;
    requestToOfficialChannel(body: RequestVerifyChannelDto): Promise<{
        status: number;
    }>;
    getMyChannels(body: GetChannelsDto): Promise<{
        status: number;
        channels?: undefined;
    } | {
        status: number;
        channels: any[];
    }>;
    getChannelsInfo(channels: any[]): Promise<any[]>;
    getMessages(body: GetChannelsMessagesDto): Promise<{
        status: number;
        membership_status?: undefined;
        messages?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        membership_status: boolean;
        messages: any[];
        metadata: IMetadata;
    }>;
    getMembers(body: GetChannelsMembersDto): Promise<{
        status: number;
        members?: undefined;
    } | {
        status: number;
        members: {
            id: number;
            creator_id: number;
            parent_ids: number[];
            role: string;
            permissions: string[];
            client: {
                id: number;
                key: string;
                phone: string;
                avatar: string;
                name: string;
                surname: string;
            };
        }[];
    }>;
    private generateKey;
    changeStatusForChannel(owner_id: number, status: string): Promise<void>;
    findChannelByClientId(owner_id: number, clientId: number, tag?: string): Promise<{
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
        tag: any;
        title: any;
        requested: boolean;
        verified_channel: {
            id: string;
            verified_channel: boolean;
            description: string;
            status: string;
        };
        member_count: any;
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
    private generatePrivateUsername;
    generateUsernameForChannel(channel_id: number): Promise<{
        status: number;
        username?: undefined;
    } | {
        username: string;
        status?: undefined;
    }>;
    findOneByID(item_id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        key: string;
        username: string;
        owner_id: number;
        tag: string;
        verified_channel: boolean;
        type: string;
        title: string;
        description: string;
        avatar: string;
        notification: boolean;
        last_message_time: Date;
        number_of_messages: number;
        status: string;
        created_at: Date;
    }, unknown, never> & {}>;
    saveNewMessage(body: any, client_id: number): Promise<any>;
    getClientInfo(clientId: number): Promise<{
        id: number;
        name: string;
        surname: string;
        key: string;
        phone: string;
        avatar: string;
    }>;
    private copyFileForForward;
    forwardedMessageHanlder(messageBody: ForwardMessageIntoChannelMessengerDto): Promise<any>;
    deleteChannel(body: any): Promise<{
        client_id: number;
    }[]>;
    getChannelsKey(client_id: number): Promise<{
        channel: {
            key: string;
        };
    }[]>;
    findMessagesByID(item_id: number): Promise<{
        id: number;
        content: string;
        caption: string;
    }>;
    getChannelVerified(body: GetChannelsDto): Promise<{
        status: number;
        channels?: undefined;
    } | {
        status: number;
        channels: any[];
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
