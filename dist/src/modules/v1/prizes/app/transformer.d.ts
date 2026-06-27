import ITransformer from "src/commons/contracts/ITransformer";
export default class PrizesTransformer implements ITransformer<any> {
    constructor();
    transform(item: any): {
        id: any;
        title: any;
        description: any;
        point: any;
        coupon: any;
        url: any;
        thumbnail: string;
    };
    collection(items: any[]): {
        id: any;
        title: any;
        description: any;
        point: any;
        coupon: any;
        url: any;
        thumbnail: string;
    }[];
    missionTransform(item: any): {
        id: any;
        key: any;
        title: any;
        description: any;
        point: any;
        mission_done: any;
        is_limited: any;
        number_of_hours: any;
        is_permitted: any;
        last_used_at: any;
    };
    missionCollection(items: any[]): {
        id: any;
        key: any;
        title: any;
        description: any;
        point: any;
        mission_done: any;
        is_limited: any;
        number_of_hours: any;
        is_permitted: any;
        last_used_at: any;
    }[];
    historyOfScorTransform(item: any): {
        id: any;
        title: any;
        score: any;
        action: any;
    };
    historyOfScorCollection(items: any[]): {
        id: any;
        title: any;
        score: any;
        action: any;
    }[];
}
