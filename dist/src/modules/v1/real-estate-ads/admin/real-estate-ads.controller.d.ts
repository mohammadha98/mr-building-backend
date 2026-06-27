import { RealEstateAdsService } from "./real-estate-ads.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import RealEstateAdsTransformer from "./Transformer";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { Admin_ChangeStatusAdDto } from "./dto/change-status-ad.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category-dto";
import { CreateAdCategoryDto } from "./dto/create-ad-category-dto";
import { saveReasonsForRejectingAdsDto } from "./dto/saveReasonsForRejectingAds-dto";
import { WarningSignsBeforeTransactionDto } from "./dto/warning-signs-before-transaction-dto";
import { GetReasonsAdDto } from "./dto/get-reasons-ad.dto";
export declare class RealEstateAdsSettingsController {
    private readonly realEstateAdsService;
    private readonly responseHandler;
    private readonly realEstateAdsTransformer;
    constructor(realEstateAdsService: RealEstateAdsService, responseHandler: HttpResponsehandler, realEstateAdsTransformer: RealEstateAdsTransformer);
    findAds(query: GetRealEstateAdDto, req: any, res: Response): Promise<any>;
    findDetails(tracking_code: number, req: any, res: Response): Promise<any>;
    changeStatus(body: Admin_ChangeStatusAdDto, req: any, res: Response): Promise<any>;
    saveCategory(body: CreateAdCategoryDto, req: any, res: Response): Promise<any>;
    getAssortments(body: PaginationDto, req: any, res: Response): Promise<any>;
    deleteMainCategory(item_id: string, req: any, res: Response): Promise<any>;
    deleteSubCategory(item_id: string, req: any, res: Response): Promise<any>;
    updateSubCategory(body: UpdateSubCategoryDto, req: any, res: Response): Promise<any>;
    saveReasonsForRejectingAds(body: saveReasonsForRejectingAdsDto, req: any, res: Response): Promise<any>;
    deleteReasonsForRejectingAds(item_id: string, req: any, res: Response): Promise<any>;
    getReasonsList(query: GetReasonsAdDto, req: any, res: Response): Promise<any>;
    SaveWarningSingBeforeTransaction(body: WarningSignsBeforeTransactionDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: any;
    }>;
    GetWarningSingBeforeTransaction(): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            id: string;
            content: string;
        };
    }>;
    deleteAd(id: number): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
}
