import { HttpStatus } from "@nestjs/common";
import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { UsersService } from "src/modules/v2/users/admin/users.service";
import { Admin_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { CreateAdCategoryDto } from "./dto/create-ad-category-dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category-dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { saveReasonsForRejectingAdsDto } from "./dto/saveReasonsForRejectingAds-dto";
import { RealEstateAdsServiceApp } from "../app/real-estate-ads-service-app.service";
import { WarningSignsBeforeTransactionDto } from "./dto/warning-signs-before-transaction-dto";
import { PublicMessage } from "src/commons/enums/messages";
import { GetReasonsAdDto } from "./dto/get-reasons-ad.dto";
export declare class RealEstateAdsService {
    private readonly realEstateAdsPostgresqlRepository;
    private readonly usersService;
    private readonly prismaService;
    private readonly mailerService;
    private readonly adsServiceApp;
    private readonly uploadService;
    constructor(realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository, usersService: UsersService, prismaService: PrismaService, mailerService: MailerService, adsServiceApp: RealEstateAdsServiceApp);
    findDetails(tracking_code: any): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: any;
    }>;
    changeStatus(body: Admin_ChangeStatusAdDto): Promise<{
        status: number;
    }>;
    private updatePublishedAdTime;
    saveCategory(body: CreateAdCategoryDto): Promise<{
        status: number;
    }>;
    getCategorys(body: PaginationDto): Promise<{
        status: number;
        result: {
            id: string;
            title: string;
            type: string;
            status: string;
            RealEstateAdSubCategory: {
                id: string;
                title: string;
                formId: string;
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
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    deleteMainCategory(item_id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            type: string;
            title: string;
            status: string;
        }, unknown, never> & {};
    }>;
    deleteSubCategory(item_id: string): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            categoryId: string;
            formId: string;
        }, unknown, never> & {};
    }>;
    updateSubCategory(body: UpdateSubCategoryDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            categoryId: string;
            formId: string;
        }, unknown, never> & {};
    }>;
    saveReasonsForRejectingAds(body: saveReasonsForRejectingAdsDto): Promise<{
        status: number;
        result: any;
    } | {
        status: number;
        result?: undefined;
    }>;
    getReasonsList(query: GetReasonsAdDto): Promise<{
        status: number;
        result: {
            id: string;
            text: string;
            type: string;
            created_at: Date;
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    SaveWarningSingBeforeTransaction(body: WarningSignsBeforeTransactionDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: any;
    }>;
    GetWarningSingBeforeTransaction(): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {
            id: string;
            content: string;
        };
    }>;
    deleteAd(id: number): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
    }>;
    deleteReasonsForRejectingAds(item_id: string): Promise<{
        status: number;
    }>;
    private changeNumberOfAds;
    private getUserPermittedAds;
    private senEmailForAdmins;
    findAds(query: GetRealEstateAdDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: any[];
        metadata: IMetadata;
    }>;
    findOneByID(item_id: number): Promise<{
        id: number;
        title: string;
    }>;
    private getAdOwnerInfo;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
