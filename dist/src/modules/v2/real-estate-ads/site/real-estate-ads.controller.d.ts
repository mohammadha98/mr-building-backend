import { RealEstateAdsService } from "./real-estate-ads.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetDetailsRealEstateAdItemsDto } from "./dto/get-details-real-estate-ads.dto";
import RealEstateAdsTransformer from "./Transformer";
import { GetRealEstateAdDto } from "./dto/get-real-estate-ads.dto";
import { FilteredDto } from "./dto/filtered.dto";
export declare class RealEstateAdsSettingsController {
    private readonly realEstateAdsService;
    private readonly responseHandler;
    private readonly realEstateAdsTransformer;
    constructor(realEstateAdsService: RealEstateAdsService, responseHandler: HttpResponsehandler, realEstateAdsTransformer: RealEstateAdsTransformer);
    findAds(query: GetRealEstateAdDto, req: any, res: Response): Promise<any>;
    filteredAds(body: FilteredDto, req: any, res: Response): Promise<any>;
    findDetails(query: GetDetailsRealEstateAdItemsDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: any;
    }>;
    getCategories(req: any, res: Response): Promise<any>;
}
