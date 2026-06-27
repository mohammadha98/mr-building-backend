import { UpdateRealEstateAdsFormsDto } from "./dto/update-real-estate-ads-forms.dto";
import RealEstateAdsFormsPostgresqlRepository from "../repositories/RealEstateAdsFormsPostgresqlRepository";
import { GetRealEstateAdFormsItemsDto } from "./dto/get-real-estate-ads-forms.dto";
import { CreateRealEstateAdFormsItemsDto } from "./dto/create-real-estate-ads-form-item.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UpdateSortItemsRealEstateAdsFormsDto } from "./dto/update-sort-items-real-estate-ads-forms.dto";
import { CreateRealEstateAdFormsDto } from "./dto/create-real-estate-ads-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { UpdateRealEstateAdFormsItemsDto } from "./dto/update-real-estate-ads-form-item.dto";
export declare class RealEstateAdsFormsService {
    private readonly realEstateAdsFormsPostgresqlRepository;
    private readonly prismaService;
    constructor(realEstateAdsFormsPostgresqlRepository: RealEstateAdsFormsPostgresqlRepository, prismaService: PrismaService);
    createNewForm(body: CreateRealEstateAdFormsDto): Promise<{
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
    saveItem(body: CreateRealEstateAdFormsItemsDto): Promise<{
        status: number;
        result: {
            id: string;
            field_name: string;
            field_type: string;
            values: string[];
            icon: string;
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
    findItems(query: GetRealEstateAdFormsItemsDto): Promise<{
        status: number;
        result: any[];
    } | {
        status: number;
        result?: undefined;
    }>;
    findItemsForApp(query: GetRealEstateAdFormsItemsDto): Promise<any[]>;
    findOne(id: number): Promise<string>;
    updateForm(body: UpdateRealEstateAdsFormsDto): Promise<{
        status: number;
    }>;
    updateItem(body: UpdateRealEstateAdFormsItemsDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: string;
            field_name: string;
            field_type: string;
            values: any;
            icon: string;
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
    updateDraggableItems(body: UpdateSortItemsRealEstateAdsFormsDto): Promise<{
        status: number;
    }>;
    removeFileFromStorage(file_name: string, destination: string): Promise<boolean>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
