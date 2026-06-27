import { CreateChatMessenger } from "./dto/create-chat.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetMyCHatsDto } from "./dto/get-my-chats.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetMessagesDto } from "./dto/get-messages.dto";
import MessengerAppTransformer from "./Transformer";
import { ClientService } from "src/modules/v1//client/app/client.service";
import UploadService from "src/modules/services/UploadService";
import { Cache } from "cache-manager";
import { MessengerSaveMessageService } from "../../messenger-save-message/app/save-message.service";
export declare class MessengerService {
    private cacheManager;
    private readonly prismaService;
    private readonly messageTransformer;
    private readonly clientService;
    private readonly uploadService;
    private readonly saveMessageService;
    constructor(cacheManager: Cache, prismaService: PrismaService, messageTransformer: MessengerAppTransformer, clientService: ClientService, uploadService: UploadService, saveMessageService: MessengerSaveMessageService);
    storeChatRequest(body: CreateChatMessenger): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: number;
            key: string;
            last_message_time: Date;
            created_at: Date;
            type: string;
            starter: {
                id: number;
                name: string;
                surname: string;
                phone: string;
                avatar: string;
            };
            participant: {
                id: number;
                name: string;
                surname: string;
                phone: string;
                avatar: string;
            };
        };
    }>;
    findMyChats(query: GetMyCHatsDto): Promise<{
        status: number;
        chatList?: undefined;
        blocked_account_ids?: undefined;
        blocked_participant_ids?: undefined;
    } | {
        status: number;
        chatList: any[];
        blocked_account_ids: any[];
        blocked_participant_ids: any[];
    }>;
    private getPrivateChats;
    private presentedChatList;
    getChatKeys(client_id: number): Promise<{
        id: number;
        key: string;
    }[]>;
    blockUser(clientId: number, participantId: number): Promise<void>;
    deleteMessageInChat({ message_ids, type, room, isOnline, client_id, }: any): Promise<{
        last_message: {
            id: number;
            reaction: string;
            chat_key: string;
            content: string;
            caption: string;
            size: number;
            length: number;
            thumbnail: string;
            created_at: Date;
            seen: boolean;
            is_edited: boolean;
            is_replied: boolean;
            is_blocked: boolean;
            have_reaction: boolean;
            type: string;
            is_forwarded: boolean;
            action_type: string;
            forward_from: string;
            forward_from_client_id: number;
            forward_message_id: number;
            forward_from_channel: {
                id: number;
                key: string;
                username: string;
                title: string;
                avatar: string;
            };
            client_id: number;
            client: {
                id: number;
                name: string;
                surname: string;
                avatar: string;
                phone: string;
            };
            reply_to: {
                id: number;
                reaction: string;
                chat_key: string;
                content: string;
                caption: string;
                size: number;
                length: number;
                thumbnail: string;
                created_at: Date;
                type: string;
                action_type: string;
                client_id: number;
                client: {
                    id: number;
                    name: string;
                    surname: string;
                    avatar: string;
                    phone: string;
                };
            };
            replied_by: {
                id: number;
                reaction: string;
                chat_key: string;
                content: string;
                caption: string;
                size: number;
                length: number;
                created_at: Date;
                seen: boolean;
                is_edited: boolean;
                is_replied: boolean;
                have_reaction: boolean;
                type: string;
            }[];
        };
        deleted_messages: any[];
    }>;
    unblockUser(clientId: number, participantId: number): Promise<void>;
    findMessages(query: GetMessagesDto): Promise<{
        status: number;
        result?: undefined;
        edited?: undefined;
        deleted?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: any[];
        edited: {
            id: number;
            reaction: string;
            chat_key: string;
            content: string;
            caption: string;
            size: number;
            length: number;
            thumbnail: string;
            created_at: Date;
            seen: boolean;
            is_blocked: boolean;
            is_deleted: boolean;
            is_edited: boolean;
            is_replied: boolean;
            is_forwarded: boolean;
            have_reaction: boolean;
            type: string;
            client_id: number;
            client: {
                id: number;
                name: string;
                surname: string;
                avatar: string;
                phone: string;
            };
            reply_to: {
                id: number;
                reaction: string;
                chat_key: string;
                content: string;
                caption: string;
                size: number;
                length: number;
                thumbnail: string;
                created_at: Date;
                type: string;
                action_type: string;
                client_id: number;
                client: {
                    id: number;
                    name: string;
                    surname: string;
                    avatar: string;
                    phone: string;
                };
            };
            replied_by: {
                id: number;
                reaction: string;
                chat_key: string;
                content: string;
                caption: string;
                size: number;
                length: number;
                created_at: Date;
                seen: boolean;
                is_blocked: boolean;
                is_edited: boolean;
                is_replied: boolean;
                is_forwarded: boolean;
                have_reaction: boolean;
                type: string;
            }[];
        }[];
        deleted: any[];
        metadata: IMetadata;
    }>;
    AllDataInMessenger(client_id: number): Promise<{
        status: number;
        saveMessageService?: undefined;
        blocked_account_ids?: undefined;
        blocked_participant_ids?: undefined;
        getPrivateChats?: undefined;
        getMessengerGroups?: undefined;
        getMessengerChannels?: undefined;
    } | {
        status: number;
        saveMessageService: {
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
        };
        blocked_account_ids: any[];
        blocked_participant_ids: any[];
        getPrivateChats: any[];
        getMessengerGroups: any[];
        getMessengerChannels: any[];
    }>;
    sortChatsByDate(list: any[]): Promise<any[]>;
    private getMessengerGroups;
    private getMessengerChannels;
    getClientInfo(clientId: number): Promise<{
        id: number;
        name: string;
        surname: string;
        key: string;
        phone: string;
        avatar: string;
    }>;
    getGroupsInfo(groups: any[]): Promise<any[]>;
    getChannelsInfo(channels: any[]): Promise<any[]>;
    private generateChatKey;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
