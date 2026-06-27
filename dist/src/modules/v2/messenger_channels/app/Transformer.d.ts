export default class MessengerChannelTransformer {
    transform(item: any, client_id: number): {
        id: any;
        owner_id: any;
        is_owner: boolean;
        member_is_muted: boolean;
        notification: any;
        role: any;
        permissions: any;
        user_member_id: number;
        parent_ids: any[];
        key: any;
        tag: any;
        title: any;
        requested: boolean;
        verified_channel: {
            id: string;
            verified_channel: boolean;
            description: string;
            status: string;
        };
        member_count: any;
        description: any;
        avatar: string;
        type: any;
        message_type: any;
        link: any;
        number_of_unread_messages: any;
        last_message: any[];
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    };
    collection(items: any[], client_id: number): {
        id: any;
        owner_id: any;
        is_owner: boolean;
        member_is_muted: boolean;
        notification: any;
        role: any;
        permissions: any;
        user_member_id: number;
        parent_ids: any[];
        key: any;
        tag: any;
        title: any;
        requested: boolean;
        verified_channel: {
            id: string;
            verified_channel: boolean;
            description: string;
            status: string;
        };
        member_count: any;
        description: any;
        avatar: string;
        type: any;
        message_type: any;
        link: any;
        number_of_unread_messages: any;
        last_message: any[];
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
    }[];
    private officialRequest;
    messageTransformer(item: any): any;
    messageCollection(items: any[]): any[];
    memberTransform(items: any): {
        member_id: any;
        creator_id: any;
        parent_ids: any;
        role: any;
        permissions: any;
        client_id: any;
        user_key: any;
        phone: any;
        name: string;
        avatar: string;
    };
    clientInfo(item: any): {
        id: any;
        user_key: any;
        phone: any;
        name: string;
        avatar: string;
    };
    memberCollection(items: any[]): {
        member_id: any;
        creator_id: any;
        parent_ids: any;
        role: any;
        permissions: any;
        client_id: any;
        user_key: any;
        phone: any;
        name: string;
        avatar: string;
    }[];
}
