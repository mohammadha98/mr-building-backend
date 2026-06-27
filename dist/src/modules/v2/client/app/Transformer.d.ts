export default class ClientTransformer {
    constructor();
    transform(client: any): {
        id: any;
        provider_id: any;
        name: any;
        surname: any;
        phone: any;
        user_name: any;
        email: any;
        has_update: any;
        avatar: string;
        token: any;
        user_key: any;
        referral_code: any;
        province: {};
        city: {};
    };
    clientProfileTransformer(result: any): {
        client_info: {
            id: any;
            provider_id: any;
            name: any;
            surname: any;
            phone: any;
            user_name: any;
            email: any;
            has_update: any;
            avatar: string;
            token: any;
            user_key: any;
            referral_code: any;
            province: {};
            city: {};
        };
    };
    gifTransformer(item: any): {
        id: any;
        file: string;
    };
    gifCollection(items: any[]): {
        id: any;
        file: string;
    }[];
    getProvinceInfo(item: any): {
        id: any;
        name: any;
    };
}
