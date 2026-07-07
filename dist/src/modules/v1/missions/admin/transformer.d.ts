import ITransformer from "src/commons/contracts/ITransformer";
export default class MissionsTransformer implements ITransformer<any> {
    constructor();
    transform(client: any): {
        id: any;
        title: any;
        description: any;
        key: any;
        point: any;
        status: any;
        created_at: any;
        is_limited: any;
        number_of_hours: any;
        number_of_used: any;
    };
    collection(items: any[]): {
        id: any;
        title: any;
        description: any;
        key: any;
        point: any;
        status: any;
        created_at: any;
        is_limited: any;
        number_of_hours: any;
        number_of_used: any;
    }[];
}
