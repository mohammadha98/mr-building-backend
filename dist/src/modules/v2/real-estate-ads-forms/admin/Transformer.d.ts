import ITransformer from "src/commons/contracts/ITransformer";
export default class RealEstateAdFormsTransformer implements ITransformer<any> {
    transformItem(item: any): {
        id: any;
        field_name: any;
        type: any;
        is_active: any;
        required: any;
        field_type: any;
        values: any;
        sort_number: any;
        status: any;
        icon: string;
        key: any;
    };
    collectionItem(items: any[]): {
        id: any;
        field_name: any;
        type: any;
        is_active: any;
        required: any;
        field_type: any;
        values: any;
        sort_number: any;
        status: any;
        icon: string;
        key: any;
    }[];
    transform(item: any): {
        id: any;
        title: any;
        description: any;
    };
    collection(items: any[]): {
        id: any;
        title: any;
        description: any;
    }[];
}
