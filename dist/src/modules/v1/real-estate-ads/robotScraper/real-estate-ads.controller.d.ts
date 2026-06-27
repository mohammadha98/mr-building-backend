import { RealEstateAdsService_robotScraper } from "./real-estate-ads.service";
import { CreateRealEstateAdRobotScraperDto, DownloadFileUrl } from "./dto/create-real-estate-roborScraper-ads.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import RealEstateAdsTransformer from "./Transformer";
export declare class RealEstateAdsRobotScraperController {
    private readonly realEstateAdsService;
    private readonly responseHandler;
    private readonly realEstateAdsTransformer;
    constructor(realEstateAdsService: RealEstateAdsService_robotScraper, responseHandler: HttpResponsehandler, realEstateAdsTransformer: RealEstateAdsTransformer);
    create(body: CreateRealEstateAdRobotScraperDto, res: Response): Promise<any>;
    getCategories(req: any, res: Response): Promise<any>;
    testDownloadFile(body: DownloadFileUrl): Promise<{
        fileUrl: string;
        dest: string;
        filename: string;
    }>;
}
