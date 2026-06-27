import { CreateChannelRealEstateDto } from "./dto/create-channel-real-estate.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetChannelRealEstateDto } from "./dto/get-channel-real-estate.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetMessagesChannelRealEstateDto } from "./dto/get-messages-channel-real-estate.dto";
import { JoinChannelRealEstateDto } from "./dto/join-channel-real-estate.dto";
import { StoreMessageChannelRealEstateDto } from "./dto/store-message-channel-real-estate.dto";
export declare class ChannelRealEstateService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createChannel(createChannelRealEstateDto: CreateChannelRealEstateDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            last_message: any;
            id: number;
            key: string;
            real_estate_agent: {
                avatar: string;
                id: number;
                name: string;
            };
        };
    }>;
    joinChannel(body: JoinChannelRealEstateDto): Promise<{
        status: number;
    }>;
    leaveChannel(body: JoinChannelRealEstateDto): Promise<{
        status: number;
    }>;
    getMyChannels(body: GetChannelRealEstateDto): Promise<{
        status: number;
        user_channel?: undefined;
        pinned?: undefined;
        channels?: undefined;
    } | {
        status: number;
        user_channel: any;
        pinned: any;
        channels: any;
    }>;
    getMessages(body: GetMessagesChannelRealEstateDto): Promise<{
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
            type: string;
            content: string;
            caption: string;
            mode: string;
            is_replied: boolean;
            reply_to_id: number;
            size: number;
            length: number;
            thumbnail: string;
            created_at: Date;
            seen_number: number;
            channel_id: number;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    storeNewMessage(body: StoreMessageChannelRealEstateDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: number;
            key: string;
            last_message_time: Date;
            real_estate_agent: {
                id: number;
                name: string;
                avatar: string;
            };
            messages: {
                id: number;
                size: number;
                length: number;
                thumbnail: string;
                type: string;
                content: string;
                key: string;
                created_at: Date;
                channel_id: number;
            }[];
            number_of_messages: number;
            members: {
                number_of_read_messages: number;
            }[];
        };
    }>;
    private generateChannelKey;
    findOneByID(item_id: number): Promise<{
        id: number;
        real_estate_agent: {
            id: number;
            name: string;
        };
    }>;
    findMessagesByID(item_id: number): Promise<{
        id: number;
        content: string;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
