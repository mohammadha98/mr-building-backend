export default class ChannelTransformer {
    transform(item: any): {
        agent_id: any;
        name: any;
        profile: string;
        id: any;
        key: any;
        tag: any;
        number_of_members: any;
    };
    collection(items: any[]): {
        agent_id: any;
        name: any;
        profile: string;
        id: any;
        key: any;
        tag: any;
        number_of_members: any;
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
        created_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
    }[];
}
