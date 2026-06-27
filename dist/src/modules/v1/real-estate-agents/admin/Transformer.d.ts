export default class RealEstateAgentsTransformer {
    transform(item: any): {
        id: any;
        client_id: any;
        name: any;
        avatar: string;
        license: string;
        license_status: any;
        permissions: any;
        status: any;
        score: any;
        number_of_ads: any;
        province: any;
        city: any;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: any;
    };
    collection(items: any[]): {
        id: any;
        client_id: any;
        name: any;
        avatar: string;
        license: string;
        license_status: any;
        permissions: any;
        status: any;
        score: any;
        number_of_ads: any;
        province: any;
        city: any;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: any;
    }[];
    private clientInfo;
}
