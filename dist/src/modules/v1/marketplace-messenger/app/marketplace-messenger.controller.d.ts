import { MarketplaceMessengerService } from "./marketplace-messenger.service";
import { CreateChatInMarketplaceDto } from "./dto/create-chat-in-marketplace.dto";
import { GetMessagesDto } from "../../messenger/app/dto/get-messages.dto";
export declare class MarketplaceMessengerController {
    private readonly chatService;
    constructor(chatService: MarketplaceMessengerService);
    storeChatRequest(body: CreateChatInMarketplaceDto): Promise<{
        status: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
        status: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    findMessages(query: GetMessagesDto): Promise<{
        status: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
}
