/// <reference types="multer" />
import { MarketplaceBrandsService } from "./marketplace-brands.service";
import { CreateMarketplaceBrandsDto } from "./dto/create-marketplace-brands.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import MarketplaceBrandsTransformer from "./Transformer";
export declare class MarketplaceBrandsController {
    private readonly marketplaceBrandsService;
    private readonly responseHandler;
    private readonly marketplaceBrandsTransformer;
    constructor(marketplaceBrandsService: MarketplaceBrandsService, responseHandler: HttpResponsehandler, marketplaceBrandsTransformer: MarketplaceBrandsTransformer);
    saveBrands(body: CreateMarketplaceBrandsDto, req: any, res: Response, thumbnail: Express.Multer.File): Promise<any>;
    getAssortments(body: PaginationDto, req: any, res: Response): Promise<any>;
    deleteMainBrands(item_id: string, req: any, res: Response): Promise<any>;
}
