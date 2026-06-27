import ITransformer from "src/commons/contracts/ITransformer";
export default class BookmarkCityTransformer implements ITransformer<any> {
    transform(item: any): {
        id: any;
        location_info: {
            id: any;
            title: any;
            latitude: any;
            longitude: any;
            category: any;
            province: {
                id: any;
                name: any;
            };
            city: {
                id: any;
                name: any;
            };
        };
    };
    collection(items: any[]): {
        id: any;
        location_info: {
            id: any;
            title: any;
            latitude: any;
            longitude: any;
            category: any;
            province: {
                id: any;
                name: any;
            };
            city: {
                id: any;
                name: any;
            };
        };
    }[];
    locationInfo(item: any): {
        id: any;
        title: any;
        latitude: any;
        longitude: any;
        category: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
    };
    cityInfo(item: any): {
        id: any;
        name: any;
    };
}
