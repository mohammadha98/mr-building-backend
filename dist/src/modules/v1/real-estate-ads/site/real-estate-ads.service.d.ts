import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { FilteredDto } from "./dto/filtered.dto";
import { HttpStatus } from "@nestjs/common";
import { Cache } from "cache-manager";
import RealEstateAdsTransformer from "./Transformer";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { Request } from "express";
import { PublicMessage } from "src/commons/enums/messages";
export declare class RealEstateAdsService {
    private cacheManager;
    private readonly request;
    private readonly realEstateAdsPostgresqlRepository;
    private readonly clientService;
    private readonly realEstateAdsTransformer;
    private readonly prismaService;
    private readonly mailerService;
    private readonly uploadService;
    constructor(cacheManager: Cache, request: Request, realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository, clientService: ClientService, realEstateAdsTransformer: RealEstateAdsTransformer, prismaService: PrismaService, mailerService: MailerService);
    findDetails(query: GetDetailsRealEstateAdItemsDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: any;
    }>;
    private adDetail;
    findAds(query: any): Promise<{
        status: number;
        result: any;
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    private generateRedisKey;
    private generateConditionFoFindAds;
    private makeSortAds;
    private getAdOwnerInfo;
    filteredAds(body: FilteredDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: any[];
        metadata: IMetadata;
    }>;
    getCategories(): Promise<{
        status: number;
        result: {
            id: string;
            title: string;
            status: string;
            type: string;
            RealEstateAdSubCategory: {
                id: string;
                title: string;
                form: {
                    items: {
                        id: string;
                        field_name: string;
                        is_active: boolean;
                        required: boolean;
                        field_type: string;
                        values: string[];
                        icon: string;
                    }[];
                };
            }[];
        }[];
    } | {
        status: number;
        result?: undefined;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
