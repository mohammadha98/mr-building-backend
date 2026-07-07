export default class MarketplaceMessengerTransformer {
    transform(item: any): {
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
    collection(items: any[]): {
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
    getFileInfo(file: any): {
        id: any;
        size: any;
        length: any;
    };
    getClientInfo(item: any): {
        id: any;
        name: string;
        phone: any;
        avatar: string;
    };
    messageTransformer(item: any): any;
    messageCollection(items: any[]): any[];
}
