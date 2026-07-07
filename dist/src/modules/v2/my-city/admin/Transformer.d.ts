import ITransformer from "src/commons/contracts/ITransformer";
export default class MyCityTransformer implements ITransformer<any> {
    transform(item: any): {
        id: any;
        client: {
            id: any;
            name: any;
            surname: any;
            phone: any;
        };
        category: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        title: any;
        latitude: any;
        longitude: any;
        status: any;
    };
    collection(items: any[]): {
        id: any;
        client: {
            id: any;
            name: any;
            surname: any;
            phone: any;
        };
        category: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        title: any;
        latitude: any;
        longitude: any;
        status: any;
    }[];
    localtionDetails(item: any): {
        id: any;
        client: {
            id: any;
            name: any;
            surname: any;
            phone: any;
        };
        category: any;
        title: any;
        description: any;
        size: any;
        number_of_rooms: any;
        renovation_tax: any;
        latitude: any;
        longitude: any;
        status: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        files: {
            id: any;
            file_name: any;
            tag: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: string;
        }[];
    };
    cityInfo(item: any): {
        id: any;
        name: any;
    };
    clientIfo(item: any): {
        id: any;
        name: any;
        surname: any;
        phone: any;
    };
    transformFile(item: any): {
        id: any;
        file_name: any;
        tag: any;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
        thumbnail: string;
    };
    collectionFile(items: any[]): {
        id: any;
        file_name: any;
        tag: any;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
        thumbnail: string;
    }[];
}
