import ITransformer from "src/commons/contracts/ITransformer";
export default class ReferralCodeTransformer implements ITransformer<any> {
    constructor();
    transform({ total, point }: {
        total: any;
        point: any;
    }): {
        total: {
            client: any;
            estate_agent: any;
            advisor: any;
            admin: any;
            operator_estate_agent: any;
        };
        point: any;
    };
    collection(items: any[]): {
        total: {
            client: any;
            estate_agent: any;
            advisor: any;
            admin: any;
            operator_estate_agent: any;
        };
        point: any;
    }[];
    userTransform(item: any, point: number): {
        client_id: any;
        client_name: any;
        client_phone: any;
        client_roles: any;
        referral_id: any;
        referral_code: any;
        number_of_sub_categories: any;
        point: number;
    };
    userCollection(items: any[], point: number): {
        client_id: any;
        client_name: any;
        client_phone: any;
        client_roles: any;
        referral_id: any;
        referral_code: any;
        number_of_sub_categories: any;
        point: number;
    }[];
}
