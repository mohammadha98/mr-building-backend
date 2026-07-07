import ITransformer from "src/commons/contracts/ITransformer";
export default class PrizesTransformer implements ITransformer<any> {
    constructor();
    transform(item: any): {
        id: any;
        title: any;
        description: any;
        point: any;
        thumbnail: string;
        coupons: any;
        url: any;
        status: any;
        created_at: any;
    };
    collection(items: any[]): {
        id: any;
        title: any;
        description: any;
        point: any;
        thumbnail: string;
        coupons: any;
        url: any;
        status: any;
        created_at: any;
    }[];
}
