import { Storefront, StorefrontProducts } from "@prisma/client";
export default class StorefrontAppTransformer {
    transform(item: Partial<Storefront> | any): {
        id: any;
        tracking_code: any;
        client_id: any;
        name: any;
        description: any;
        has_adoptive: boolean;
        color: any;
        avatar: string;
        avatar_thumbnail: string;
        license: string;
        license_status: any;
        status: any;
        number_of_products: any;
        province: any;
        city: any;
        category_id: any;
        top_products: any[];
    };
    collection(items: any[]): {
        id: any;
        tracking_code: any;
        client_id: any;
        name: any;
        description: any;
        has_adoptive: boolean;
        color: any;
        avatar: string;
        avatar_thumbnail: string;
        license: string;
        license_status: any;
        status: any;
        number_of_products: any;
        province: any;
        city: any;
        category_id: any;
        top_products: any[];
    }[];
    transformTopStore(item: Partial<Storefront> | any): {
        id: any;
        tracking_code: any;
        has_adoptive: boolean;
        color: any;
        client_id: any;
        name: any;
        description: any;
        score: any;
        avatar: string;
        avatar_thumbnail: string;
        status: any;
        number_of_products: any;
        province: any;
        city: any;
        top_products: any[];
    };
    collectionTopStores(items: any[]): {
        id: any;
        tracking_code: any;
        has_adoptive: boolean;
        color: any;
        client_id: any;
        name: any;
        description: any;
        score: any;
        avatar: string;
        avatar_thumbnail: string;
        status: any;
        number_of_products: any;
        province: any;
        city: any;
        top_products: any[];
    }[];
    transformProduct(item: Partial<Storefront> | any): {
        id: any;
        storefront: {
            id: any;
            tracking_code: any;
            client_id: any;
            name: any;
            description: any;
            has_adoptive: boolean;
            color: any;
            avatar: string;
            avatar_thumbnail: string;
            license: string;
            license_status: any;
            status: any;
            number_of_products: any;
            province: any;
            city: any;
            category_id: any;
            top_products: any[];
        };
        category: any;
        sub_category: any;
        brand: any;
        tracking_code: any;
        title: any;
        score: any;
        description: any;
        status: any;
        price: any;
        unit_of_sales: any;
        has_discount: any;
        discounted_price: any;
        colors: any;
        updated_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        files: ({
            id: number;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: number;
            priority: any;
            thumbnail?: undefined;
        } | {
            id: any;
            thumbnail: string;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        })[];
    };
    collectionProduct(items: any[]): {
        id: any;
        storefront: {
            id: any;
            tracking_code: any;
            client_id: any;
            name: any;
            description: any;
            has_adoptive: boolean;
            color: any;
            avatar: string;
            avatar_thumbnail: string;
            license: string;
            license_status: any;
            status: any;
            number_of_products: any;
            province: any;
            city: any;
            category_id: any;
            top_products: any[];
        };
        category: any;
        sub_category: any;
        brand: any;
        tracking_code: any;
        title: any;
        score: any;
        description: any;
        status: any;
        price: any;
        unit_of_sales: any;
        has_discount: any;
        discounted_price: any;
        colors: any;
        updated_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        files: ({
            id: number;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: number;
            priority: any;
            thumbnail?: undefined;
        } | {
            id: any;
            thumbnail: string;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        })[];
    }[];
    transformComments(item: any): {
        id: number;
        store_id: number;
        comment: string;
        score: number;
        client: {};
        created_at: string;
    } | {
        id: any;
        store_id: any;
        comment: any;
        score: any;
        client: {
            id: any;
            name: string;
        };
        created_at: string;
    };
    collectionComments(items: any[]): ({
        id: number;
        store_id: number;
        comment: string;
        score: number;
        client: {};
        created_at: string;
    } | {
        id: any;
        store_id: any;
        comment: any;
        score: any;
        client: {
            id: any;
            name: string;
        };
        created_at: string;
    })[];
    private clientInfo;
    private calculCreatedAt;
    transformFile(item: any): {
        id: number;
        file_name: string;
        file_type: any;
        file_url: string;
        sort_number: number;
        priority: any;
        thumbnail?: undefined;
    } | {
        id: any;
        thumbnail: string;
        file_name: string;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
    };
    collectionFile(items: any[]): ({
        id: number;
        file_name: string;
        file_type: any;
        file_url: string;
        sort_number: number;
        priority: any;
        thumbnail?: undefined;
    } | {
        id: any;
        thumbnail: string;
        file_name: string;
        file_type: any;
        file_url: string;
        sort_number: any;
        priority: any;
    })[];
    transformDetails(item: Partial<StorefrontProducts> | any): {
        id: any;
        storefront: {
            id: any;
            tracking_code: any;
            client_id: any;
            name: any;
            description: any;
            has_adoptive: boolean;
            color: any;
            avatar: string;
            avatar_thumbnail: string;
            license: string;
            license_status: any;
            status: any;
            number_of_products: any;
            province: any;
            city: any;
            category_id: any;
            top_products: any[];
        };
        category: any;
        sub_category: any;
        brand: any;
        tracking_code: any;
        title: any;
        has_adoptive: boolean;
        color: any;
        score: any;
        description: any;
        status: any;
        price: any;
        unit_of_sales: any;
        has_discount: any;
        discounted_price: any;
        colors: any;
        updated_at: {
            day: number;
            month: string;
            year: number;
            time: string;
        };
        items: {
            id: any;
            field_id: any;
            field_name: any;
            value: any;
        }[];
        files: ({
            id: number;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: number;
            priority: any;
            thumbnail?: undefined;
        } | {
            id: any;
            thumbnail: string;
            file_name: string;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        })[];
    };
    transformFeatures(item: any): {
        id: any;
        field_id: any;
        field_name: any;
        value: any;
    };
    collectionFeatures(items: any[]): {
        id: any;
        field_id: any;
        field_name: any;
        value: any;
    }[];
    collectionTopProductFile(items: any[], destination: string): {
        product_id: any;
        file: string;
    }[];
}
