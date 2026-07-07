export default class RealEstateAgentsTransformer {
    transform(item: any): {
        id: any;
        client_id: any;
        name: any;
        phone: any;
        validate_phone: any;
        avatar: string;
        license: string;
        license_status: any;
        status: any;
        score: any;
        number_of_ads: any;
        province: any;
        city: any;
        channel: any;
    };
    collection(items: any[]): {
        id: any;
        client_id: any;
        name: any;
        phone: any;
        validate_phone: any;
        avatar: string;
        license: string;
        license_status: any;
        status: any;
        score: any;
        number_of_ads: any;
        province: any;
        city: any;
        channel: any;
    }[];
    transformComments(item: any): {
        id: number;
        agent_id: number;
        comment: string;
        score: number;
        client: {};
        created_at: string;
    } | {
        id: any;
        agent_id: any;
        comment: any;
        score: any;
        client: {
            id: any;
            name: string;
        };
        created_at: string;
    };
    collectionComments(items: any[]): ({
        id: number;
        agent_id: number;
        comment: string;
        score: number;
        client: {};
        created_at: string;
    } | {
        id: any;
        agent_id: any;
        comment: any;
        score: any;
        client: {
            id: any;
            name: string;
        };
        created_at: string;
    })[];
    private clientInfo;
    private calculCreatedAt;
}
