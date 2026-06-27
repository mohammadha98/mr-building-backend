import { MarketplaceMessenger_MessageSection } from "../marketplace-messenger-message.service";
export declare class MarketplaceMessengerFactory {
    private readonly marketplaceMessenger_MessageSection;
    constructor(marketplaceMessenger_MessageSection: MarketplaceMessenger_MessageSection);
    saveMessage(body: any): Promise<{
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
    deleteMessage(body: any): Promise<{
        last_message: any;
        deleted_messages: any[];
    }>;
    seenMessages(body: any): Promise<void>;
}
