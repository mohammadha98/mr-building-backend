import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetChannelsDto } from "./dto/get-channels.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import UploadService from "src/modules/services/UploadService";
import { UpdateChannelTypeDto } from "./dto/update-channel-type-channel.dto";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { GetGroupInfoDto } from "src/modules/v2/messenger_groups/app/dto/get-group-info";
import { LeftMessenger } from "src/modules/v2/ws-server/dto/messenger/LeftMessenger";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusRequestVerifyDto } from "./dto/changeStatus-request-verify.dto";
export declare class MessengerChannelsService {
    private readonly prismaService;
    private readonly uploaderServer;
    constructor(prismaService: PrismaService, uploaderServer: UploadService);
    UpdateChannelTypeDto(body: UpdateChannelTypeDto): Promise<{
        status: number;
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
    countChannelMembers(channel_id: number): Promise<number>;
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
    getChannels(query: PaginationDto): Promise<{
        status: number;
        channels: any[];
        metadata: IMetadata;
    } | {
        status: number;
        channels?: undefined;
        metadata?: undefined;
    }>;
    channelOfficials(query: PaginationDto): Promise<{
        status: number;
        channels: {
            status: string;
            verified_channel: boolean;
            createdAt: Date;
            id: string;
            description: string;
            updatedAt: Date;
            ownerId: number;
            channelId: number;
            channel: {
                id: number;
                key: string;
                title: string;
                verified_channel: boolean;
                request: import("@prisma/client/runtime").GetResult<{
                    id: string;
                    description: string;
                    verified_channel: boolean;
                    status: string;
                    ownerId: number;
                    channelId: number;
                    createdAt: Date;
                    updatedAt: Date;
                }, unknown, never> & {};
                description: string;
                avatar: string;
                type: string;
                username: string;
                owner_id: number;
                last_message_time: Date;
                owner: {
                    id: number;
                    name: string;
                    surname: string;
                    phone: string;
                };
                created_at: Date;
            };
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        channels?: undefined;
        metadata?: undefined;
    }>;
    changeStatusRequests(body: ChangeStatusRequestVerifyDto): Promise<{
        status: number;
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
        messages: (import("@prisma/client/runtime").GetResult<{
            id: number;
            key: string;
            owner_id: number;
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
            forward_from_client_id: number;
            forward_from_channel_id: number;
            created_at: Date;
            reply_to_id: number;
            seen_number: number;
            channel_id: number;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    getMembers(body: GetChannelsMembersDto): Promise<{
        status: number;
        members?: undefined;
    } | {
        status: number;
        members: {
            role: string;
            client: {
                id: number;
                key: string;
                avatar: string;
                name: string;
                surname: string;
            };
        }[];
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
    }>;
    getChannelVerified(body: GetChannelsDto): Promise<{
        status: number;
        channels?: undefined;
    } | {
        status: number;
        channels: any[];
    }>;
    private generatePrivateUsername;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
