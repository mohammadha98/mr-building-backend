import ITransformer from "src/commons/contracts/ITransformer";
export default class RealEstateAdsTransformer implements ITransformer<any> {
    transform: (item: any) => void;
    collection: (items: any[]) => void;
    transformDetails(item: any): {
        id: any;
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
        owner_id: any;
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
        agent_valuation_request: any;
        price_status: any;
        price_rating: any;
        latitude: any;
        longitude: any;
        status: any;
        reasons: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        area: any;
        items: {
            id: any;
            item_id: any;
            field_type: any;
            field_name: any;
            value: any;
            icon: string;
            sort_number: any;
        }[];
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        }[];
        owner_info: any;
        created_at: any;
    };
    categoryInfo(item: any): {
        id: any;
        title: any;
        type: any;
    };
    collectionDetails(items: any[]): {
        id: any;
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
        owner_id: any;
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
        agent_valuation_request: any;
        price_status: any;
        price_rating: any;
        latitude: any;
        longitude: any;
        status: any;
        reasons: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        area: any;
        items: {
            id: any;
            item_id: any;
            field_type: any;
            field_name: any;
            value: any;
            icon: string;
            sort_number: any;
        }[];
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        }[];
        owner_info: any;
        created_at: any;
    }[];
    private getOwnerId;
    transformAdList(item: any): {
        id: any;
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
        status: any;
        reasons: any;
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        number_of_rooms: any;
        max_capicity: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        area: any;
        seller_type: any;
        owner_info: any;
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        };
        created_at: any;
    };
    collectionAdList(items: any[]): {
        id: any;
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
        status: any;
        reasons: any;
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        number_of_rooms: any;
        max_capicity: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        area: any;
        seller_type: any;
        owner_info: any;
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        };
        created_at: any;
    }[];
    transformSettingItem(item: any): {
        id: any;
        field_name: any;
        type: any;
        field_type: any;
        values: any;
        sort_number: any;
    };
    collectionSettingItems(items: any[]): {
        id: any;
        field_name: any;
        type: any;
        field_type: any;
        values: any;
        sort_number: any;
    }[];
    cityInfo(item: any): {
        id: any;
        name: any;
    };
    transformFile(item: any, destination: string): {
        id: any;
        file_name: any;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
    };
    collectionFile(items: any[], destination: string): {
        id: any;
        file_name: any;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
    }[];
    transformAdItem(item: any): {
        id: any;
        item_id: any;
        field_type: any;
        field_name: any;
        value: any;
        icon: string;
        sort_number: any;
    };
    collectionAdItems(items: any[]): {
        id: any;
        item_id: any;
        field_type: any;
        field_name: any;
        value: any;
        icon: string;
        sort_number: any;
    }[];
    assortmentTransform(item: any): {
        id: any;
        title: any;
        type: any;
        status: any;
        items: any;
    };
    assortmentCollection(items: any[]): {
        id: any;
        title: any;
        type: any;
        status: any;
        items: any;
    }[];
    private calculCreatedAt;
}
