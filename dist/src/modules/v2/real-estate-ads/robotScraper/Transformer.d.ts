import ITransformer from "src/commons/contracts/ITransformer";
export default class RealEstateAdsTransformer implements ITransformer<any> {
    transform: (item: any) => void;
    collection: (items: any[]) => void;
    transformDetails(item: any): {
        id: any;
        tag: string;
        category: {
            id: any;
            title: any;
            type: any;
        };
        sub_category: {
            id: any;
            title: any;
            type: any;
        };
        tracking_code: any;
        seller_type: any;
        is_applicant: any;
        display_contact: boolean;
        agent_valuation_request: boolean;
        owner_id: number;
        title: any;
        description: any;
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        number_of_rooms: any;
        max_capicity: any;
        size: any;
        year_built: any;
        normal_days_price: any;
        weekend_price: any;
        special_days_price: any;
        cost_per_additional_person: any;
        extra_people: any;
        price_status: any;
        price_rating: any;
        latitude: any;
        longitude: any;
        status: any;
        province: {
            id: number;
            name: any;
        };
        city: {
            id: number;
            name: any;
        };
        area: any;
        items: any;
        media: {
            id: any;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: any;
        }[];
        owner_info: {
            name: string;
            phone: string;
            avatar: string;
        };
        created_at: any;
        created_time: any;
    };
    categoryInfo(item: any): {
        id: any;
        title: any;
        type: any;
    };
    getOwnerInfo(owner_name: string, owner_phone: string): {
        name: string;
        phone: string;
        avatar: string;
    };
    collectionDetails(items: any[]): {
        id: any;
        tag: string;
        category: {
            id: any;
            title: any;
            type: any;
        };
        sub_category: {
            id: any;
            title: any;
            type: any;
        };
        tracking_code: any;
        seller_type: any;
        is_applicant: any;
        display_contact: boolean;
        agent_valuation_request: boolean;
        owner_id: number;
        title: any;
        description: any;
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        number_of_rooms: any;
        max_capicity: any;
        size: any;
        year_built: any;
        normal_days_price: any;
        weekend_price: any;
        special_days_price: any;
        cost_per_additional_person: any;
        extra_people: any;
        price_status: any;
        price_rating: any;
        latitude: any;
        longitude: any;
        status: any;
        province: {
            id: number;
            name: any;
        };
        city: {
            id: number;
            name: any;
        };
        area: any;
        items: any;
        media: {
            id: any;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: any;
        }[];
        owner_info: {
            name: string;
            phone: string;
            avatar: string;
        };
        created_at: any;
        created_time: any;
    }[];
    private getOwnerId;
    transformAdList(item: any): {
        id: any;
        tag: string;
        tracking_code: any;
        category: {
            id: any;
            title: any;
            type: any;
        };
        sub_category: {
            id: any;
            title: any;
            type: any;
        };
        title: any;
        is_applicant: any;
        agent_valuation_request: boolean;
        status: any;
        reasons: any;
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        number_of_rooms: any;
        max_capicity: any;
        normal_days_price: any;
        province: {
            id: number;
            name: any;
        };
        city: {
            id: number;
            name: any;
        };
        area: any;
        seller_type: any;
        owner_info: {
            name: string;
            phone: string;
            avatar: string;
        };
        created_at: any;
        createdAt: any;
        media: {
            id: any;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: any;
        };
    };
    collectionAdList(items: any[]): {
        id: any;
        tag: string;
        tracking_code: any;
        category: {
            id: any;
            title: any;
            type: any;
        };
        sub_category: {
            id: any;
            title: any;
            type: any;
        };
        title: any;
        is_applicant: any;
        agent_valuation_request: boolean;
        status: any;
        reasons: any;
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        number_of_rooms: any;
        max_capicity: any;
        normal_days_price: any;
        province: {
            id: number;
            name: any;
        };
        city: {
            id: number;
            name: any;
        };
        area: any;
        seller_type: any;
        owner_info: {
            name: string;
            phone: string;
            avatar: string;
        };
        created_at: any;
        createdAt: any;
        media: {
            id: any;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: any;
        };
    }[];
    cityInfo(item: any): {
        id: number;
        name: any;
    };
    transformFile(item: any): {
        id: any;
        file_name: string;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
        thumbnail: any;
    };
    collectionFile(items: any[]): {
        id: any;
        file_name: string;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
        thumbnail: any;
    }[];
    transformAdItem(item: any): {
        id: string;
        item_id: string;
        field_type: string;
        field_name: any;
        value: any;
        icon: string;
        sort_number: string;
    };
    collectionAdItems(list: any): any;
    private calculCreatedAt;
    assortmentTransform(item: any): {
        id: any;
        title: any;
        type: any;
        sub_categories: {
            id: any;
            title: any;
        }[];
    };
    assortmentCollection(items: any[]): {
        id: any;
        title: any;
        type: any;
        sub_categories: {
            id: any;
            title: any;
        }[];
    }[];
    subCategoryTransform(item: any): {
        id: any;
        title: any;
    };
    subCategoryCollection(items: any[]): {
        id: any;
        title: any;
    }[];
    transformFormItem(item: any): {
        id?: undefined;
        field_name?: undefined;
        type?: undefined;
        field_type?: undefined;
        values?: undefined;
        sort_number?: undefined;
        status?: undefined;
        icon?: undefined;
        key?: undefined;
    } | {
        id: any;
        field_name: any;
        type: any;
        field_type: any;
        values: any;
        sort_number: any;
        status: any;
        icon: string;
        key: any;
    };
    collectionFormItem(items: any[]): ({
        id?: undefined;
        field_name?: undefined;
        type?: undefined;
        field_type?: undefined;
        values?: undefined;
        sort_number?: undefined;
        status?: undefined;
        icon?: undefined;
        key?: undefined;
    } | {
        id: any;
        field_name: any;
        type: any;
        field_type: any;
        values: any;
        sort_number: any;
        status: any;
        icon: string;
        key: any;
    })[];
}
