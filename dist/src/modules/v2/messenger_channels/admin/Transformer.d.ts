export default class MessengerChannelTransformer {
    transform(item: any): {
        id: any;
        owner_id: any;
        key: any;
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
        username: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
        client_info: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: string;
    };
    collection(items: any[]): {
        id: any;
        owner_id: any;
        key: any;
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
        username: any;
        last_message_time: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        message_time: any;
        client_info: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: string;
    }[];
    private clientInfo;
    private officialRequest;
    transformOfficialChannel(item: any): {
        id: any;
        verified_channel: any;
        description: any;
        status: any;
        created_at: any;
        updatedAt: any;
        channel: {
            id: any;
            owner_id: any;
            key: any;
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
            username: any;
            last_message_time: {
                day: number;
                month: string;
                year: number;
                time: string;
            };
            message_time: any;
            client_info: {
                id: any;
                name: string;
                phone: any;
            };
            created_at: string;
        };
    };
    collectionOfficialChannel(items: any[]): {
        id: any;
        verified_channel: any;
        description: any;
        status: any;
        created_at: any;
        updatedAt: any;
        channel: {
            id: any;
            owner_id: any;
            key: any;
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
            username: any;
            last_message_time: {
                day: number;
                month: string;
                year: number;
                time: string;
            };
            message_time: any;
            client_info: {
                id: any;
                name: string;
                phone: any;
            };
            created_at: string;
        };
    }[];
    messageTransformer(item: any): {
        id: any;
        content: any;
        channel_id: any;
        key: any;
        type: any;
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
        content: any;
        channel_id: any;
        key: any;
        type: any;
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
    private memberTransform;
    memberCollection(items: any[]): {
        role: any;
        client_id: any;
        user_key: any;
        name: string;
        avatar: string;
    }[];
    private calculCreatedAt;
}
