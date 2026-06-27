import { UpdateExpiredAd, UpdateRealEstateAdDto } from "./dto/update-real-estate-ads.dto";
import RealEstateAdsPostgresqlRepository from "../repositories/RealEstateAdsPostgresqlRepository";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import { CreateRealEstateAdDto } from "./dto/create-real-estate-ads.dto";
import { UploadFileRealEstateAdItemsDto } from "./dto/upload-file-real-estate-ads.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { FilteredDto } from "./dto/filtered.dto";
import { HttpStatus } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Response } from "express";
import RealEstateAdsTransformer from "./Transformer";
import { DeleteRealEstateMediaItemDto } from "./dto/delete-media-item.dto";
import { DeleteRealEstateAdItemsDto } from "./dto/delete-real-estate-ads.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ChangeCoverMediaDto } from "./dto/change-cover-media-item.dto";
import { GetPublicAdsDto } from "./dto/get-public-ads";
import { APP_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { RealEstateAdsService_robotScraper } from "../robotScraper/real-estate-ads.service";
import { SaveAdSettingsDto } from "./dto/save-ad-settings";
import { Request } from "express";
import { PublicMessage } from "src/commons/enums/messages";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import { saveNewSuspiciousBehavior } from "./dto/save-suspicious-behavior-ad";
import { EstimatePriceAd } from "./dto/estimate-price-ad";
export declare class RealEstateAdsServiceApp {
    private request;
    private cacheManager;
    private readonly realEstateAdsPostgresqlRepository;
    private readonly clientService;
    private readonly realEstateAdsTransformer;
    private readonly prismaService;
    private readonly mailerService;
    private readonly robotScraper;
    private readonly notificationService;
    private readonly smsService;
    private readonly uploadService;
    constructor(request: Request, cacheManager: Cache, realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository, clientService: ClientService, realEstateAdsTransformer: RealEstateAdsTransformer, prismaService: PrismaService, mailerService: MailerService, robotScraper: RealEstateAdsService_robotScraper, notificationService: FcmNotificationService, smsService: SmsService);
    storeAd(body: CreateRealEstateAdDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: any;
        };
    }>;
    updateExpiredAd(body: UpdateExpiredAd): Promise<{
        status: number;
        message: PublicMessage;
    }>;
    private updatePublishedAdTime;
    private getClientsForFilteredAdSetting;
    saveFilteredNotificationForAds(body: SaveAdSettingsDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {
            id: any;
        };
    }>;
    getFilteredNotificationForAds(): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {
            id: any;
            title: any;
            smsNotification: any;
            whatsappNotification: any;
            expired_at: {
                day: number;
                month: string;
                year: number;
            };
            rent_price: any;
            year_built_from: any;
            year_built_to: any;
            size_from: any;
            size_to: any;
            sale_price_from: any;
            sale_price_to: any;
            deposit_price_from: any;
            deposit_price_to: any;
            rent_price_from: any;
            rent_price_to: any;
            normal_days_price_from: any;
            normal_days_price_to: any;
            number_of_rooms_from: any;
            number_of_rooms_to: any;
            max_capicity_from: any;
            max_capicity_to: any;
            provinceId: any;
            cityId: any;
            categoryId: any;
            subCategoryId: any;
            items: any;
        }[];
    }>;
    deleteFilteredNotificationForAds(item_id: string): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
    }>;
    GetWarningSingBeforeTransaction(): Promise<any>;
    update(body: UpdateRealEstateAdDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            id: number;
        };
    }>;
    private checkExistDataInSuspiciousBehavior;
    private checkExistDataInEstimatePriceForAd;
    findDetails(query: GetDetailsRealEstateAdItemsDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: any;
    }>;
    adDetail(where: any): Promise<{
        details: {
            id: any;
            tag: any;
            category: {
                id: any;
                title: any;
                type: any;
            };
            sub_category: {
                id: any;
                title: any;
                type: any;
            };
            tracking_code: any;
            seller_type: any;
            is_applicant: any;
            owner_id: any;
            display_contact: any;
            is_active_chat: any;
            owner_info: any;
            title: any;
            description: any;
            sale_price: any;
            deposit_price: any;
            rent_price: any;
            number_of_rooms: any;
            max_capicity: any;
            size: any;
            year_built: any;
            normal_days_price: any;
            weekend_price: any;
            special_days_price: any;
            cost_per_additional_person: any;
            extra_people: any;
            agent_valuation_request: any;
            price_status: any;
            price_rating: any;
            latitude: any;
            longitude: any;
            status: any;
            is_timed: any;
            expired_at: any;
            province: {
                id: any;
                name: any;
            };
            city: {
                id: any;
                name: any;
            };
            area: any;
            items: any;
            media: {
                id: any;
                file_name: any;
                file_type: any;
                file_url: string;
                sort_number: any;
                priority: any;
                thumbnail: string;
            }[];
            created_at: any;
            created_time: any;
        };
        related: any[];
    }>;
    findAds(query: GetRealEstateAdDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: any;
        metadata: IMetadata;
    }>;
    private generateRedisKey;
    private makeSortAds;
    sortAdsByDate(list: any[]): Promise<any[]>;
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
    removeAd(query: DeleteRealEstateAdItemsDto): Promise<{
        status: number;
    }>;
    getPublicAds(body: GetPublicAdsDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: {
            id: any;
            tag: any;
            tracking_code: any;
            category: {
                id: any;
                title: any;
                type: any;
            };
            sub_category: {
                id: any;
                title: any;
                type: any;
            };
            title: any;
            is_applicant: any;
            display_contact: any;
            owner_info: any;
            status: any;
            reasons: any;
            sale_price: any;
            deposit_price: any;
            rent_price: any;
            number_of_rooms: any;
            max_capicity: any;
            normal_days_price: any;
            province: {
                id: any;
                name: any;
            };
            city: {
                id: any;
                name: any;
            };
            area: any;
            seller_type: any;
            created_at: any;
            createdAt: any;
            media: {
                id: any;
                file_name: any;
                file_type: any;
                file_url: string;
                sort_number: any;
                priority: any;
                thumbnail: string;
            };
        }[];
        metadata: IMetadata;
    }>;
    UploadFile(body: UploadFileRealEstateAdItemsDto, res: Response): Promise<Response<any, Record<string, any>>>;
    private generateThumbnailForVideo;
    private generateThumbnailForImage;
    private getPath;
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
    private moveFileLocation;
    removeAdFile(query: DeleteRealEstateMediaItemDto): Promise<{
        status: number;
    }>;
    changeCover(body: ChangeCoverMediaDto): Promise<{
        status: number;
    }>;
    private generateTrackingCode;
    changeStatus(body: APP_ChangeStatusAdDto): Promise<{
        status: number;
    }>;
    sendNotificationNewAd(ad_info: any): Promise<void>;
    private changeNumberOfAds;
    saveNewPrize(client: any, refrence: string): Promise<void>;
    private getUserPermittedAds;
    private senEmailForAdmins;
    getRejectedReasonList(): Promise<{
        status: HttpStatus;
        message: PublicMessage;
        data: {
            id: string;
            text: string;
            created_at: Date;
        }[];
    }>;
    getDeletedReasonList(): Promise<{
        status: HttpStatus;
        message: PublicMessage;
        data: {
            id: string;
            text: string;
            created_at: Date;
        }[];
    }>;
    getSuspiciousBehavior(): Promise<{
        status: HttpStatus;
        message: PublicMessage;
        data: {
            id: string;
            text: string;
            created_at: Date;
        }[];
    }>;
    saveNewSuspiciousBehavior(body: saveNewSuspiciousBehavior): Promise<{
        status: HttpStatus;
        message: PublicMessage;
    }>;
    storeEstimatePriceForAd(body: EstimatePriceAd): Promise<{
        status: HttpStatus;
        message: PublicMessage;
    }>;
    private generateConditionFoFindAds;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
