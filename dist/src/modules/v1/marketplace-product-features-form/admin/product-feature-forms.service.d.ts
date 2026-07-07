import { UpdateProductFeatureFormDto } from "./dto/update-product-feature-form.dto";
import MarketplaceProductFeatureFormsPostgresqlRepository from "../repositories/MarketplaceProductFeatureFormsPostgresqlRepository";
import { GetProductFeaturesDto } from "./dto/get-product-feature-forms.dto";
import { CreateProductFeatureDto } from "./dto/create-productfeature-form-item.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UpdateSortProductFeatureFormsDto } from "./dto/update-sort-product-feature-forms.dto";
import { createProductFeatureFormsDto } from "./dto/create-product-feature-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { UpdateProductFeatureDto } from "./dto/update-product-feature.dto";
export declare class ProductFeatureFormsService {
    private readonly featureFormsPostgresqlRepository;
    private readonly prismaService;
    constructor(featureFormsPostgresqlRepository: MarketplaceProductFeatureFormsPostgresqlRepository, prismaService: PrismaService);
    createNewForm(body: createProductFeatureFormsDto): Promise<{
        status: number;
        result: {
            id: string;
            title: string;
            description: string;
        };
    } | {
        status: number;
        result?: undefined;
    }>;
    saveItem(body: CreateProductFeatureDto): Promise<{
        status: number;
        result: {
            id: string;
            field_name: string;
            field_type: string;
            values: string[];
            key: string;
        };
    } | {
        status: number;
        result?: undefined;
    }>;
    findForms(query: PaginationDto): Promise<{
        status: number;
        result: any[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    findItems(query: GetProductFeaturesDto): Promise<{
        status: number;
        result: any[];
    } | {
        status: number;
        result?: undefined;
    }>;
    findItemsForApp(query: GetProductFeaturesDto): Promise<any[]>;
    updateForm(body: UpdateProductFeatureFormDto): Promise<{
        status: number;
    }>;
    updateItem(body: UpdateProductFeatureDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: string;
            field_name: string;
            field_type: string;
            values: any;
            is_active: any;
            required: any;
            sort_number: any;
            status: any;
            key: any;
        };
    }>;
    removeItem(item_id: string): Promise<{
        status: number;
    }>;
    removeForm(form_id: string): Promise<{
        status: number;
    }>;
    updateDraggableItems(body: UpdateSortProductFeatureFormsDto): Promise<{
        status: number;
    }>;
    removeFileFromStorage(file_name: string, destination: string): Promise<boolean>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
