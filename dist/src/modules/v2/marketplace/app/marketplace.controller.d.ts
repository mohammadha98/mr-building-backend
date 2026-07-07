import { MarketplaceService } from "./marketplace.service";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import { GetProductsInMarketplaceDto } from "./dto/get-products.dto";
import { GetBrands } from "./dto/brands.dto";
import { FilterProductsDto } from "./dto/filter-products.dto";
import { MarketplaceHomePageDto } from "./dto/marketplace-home-page.dto";
export declare class MarketplaceAppController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    getHomePage(query: MarketplaceHomePageDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            is_seller: boolean;
            storefront: Partial<import("@prisma/client/runtime").GetResult<{
                id: string;
                trackingCode: string;
                name: string;
                description: string;
                color: string;
                phone: string;
                validate_phone: boolean;
                avatar: string;
                avatar_thumbnail: string;
                license: string;
                license_status: string;
                status: string;
                score: number;
                total_score: number;
                number_of_products: number;
                number_of_sales: number;
                latitude: number;
                longitude: number;
                created_at: Date;
                approved_at: Date;
                rejected_at: Date;
                client_id: number;
                province_id: number;
                city_id: number;
                categoryId: string;
            }, unknown, never> & {}>;
            sliders: {
                id: any;
                title: any;
                thumbnail: string;
            }[];
            categories: {
                id: any;
                title: any;
                thumbnail: string;
                sub_categories: any[];
            }[];
            brands: {
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
            top_products: {
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
            top_storefronts: {
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
        };
    }>;
    getBrands(query: GetBrands): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            brands: {
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
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    getBrandDetails(brandId: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
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
    }>;
    getCategories(pagination: PaginationDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            categories: {
                id: any;
                title: any;
                thumbnail: string;
                sub_categories: any[];
            }[];
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    getProducts(query: GetProductsInMarketplaceDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            products: {
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
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    filteredProducts(body: FilterProductsDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            products: {
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
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    getProductInfo(product_id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            product: {
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
            comments: any[];
        };
    }>;
}
