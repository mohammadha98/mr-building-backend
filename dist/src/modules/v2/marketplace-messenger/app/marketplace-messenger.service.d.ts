import { CreateChatInMarketplaceDto } from "./dto/create-chat-in-marketplace.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MarketplaceMessengerTransformer from "./Transformer";
import { PublicMessage } from "src/commons/enums/messages";
import { Request } from "express";
import { HttpStatusCode } from "axios";
import { GetMessagesDto } from "../../messenger/app/dto/get-messages.dto";
export declare class MarketplaceMessengerService {
    private request;
    private readonly prismaService;
    private readonly messageTransformer;
    private messageSelector;
    private chatSelector;
    constructor(request: Request, prismaService: PrismaService, messageTransformer: MarketplaceMessengerTransformer);
    private checkExistStorefront;
    private checkExistStorefrontByClientId;
    private generateTrackingCode;
    storeChatRequest(body: CreateChatInMarketplaceDto): Promise<{
        status: HttpStatusCode;
        message: PublicMessage;
        data: {
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
        };
    }>;
    findMyChats(): Promise<{
        status: HttpStatusCode;
        message: PublicMessage;
        data: {
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
        }[];
    }>;
    private presentedChat;
    private getLastMessage;
    private starterInfo;
    private getClientInfo;
    private storefrontInfoByClientId;
    findMessages(query: GetMessagesDto): Promise<{
        status: HttpStatusCode;
        message: PublicMessage;
        data: {
            messages: any[];
            edited: any[];
            deleted: any[];
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    private generateConditions;
    private getEditedMessage;
    private getDeletedMessages;
}
