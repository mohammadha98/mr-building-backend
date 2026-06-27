import { Storefront } from "@prisma/client";
export default class StorefrontAdminTransformer {
    transform(item: Partial<Storefront> | any): {
        id: any;
        tracking_code: any;
        client_id: {
            id: any;
            name: string;
            phone: any;
        };
        name: any;
        description: any;
        color: any;
        avatar: string;
        license: string;
        license_status: any;
        status: any;
        score: any;
        number_of_products: any;
        province: any;
        city: any;
        created_at: string;
    };
    collection(items: any[]): {
        id: any;
        tracking_code: any;
        client_id: {
            id: any;
            name: string;
            phone: any;
        };
        name: any;
        description: any;
        color: any;
        avatar: string;
        license: string;
        license_status: any;
        status: any;
        score: any;
        number_of_products: any;
        province: any;
        city: any;
        created_at: string;
    }[];
    transformProduct(item: Partial<Storefront> | any): {
        id: any;
        category: any;
        sub_category: any;
        brand: any;
        tracking_code: any;
        title: any;
        description: any;
        status: any;
        price: any;
        unit_of_sales: any;
        has_discount: any;
        discounted_price: any;
        colors: any;
        files: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        }[];
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
    collectionProduct(items: any[]): {
        id: any;
        category: any;
        sub_category: any;
        brand: any;
        tracking_code: any;
        title: any;
        description: any;
        status: any;
        price: any;
        unit_of_sales: any;
        has_discount: any;
        discounted_price: any;
        colors: any;
        files: {
            id: any;
            file_name: any;
            file_type: any;
            file_url: string;
            sort_number: any;
            priority: any;
        }[];
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
            phone: any;
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
            phone: any;
        };
        created_at: string;
    })[];
    private clientInfo;
    private calculCreatedAt;
}
