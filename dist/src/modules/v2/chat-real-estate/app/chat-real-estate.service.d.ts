import { CreateChatRealEstateDto } from "./dto/create-chat-real-estate.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetChatRealEstateDto } from "./dto/get-chat-real-estate.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetMessagesChatRealEstateDto } from "./dto/get-messages-chat-real-estate.dto";
import MessageTransformer from "./Transformer";
export declare class ChatRealEstateService {
    private readonly prismaService;
    private readonly messageTransformer;
    constructor(prismaService: PrismaService, messageTransformer: MessageTransformer);
    storeChatRequest(createChatRealEstateDto: CreateChatRealEstateDto): Promise<{
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
            chat_type: string;
            starter: {
                id: number;
                name: string;
                surname: string;
                phone: string;
                roles: string[];
                avatar: string;
            };
            participant: {
                id: number;
                name: string;
                surname: string;
                phone: string;
                roles: string[];
                avatar: string;
            };
        };
    }>;
    findMyChats(query: GetChatRealEstateDto): Promise<{
        status: number;
        presentedPersonal?: undefined;
        presentedRealEstateChats?: undefined;
    } | {
        status: number;
        presentedPersonal: any[];
        presentedRealEstateChats: any[];
    }>;
    private getChatsForClient;
    private getChatsForRealEstate;
    private clientInfoForChat;
    private realEstateInfoForChat;
    private getRealEstateChatInfo;
    private getRealEstateInfoForChat;
    private getClientInfoForChat;
    private realEstateInfoByClientId;
    findMessages(query: GetMessagesChatRealEstateDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: (import("@prisma/client/runtime").GetResult<{
            id: number;
            client_id: number;
            destination_id: number;
            message_side: string;
            key: string;
            type: string;
            content: string;
            caption: string;
            seen: boolean;
            mode: string;
            is_replied: boolean;
            reply_to_id: number;
            size: number;
            length: number;
            thumbnail: string;
            created_at: Date;
            received_at: Date;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    private generateChatKey;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
