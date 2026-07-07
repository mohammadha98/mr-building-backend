import ITransformer from "src/commons/contracts/ITransformer";
export default class RealEstateAdsTransformer implements ITransformer<any> {
    transform: (item: any) => void;
    collection: (items: any[]) => void;
    transformDetails(item: any): {
        id: any;
        tag: any;
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
        display_contact: any;
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
        is_timed: any;
        expired_at: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        area: any;
        items: any;
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: string;
        }[];
        owner_info: any;
        created_at: any;
        created_time: any;
    };
    categoryInfo(item: any): {
        id: any;
        title: any;
        type: any;
    };
    collectionDetails(items: any[]): {
        id: any;
        tag: any;
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
        display_contact: any;
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
        is_timed: any;
        expired_at: any;
        province: {
            id: any;
            name: any;
        };
        city: {
            id: any;
            name: any;
        };
        area: any;
        items: any;
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: string;
        }[];
        owner_info: any;
        created_at: any;
        created_time: any;
    }[];
    private getOwnerId;
    transformAdList(item: any): {
        id: any;
        tag: any;
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
        normal_days_price: any;
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
        created_at: any;
        createdAt: any;
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: string;
        };
    };
    collectionAdList(items: any[]): {
        id: any;
        tag: any;
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
        normal_days_price: any;
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
        created_at: any;
        createdAt: any;
        media: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
            thumbnail: string;
        };
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
    transformFile(item: any, destination: string, tag: string): {
        id: any;
        file_name: any;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
        thumbnail: string;
    };
    collectionFile(items: any[], destination: string, tag: string): {
        id: any;
        file_name: any;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
        thumbnail: string;
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
    collectionAdItems(list: any): any;
    transformRobotAdItem(item: any, index: number): {
        id: any;
        item_id: any;
        field_type: string;
        field_name: any;
        value: any;
        icon: string;
        sort_number: number;
    };
    collectionRobotAdItems(list: any): any;
    private calculCreatedAt;
    assortmentTransform(item: any): {
        id: any;
        title: any;
        type: any;
        sub_categories: {
            id: any;
            title: any;
            form_items: ({
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
        }[];
    };
    assortmentCollection(items: any[]): {
        id: any;
        title: any;
        type: any;
        sub_categories: {
            id: any;
            title: any;
            form_items: ({
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
        }[];
    }[];
    subCategoryTransform(item: any): {
        id: any;
        title: any;
        form_items: ({
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
    };
    subCategoryCollection(items: any[]): {
        id: any;
        title: any;
        form_items: ({
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
    transformNotificationSettings(item: any): {
        id: any;
        title: any;
        smsNotification: any;
        whatsappNotification: any;
        expired_at: {
            day: number;
            month: string;
            year: number;
        };
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        year_built: any;
        size: any;
        provinceId: any;
        cityId: any;
        categoryId: any;
    };
    collectionNotificationSettings(items: any[]): {
        id: any;
        title: any;
        smsNotification: any;
        whatsappNotification: any;
        expired_at: {
            day: number;
            month: string;
            year: number;
        };
        sale_price: any;
        deposit_price: any;
        rent_price: any;
        year_built: any;
        size: any;
        provinceId: any;
        cityId: any;
        categoryId: any;
    }[];
}
