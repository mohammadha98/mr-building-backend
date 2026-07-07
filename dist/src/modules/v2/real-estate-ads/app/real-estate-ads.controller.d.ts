/// <reference types="multer" />
/// <reference types="express" />
import { RealEstateAdsServiceApp } from "./real-estate-ads-service-app.service";
import { CreateRealEstateAdDto } from "./dto/create-real-estate-ads.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import RealEstateAdsTransformer from "./Transformer";
import { UploadFileRealEstateAdItemsDto } from "./dto/upload-file-real-estate-ads.dto";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { FilteredDto } from "./dto/filtered.dto";
import { DeleteRealEstateAdItemsDto } from "./dto/delete-real-estate-ads.dto";
import { DeleteRealEstateMediaItemDto } from "./dto/delete-media-item.dto";
import { UpdateExpiredAd, UpdateRealEstateAdDto } from "./dto/update-real-estate-ads.dto";
import { ChangeCoverMediaDto } from "./dto/change-cover-media-item.dto";
import { GetPublicAdsDto } from "./dto/get-public-ads";
import { APP_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import { SaveAdSettingsDto } from "./dto/save-ad-settings";
import { saveNewSuspiciousBehavior } from "./dto/save-suspicious-behavior-ad";
import { EstimatePriceAd } from "./dto/estimate-price-ad";
export declare class RealEstateAdsSettingsController {
    private readonly realEstateAdsService;
    private readonly responseHandler;
    private readonly realEstateAdsTransformer;
    constructor(realEstateAdsService: RealEstateAdsServiceApp, responseHandler: HttpResponsehandler, realEstateAdsTransformer: RealEstateAdsTransformer);
    create(body: CreateRealEstateAdDto, req: any, res: Response): Promise<any>;
    update(body: UpdateRealEstateAdDto, req: any, res: Response): Promise<any>;
    findAds(query: GetRealEstateAdDto, req: any, res: Response): Promise<any>;
    filteredAds(body: FilteredDto, req: any, res: Response): Promise<any>;
    findDetails(query: GetDetailsRealEstateAdItemsDto, req: any): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: any;
    }>;
    UploadTempFile(body: UploadFileRealEstateAdItemsDto, file: Express.Multer.File, req: any, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    removeAd(body: DeleteRealEstateAdItemsDto, req: any, res: Response): Promise<any>;
    removeAdFile(query: DeleteRealEstateMediaItemDto, req: any, res: Response): Promise<any>;
    changeCover(body: ChangeCoverMediaDto, req: any, res: Response): Promise<any>;
    changeStatus(body: APP_ChangeStatusAdDto, req: any, res: Response): Promise<any>;
    GetPublicAdsDto(body: GetPublicAdsDto, req: any, res: Response): Promise<any>;
    getCategories(req: any, res: Response): Promise<any>;
    getReasonsList(): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            id: string;
            text: string;
            created_at: Date;
        }[];
    }>;
    getDeletedReasonList(): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            id: string;
            text: string;
            created_at: Date;
        }[];
    }>;
    getSuspiciousBehavior(): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            id: string;
            text: string;
            created_at: Date;
        }[];
    }>;
    saveNewSuspiciousBehavior(body: saveNewSuspiciousBehavior, req: any): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    storeEstimatePriceForAd(body: EstimatePriceAd, req: any): Promise<{
        status: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    updateExpiredAd(body: UpdateExpiredAd, req: any): Promise<{
        status: number;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    saveAdSettingsForNotification(body: SaveAdSettingsDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            id: any;
        };
    }>;
    getAdSettingsForNotification(): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
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
    deleteAdSettingsForNotification(item_id: string): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    testFN(): void;
}
