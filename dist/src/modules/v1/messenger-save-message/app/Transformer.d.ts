export default class MessengerSaveMessageTransformer {
    transform(item: any): {
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
    collection(items: any[]): {
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
    }[];
    messageTransformer(item: any): any;
    messageCollection(items: any[]): any[];
}
