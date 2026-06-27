/// <reference types="multer" />
import { MarketplaceCategoriesService } from "./marketplace-categories.service";
import { CreateMarketplaceCategoryDto } from "./dto/create-marketplace-category.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateMarketplaceSubCategoryDto } from "./dto/update-sub-category-dto";
import MarketplaceCategoriesTransformer from "./Transformer";
export declare class MarketplaceCategoriesController {
    private readonly marketplaceCategoriesService;
    private readonly responseHandler;
    private readonly marketplaceCategoriesTransformer;
    constructor(marketplaceCategoriesService: MarketplaceCategoriesService, responseHandler: HttpResponsehandler, marketplaceCategoriesTransformer: MarketplaceCategoriesTransformer);
    saveCategory(body: CreateMarketplaceCategoryDto, req: any, res: Response, thumbnail: Express.Multer.File): Promise<any>;
    getAssortments(body: PaginationDto, req: any, res: Response): Promise<any>;
    deleteMainCategory(item_id: string, req: any, res: Response): Promise<any>;
    deleteSubCategory(item_id: string, req: any, res: Response): Promise<any>;
    updateSubCategory(body: UpdateMarketplaceSubCategoryDto, req: any, res: Response): Promise<any>;
}
