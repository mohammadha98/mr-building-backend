import statuses from "src/commons/contracts/Statuses";
export default class RealEstateAdvisorTransformer {
    transform(item: any): {
        id: any;
        name: string;
        phone: any;
        validate_phone: any;
        avatar: string;
        score: any;
        biography: any;
        comment_visibility: any;
        number_of_ads: any;
        total_customer: any;
        permissions: any;
        status: any;
        agent_info: {
            id: any;
            name: any;
        };
    };
    collection(items: any[]): {
        id: any;
        name: string;
        phone: any;
        validate_phone: any;
        avatar: string;
        score: any;
        biography: any;
        comment_visibility: any;
        number_of_ads: any;
        total_customer: any;
        permissions: any;
        status: any;
        agent_info: {
            id: any;
            name: any;
        };
    }[];
    transformActiveArea(item: any): {
        id: any;
        title: any;
    };
    collectionActiveArea(items: any[]): {
        id: any;
        title: any;
    }[];
    collectionFilteredWord(items: any[]): {
        id: any;
        title: any;
    }[];
    transformerFilteredWord(item: any): {
        id: any;
        title: any;
    };
    transformComments(item: any): {
        id: number;
        agent_id: number;
        comment: string;
        score: number;
        status: statuses;
        client: {};
        created_at: {
            day: number;
            month: string;
            year: number;
        };
    } | {
        id: any;
        agent_id: any;
        comment: any;
        score: any;
        status: any;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: {
            day: number;
            month: string;
            year: number;
        };
    };
    collectionComments(items: any[]): ({
        id: number;
        agent_id: number;
        comment: string;
        score: number;
        status: statuses;
        client: {};
        created_at: {
            day: number;
            month: string;
            year: number;
        };
    } | {
        id: any;
        agent_id: any;
        comment: any;
        score: any;
        status: any;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: {
            day: number;
            month: string;
            year: number;
        };
    })[];
    private clientInfo;
    private getAgentInfo;
    private calculCreatedAt;
}
