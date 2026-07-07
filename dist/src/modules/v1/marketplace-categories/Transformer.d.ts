import ITransformer from "src/commons/contracts/ITransformer";
export default class MarketplaceCategoriesTransformer implements ITransformer<any> {
    transform(item: any): {
        id: any;
        title: any;
        thumbnail: string;
        sub_categories: any[];
    };
    collection(items: any[]): {
        id: any;
        title: any;
        thumbnail: string;
        sub_categories: any[];
    }[];
}
