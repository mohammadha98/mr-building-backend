import ITransformer from "src/commons/contracts/ITransformer";
import statuses from "src/commons/contracts/Statuses";
export default class RealEstateAgentsCommentsTransformer implements ITransformer<any> {
    transform(item: any): {
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
        };
        created_at: {
            day: number;
            month: string;
            year: number;
        };
    };
    collection(items: any[]): ({
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
        };
        created_at: {
            day: number;
            month: string;
            year: number;
        };
    })[];
    private clientInfo;
    private calculCreatedAt;
}
