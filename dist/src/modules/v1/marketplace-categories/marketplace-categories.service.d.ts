import { CreateMarketplaceCategoryDto } from "./dto/create-marketplace-category.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { PrismaService } from "src/../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import UploadService from "src/modules/services/UploadService";
import { UpdateMarketplaceSubCategoryDto } from "./dto/update-sub-category-dto";
import MarketplaceCategoriesTransformer from "./Transformer";
import { PaginationDto as Pagination } from "src/commons/dto/pagination.dto";
export declare class MarketplaceCategoriesService {
    private readonly prismaService;
    private readonly uploadService;
    private readonly categoriesTransformer;
    constructor(prismaService: PrismaService, uploadService: UploadService, categoriesTransformer: MarketplaceCategoriesTransformer);
    saveCategory(body: CreateMarketplaceCategoryDto): Promise<{
        status: number;
    }>;
    getCategories(body: PaginationDto): Promise<{
        status: number;
        result: {
            id: string;
            title: string;
            thumbnail: string;
            items: {
                id: string;
                title: string;
                form: {
                    items: (import("@prisma/client/runtime").GetResult<{
                        id: string;
                        field_name: string;
                        is_active: boolean;
                        required: boolean;
                        field_type: string;
                        values: string[];
                        sort_number: number;
                        status: string;
                        key: string;
                        formId: string;
                    }, unknown, never> & {})[];
                };
            }[];
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    findActives(pagination: Pagination, params: any): Promise<{
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
    deleteMainCategory(item_id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            number_of_sales: number;
            title: string;
            thumbnail: string;
            status: string;
            userID: number;
            createdAt: Date;
        }, unknown, never> & {};
    }>;
    deleteSubCategory(item_id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            number_of_sales: number;
            title: string;
            categoryId: string;
            formId: string;
        }, unknown, never> & {};
    }>;
    updateSubCategory(body: UpdateMarketplaceSubCategoryDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            number_of_sales: number;
            title: string;
            categoryId: string;
            formId: string;
        }, unknown, never> & {};
    }>;
    getCategoriesForApp(): Promise<{
        id: string;
        title: string;
        thumbnail: string;
        items: {
            id: string;
            title: string;
            form: {
                id: string;
                title: string;
                items: (import("@prisma/client/runtime").GetResult<{
                    id: string;
                    field_name: string;
                    is_active: boolean;
                    required: boolean;
                    field_type: string;
                    values: string[];
                    sort_number: number;
                    status: string;
                    key: string;
                    formId: string;
                }, unknown, never> & {})[];
            };
        }[];
    }[]>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
