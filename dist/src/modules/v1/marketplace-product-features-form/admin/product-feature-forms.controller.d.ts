import { ProductFeatureFormsService } from "./product-feature-forms.service";
import { CreateProductFeatureDto } from "./dto/create-productfeature-form-item.dto";
import { UpdateProductFeatureFormDto } from "./dto/update-product-feature-form.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetProductFeaturesDto } from "./dto/get-product-feature-forms.dto";
import ProductFeatureFormsTransformer from "./Transformer";
import { UpdateSortProductFeatureFormsDto } from "./dto/update-sort-product-feature-forms.dto";
import { createProductFeatureFormsDto } from "./dto/create-product-feature-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateProductFeatureDto } from "./dto/update-product-feature.dto";
export declare class ProductFeatureFormsController {
    private readonly realEstateAdsFormsService;
    private readonly realEstateAdFormsTransformer;
    private readonly responseHandler;
    constructor(realEstateAdsFormsService: ProductFeatureFormsService, realEstateAdFormsTransformer: ProductFeatureFormsTransformer, responseHandler: HttpResponsehandler);
    createForm(body: createProductFeatureFormsDto, req: any, res: Response): Promise<any>;
    findForms(query: PaginationDto, req: any, res: Response): Promise<any>;
    updateForm(body: UpdateProductFeatureFormDto, req: any, res: Response): Promise<any>;
    removeForm(form_id: string, req: any, res: Response): Promise<any>;
    saveItem(body: CreateProductFeatureDto, req: any, res: Response): Promise<any>;
    findItems(query: GetProductFeaturesDto, req: any, res: Response): Promise<any>;
    removeItem(item_id: string, req: any, res: Response): Promise<any>;
    updateItem(body: UpdateProductFeatureDto, req: any, res: Response): Promise<any>;
    updateDraggableItems(body: UpdateSortProductFeatureFormsDto, req: any, res: Response): Promise<any>;
}
