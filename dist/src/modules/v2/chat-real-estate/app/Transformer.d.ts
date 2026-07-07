export default class MessageTransformer {
    transform(item: any): {
        id: any;
        key: any;
        type: any;
        chat_type: any;
        source: any;
        number_of_unread_messages: any;
        starter_info: {
            id: any;
            name: any;
            phone: any;
            avatar: string;
        };
        participant_info: {
            id: any;
            name: any;
            phone: any;
            avatar: string;
        };
        last_message: {
            id: any;
            client_id: any;
            type: any;
            message_side: any;
            content: any;
            size: any;
            length: any;
            thumbnail: any;
            key: any;
            seen: any;
            created_at: {
                day: number;
                month: string;
                year: number;
                time: string;
            };
        };
    };
    collection(items: any[]): {
        id: any;
        key: any;
        type: any;
        chat_type: any;
        source: any;
        number_of_unread_messages: any;
        starter_info: {
            id: any;
            name: any;
            phone: any;
            avatar: string;
        };
        participant_info: {
            id: any;
            name: any;
            phone: any;
            avatar: string;
        };
        last_message: {
            id: any;
            client_id: any;
            type: any;
            message_side: any;
            content: any;
            size: any;
            length: any;
            thumbnail: any;
            key: any;
            seen: any;
            created_at: {
                day: number;
                month: string;
                year: number;
                time: string;
            };
        };
    }[];
    getFileInfo(file: any): {
        id: any;
        size: any;
        length: any;
    };
    getClientInfo(item: any): {
        id: any;
        name: any;
        phone: any;
        avatar: string;
    };
    messageTransformer(item: any): {
        id: any;
        client_id: any;
        type: any;
        message_side: any;
        content: any;
        size: any;
        length: any;
        thumbnail: any;
        key: any;
        seen: any;
        created_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
    };
    messageCollection(items: any[]): {
        id: any;
        client_id: any;
        type: any;
        message_side: any;
        content: any;
        size: any;
        length: any;
        thumbnail: any;
        key: any;
        seen: any;
        created_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
    }[];
}
