import ITransformer from "src/commons/contracts/ITransformer";
export default class RealEstateAgentsCommentsTransformer implements ITransformer<any> {
    transform(item: any): {
        id: number;
        agent_id: number;
        comment: string;
        score: number;
        client: {};
        created_at: string;
        status?: undefined;
        real_estate_agent?: undefined;
    } | {
        id: any;
        agent_id: any;
        comment: any;
        score: any;
        status: any;
        client: {
            id: any;
            name: string;
        };
        real_estate_agent: {
            id: any;
            name: any;
            avatar: string;
        };
        created_at: string;
    };
    collection(items: any[]): ({
        id: number;
        agent_id: number;
        comment: string;
        score: number;
        client: {};
        created_at: string;
        status?: undefined;
        real_estate_agent?: undefined;
    } | {
        id: any;
        agent_id: any;
        comment: any;
        score: any;
        status: any;
        client: {
            id: any;
            name: string;
        };
        real_estate_agent: {
            id: any;
            name: any;
            avatar: string;
        };
        created_at: string;
    })[];
    private clientInfo;
    private realEstateAgentInfo;
    private calculCreatedAt;
}
