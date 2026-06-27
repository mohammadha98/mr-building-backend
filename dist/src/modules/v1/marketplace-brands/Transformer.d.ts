import ITransformer from "src/commons/contracts/ITransformer";
export default class MarketplaceBrandsTransformer implements ITransformer<any> {
    transform(item: any): {
        id: any;
        title: any;
        second_title: any;
        description: any;
        color: any;
        score: any;
        total_score: any;
        status: any;
        thumbnail: string;
    };
    collection(items: any[]): {
        id: any;
        title: any;
        second_title: any;
        description: any;
        color: any;
        score: any;
        total_score: any;
        status: any;
        thumbnail: string;
    }[];
}
