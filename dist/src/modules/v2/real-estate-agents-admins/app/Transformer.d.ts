export default class RealEstateAdminsTransformer {
    transform(item: any): {
        permissions: any;
        agent_id: any;
        agent_name: any;
        agent_number_of_ads: any;
        agent_score: any;
        agent_avatar: string;
        province: any;
        color: any;
        name: string;
        phone: any;
        id: any;
    };
    collection(items: any[]): {
        permissions: any;
        agent_id: any;
        agent_name: any;
        agent_number_of_ads: any;
        agent_score: any;
        agent_avatar: string;
        province: any;
        color: any;
        name: string;
        phone: any;
        id: any;
    }[];
    private clientInfo;
    private agentInfo;
}
