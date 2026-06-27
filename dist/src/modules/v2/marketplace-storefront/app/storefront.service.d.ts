import { CreateStorefrontDto } from "./dto/create-storefront.dto";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { ListStorefrontDto } from "./dto/list-storefront.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import StorefrontPostgresqlRepository from "../repositories/StorefrontPostgresqlRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import UploadService from "src/modules/services/UploadService";
import { MarketplaceCategoriesService } from "../../marketplace-categories/marketplace-categories.service";
import { MarketplaceBrandsService } from "../../marketplace-brands/marketplace-brands.service";
import { UploadFileProductsDto } from "./dto/upload-file-products.dto";
import { DeleteRealEstateMediaItemDto } from "../../real-estate-ads/app/dto/delete-media-item.dto";
import { ChangeCoverMediaProductDto } from "./dto/change-cover-media-item.dto";
import { SaveProductDto } from "./dto/save-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductDto } from "./dto/get-product.dto";
import { ChangeStatusProductDto } from "./dto/change-status-product.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { Request } from "express";
import StorefrontTransformer from "./Transformer";
import MarketplaceCategoriesTransformer from "../../marketplace-categories/Transformer";
import MarketplaceBrandsTransformer from "../../marketplace-brands/Transformer";
import { PublicMessage } from "src/commons/enums/messages";
import { GetProductsInMarketplaceDto } from "../../marketplace/app/dto/get-products.dto";
import { FilterProductsDto } from "../../marketplace/app/dto/filter-products.dto";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import { HttpStatusCode } from "axios";
import { MarketplaceHomePageDto } from "../../marketplace/app/dto/marketplace-home-page.dto";
export declare class StorefrontService {
    private readonly request;
    private readonly prismaService;
    private readonly storefrontTransformer;
    private readonly storefrontPostgresRepository;
    private readonly marketplaceCategoriesService;
    private readonly marketplaceBrandsService;
    private readonly clientService;
    private readonly uploadService;
    private readonly mailerService;
    private readonly marketplaceCategoriesTransformer;
    private readonly marketplaceBrandsTransformer;
    private readonly notificationService;
    constructor(request: Request, prismaService: PrismaService, storefrontTransformer: StorefrontTransformer, storefrontPostgresRepository: StorefrontPostgresqlRepository, marketplaceCategoriesService: MarketplaceCategoriesService, marketplaceBrandsService: MarketplaceBrandsService, clientService: ClientService, uploadService: UploadService, mailerService: MailerService, marketplaceCategoriesTransformer: MarketplaceCategoriesTransformer, marketplaceBrandsTransformer: MarketplaceBrandsTransformer, notificationService: FcmNotificationService);
    SaveNewProduct(body: SaveProductDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            product_id: any;
        };
    }>;
    updateProduct(body: UpdateProductDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            product_id: string;
        };
    }>;
    findStorefrontProducts(body: GetProductDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            data: {
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
    changeStatusProduct(body: ChangeStatusProductDto): Promise<{
        statusCode: number;
        message: string;
        data: {};
    }>;
    deleteProduct(product_id: string): Promise<{
        statusCode: number;
        message: PublicMessage;
        data: {};
    }>;
    addStorefrontIntoBookmark(storefront_id: string): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {};
    }>;
    getBookmarkedList(): Promise<{
        statusCode: number;
        message: PublicMessage;
        data: {
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
    }>;
    storeRequest(body: CreateStorefrontDto): Promise<{
        statusCode: number;
        message: string;
        data: {
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
    }>;
    private generateTrackingCode;
    private moveFile;
    listOfStorefronts(query: ListStorefrontDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            data: {
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
            metadata: IMetadata;
        };
    }>;
    storefrontDetails(storeId: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getCategories(): Promise<{
        statusCode: number;
        message: string;
        data: {
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
            units: string[];
        };
    }>;
    getBrands(): Promise<{
        id: string;
        title: string;
        thumbnail: string;
        color: string;
        score: number;
        total_score: number;
    }[]>;
    findOne(id: string): Promise<any>;
    findByClientId(client_id: number): Promise<{
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
    }>;
    updateScore(where: any, data: any): Promise<any>;
    private generateThumbnailForVideo;
    private generateThumbnailForImage;
    UploadFile(body: UploadFileProductsDto): Promise<{
        statusCode: number;
        message: string;
        data: {
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
    }>;
    removeFile(query: DeleteRealEstateMediaItemDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    changeCover(body: ChangeCoverMediaProductDto): Promise<{
        statusCode: number;
        message: PublicMessage;
    }>;
    private getUserPermittedAds;
    sendEmailForAdmins(): Promise<void>;
    findTopSales(query: MarketplaceHomePageDto, page: number, per_page: number): Promise<{
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
    findTopStorefronts(query: MarketplaceHomePageDto, page: number, per_page: number): Promise<{
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
    private makeMetadata;
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
    }>;
    private makePagination;
    private getTotalPageNumber;
}
