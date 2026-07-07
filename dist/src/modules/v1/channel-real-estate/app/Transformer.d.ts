export default class ChannelTransformer {
    transform(item: any): {
        number_of_unread_messages: number;
        last_message: {
            id: any;
            channel_id: any;
            key: any;
            type: any;
            content: any;
            size: any;
            length: any;
            thumbnail: any;
            created_at: {
                day: number;
                month: string;
                year: number;
                time: string;
            };
        };
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        agent_id: any;
        name: any;
        profile: string;
        id: any;
        key: any;
    };
    collection(items: any[]): {
        number_of_unread_messages: number;
        last_message: {
            id: any;
            channel_id: any;
            key: any;
            type: any;
            content: any;
            size: any;
            length: any;
            thumbnail: any;
            created_at: {
                day: number;
                month: string;
                year: number;
                time: string;
            };
        };
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        agent_id: any;
        name: any;
        profile: string;
        id: any;
        key: any;
    }[];
    getChannelInfo(item: any): {
        agent_id: any;
        name: any;
        profile: string;
    };
    messageTransformer(item: any): {
        id: any;
        channel_id: any;
        key: any;
        type: any;
        content: any;
        size: any;
        length: any;
        thumbnail: any;
        created_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
    };
    messageCollection(items: any[]): {
        id: any;
        channel_id: any;
        key: any;
        type: any;
        content: any;
        size: any;
        length: any;
        thumbnail: any;
        created_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
    }[];
}
