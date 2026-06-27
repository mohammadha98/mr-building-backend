import { Storefront } from "@prisma/client";
import { StorefrontService } from "../../../marketplace-storefront/app/storefront.service";
import { MarketplaceCategoriesService } from "../../../marketplace-categories/marketplace-categories.service";
import { MarketplaceBrandsService } from "../../../marketplace-brands/marketplace-brands.service";
import { SliderService } from "../../../slider/slider.service";
import { PaginationDto } from "src/commons/dto/pagination.dto";
import { GetProductsInMarketplaceDto } from "../dto/get-products.dto";
import { GetBrands } from "../dto/brands.dto";
import { FilterProductsDto } from "../dto/filter-products.dto";
import { MarketplaceHomePageDto } from "../dto/marketplace-home-page.dto";
export declare class MarketplaceFactory {
    private readonly storefrontService;
    private readonly categoriesService;
    private readonly brandsService;
    private readonly sliderService;
    constructor(storefrontService: StorefrontService, categoriesService: MarketplaceCategoriesService, brandsService: MarketplaceBrandsService, sliderService: SliderService);
    checkExistStorefront(clientId: number): Promise<Partial<Storefront> | null>;
    findCategories(pagination: PaginationDto): Promise<{
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
    }>;
    findBrands(query: GetBrands): Promise<{
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
    }>;
    getBrandDetails(brandId: string): Promise<{
        id: any;
        title: any;
        second_title: any;
        description: any;
        color: any;
        score: any;
        total_score: any;
        status: any;
        thumbnail: string;
    }>;
    findSliders(): Promise<{
        id: any;
        title: any;
        thumbnail: string;
    }[]>;
    findTopSales(query: MarketplaceHomePageDto): Promise<{
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
    }[]>;
    getProducts(query: GetProductsInMarketplaceDto): Promise<{
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
    }>;
    filteredProducts(query: FilterProductsDto): Promise<{
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
    }>;
    getProductDetails(product_id: string): Promise<{
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
    }>;
    findTopStorefronts(query: MarketplaceHomePageDto): Promise<{
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
    }[]>;
}
