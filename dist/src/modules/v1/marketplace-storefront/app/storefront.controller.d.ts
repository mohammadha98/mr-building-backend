/// <reference types="multer" />
import { StorefrontService } from "./storefront.service";
import { CreateStorefrontDto } from "./dto/create-storefront.dto";
import { ListStorefrontDto } from "./dto/list-storefront.dto";
import { DeleteMediaProductsDto } from "./dto/delete-media-item-products.dto";
import { UploadFileProductsDto } from "./dto/upload-file-products.dto";
import { ChangeCoverMediaProductDto } from "./dto/change-cover-media-item.dto";
import { SaveProductDto } from "./dto/save-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetProductDto } from "./dto/get-product.dto";
import { ChangeStatusProductDto } from "./dto/change-status-product.dto";
export declare class StorefrontController {
    private readonly storefrontService;
    constructor(storefrontService: StorefrontService);
    create(body: CreateStorefrontDto, files: {
        avatar?: Express.Multer.File;
        license?: Express.Multer.File;
    }): Promise<{
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
            metadata: import("../../../../commons/contracts/IMetadata").default;
        };
    }>;
    GetStorefrontInfo(store_id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getProperties(): Promise<{
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
    UploadTempFile(body: UploadFileProductsDto): Promise<{
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
    removeAdFile(query: DeleteMediaProductsDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    changeCover(body: ChangeCoverMediaProductDto): Promise<{
        statusCode: number;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
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
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {};
    }>;
    addStorefrontIntoBookmark(storefront_id: string): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {};
    }>;
    getBookmarkedList(): Promise<{
        statusCode: number;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
}
