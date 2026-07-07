import { CreateMarketplaceBrandsDto } from "./dto/create-marketplace-brands.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import UploadService from "src/modules/services/UploadService";
import MarketplaceBrandsTransformer from "./Transformer";
import { PaginationDto as Pagination } from "src/commons/dto/pagination.dto";
export declare class MarketplaceBrandsService {
    private readonly prismaService;
    private readonly uploadService;
    private readonly bandsTransformer;
    constructor(prismaService: PrismaService, uploadService: UploadService, bandsTransformer: MarketplaceBrandsTransformer);
    saveBrand(body: CreateMarketplaceBrandsDto): Promise<{
        status: number;
    }>;
    getBrands(body: PaginationDto): Promise<{
        status: number;
        result: {
            id: string;
            title: string;
            secondTitle: string;
            description: string;
            thumbnail: string;
            color: string;
            score: number;
            total_score: number;
            status: string;
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    findActives(pagination: Pagination, params: any, orderBy: any): Promise<{
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
    getDetails(brandId: string): Promise<{
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
    deleteBrand(item_id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            number_of_sales: number;
            title: string;
            color: string;
            score: number;
            total_score: number;
            secondTitle: string;
            description: string;
            thumbnail: string;
            status: string;
            userID: number;
            createdAt: Date;
        }, unknown, never> & {};
    }>;
    getBrandsForApp(): Promise<{
        id: string;
        title: string;
        thumbnail: string;
        color: string;
        score: number;
        total_score: number;
    }[]>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
