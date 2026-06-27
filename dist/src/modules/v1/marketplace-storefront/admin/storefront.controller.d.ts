import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { StorefrontService } from "./storefront.service";
import { ListStorefrontsDto } from "./dto/list-storefronts.dto";
import StorefrontAdminTransformer from "./Transformer";
import { RealEstateAgentChangeStatusDto } from "./dto/storefront-change-status.dtop";
import { GetProductDto } from "../app/dto/get-product.dto";
export declare class StorefrontController {
    private readonly storefrontService;
    private readonly storefrontTransFormer;
    private readonly responseHandler;
    constructor(storefrontService: StorefrontService, storefrontTransFormer: StorefrontAdminTransformer, responseHandler: HttpResponsehandler);
    listOfStorefronts(query: ListStorefrontsDto, res: Response): Promise<any>;
    changeStatus(query: RealEstateAgentChangeStatusDto, req: any, res: Response): Promise<any>;
    findStorefrontProducts(body: GetProductDto, req: any, res: Response): Promise<any>;
}
