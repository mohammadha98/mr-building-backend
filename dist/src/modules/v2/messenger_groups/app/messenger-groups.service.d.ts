import { CreateGroupDto } from "./dto/create-group.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetGroupsDto } from "./dto/get-groups.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetGroupsMessagesDto } from "./dto/get-messages.dto";
import { JoinGroupDto } from "./dto/join-group.dto";
import UploadService from "src/modules/services/UploadService";
import { UpdateGroupTypeDto } from "./dto/update-group-type.dto";
import { GetGroupMembersDto } from "./dto/getMembers";
import { GetGroupInfoDto } from "./dto/get-group-info";
import { LeftMessenger } from "src/modules/v2/ws-server/dto/messenger/LeftMessenger";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { NotificationsService } from "../../notifications/app/notifications.service";
import { ChangeMemberRoleToAdminGroup } from "../../ws-server/dto/messenger/channel/add-members-messenger-ws-server.dto";
import MessengerGroupsTransformer from "./Transformer";
import { ForwardMessagesInGroupMessengerDto } from "../../ws-server/dto/messenger/channel/send-messege-group-ws-server.dto";
export declare class MessengerGroupsService {
    private readonly prismaService;
    private readonly notificationsService;
    private readonly fcmNotificationService;
    private readonly uploadService;
    private readonly messengerGroupsTransformer;
    constructor(prismaService: PrismaService, notificationsService: NotificationsService, fcmNotificationService: FcmNotificationService, uploadService: UploadService, messengerGroupsTransformer: MessengerGroupsTransformer);
    createGroup(body: CreateGroupDto): Promise<{
        status: number;
        result: any;
    } | {
        status: number;
        result?: undefined;
    }>;
    joinGroup(body: JoinGroupDto): Promise<{
        status: number;
        member_count?: undefined;
    } | {
        status: number;
        member_count: number;
    }>;
    UpdateGroupTypeDto(body: UpdateGroupTypeDto): Promise<{
        status: number;
    }>;
    deleteMessage(message_ids: [number], type: string, room: string): Promise<{
        last_message: {
            owner: {
                id: number;
                name: string;
                surname: string;
                avatar: string;
                phone: string;
            };
            id: number;
            size: number;
            length: number;
            thumbnail: string;
            type: string;
            content: string;
            caption: string;
            key: string;
            created_at: Date;
            group_id: number;
            is_forwarded: boolean;
            action_type: string;
            forward_from: string;
            forward_from_client_id: number;
            forward_message_id: number;
            forward_from_channel_id: number;
            forward_from_channel: {
                id: number;
                title: string;
                key: string;
                username: string;
                avatar: string;
            };
        };
        deleted_messages: any[];
    }>;
    validateGroupLink(body: UpdateGroupTypeDto): Promise<{
        status: number;
        validateStatus?: undefined;
    } | {
        status: number;
        validateStatus: boolean;
    }>;
    addMembers(clients: any[], group_id: number): Promise<{
        status: number;
        member_ids: any[];
        member_count: number;
    } | {
        status: number;
        member_ids?: undefined;
        member_count?: undefined;
    }>;
    countGroupMembers(group_id: number): Promise<number>;
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
    leaveGroup(body: LeftMessenger): Promise<{
        status: number;
        member_ids?: undefined;
        member_count?: undefined;
    } | {
        status: number;
        member_ids: any[];
        member_count: number;
    }>;
    getMyGroups(body: GetGroupsDto): Promise<{
        status: number;
        groups?: undefined;
    } | {
        status: number;
        groups: any[];
    }>;
    private getMessengerGroups;
    private presentedGroups;
    groupInfo(body: GetGroupInfoDto): Promise<{
        status: number;
        groups?: undefined;
        has_joined?: undefined;
    } | {
        status: number;
        groups: any[];
        has_joined: boolean;
    }>;
    getGroupsInfo(groups: any[]): Promise<any[]>;
    getMembers(body: GetGroupMembersDto): Promise<{
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
                phone: string;
                key: string;
                avatar: string;
                name: string;
                surname: string;
            };
        }[];
    }>;
    getMessages(body: GetGroupsMessagesDto): Promise<{
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
    private generateKey;
    private generatePrivateUsername;
    generateUsernameForGroup(group_id: number): Promise<{
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
        type: string;
        title: string;
        description: string;
        avatar: string;
        notification: boolean;
        last_message_time: Date;
        number_of_messages: number;
        created_at: Date;
    }, unknown, never> & {}>;
    saveNewMessage(body: any, client_id: number): Promise<any>;
    private copyFileForForward;
    forwardMessage(messageBody: ForwardMessagesInGroupMessengerDto): Promise<{
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
    deleteGroup(body: any): Promise<{
        client_id: number;
    }[]>;
    getGroupsKey(client_id: number): Promise<{
        group: {
            key: string;
        };
    }[]>;
    findMessagesByID(item_id: number): Promise<{
        id: number;
        content: string;
        caption: string;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
