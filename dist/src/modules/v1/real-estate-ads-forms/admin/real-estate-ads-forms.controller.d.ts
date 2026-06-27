/// <reference types="multer" />
import { RealEstateAdsFormsService } from "./real-estate-ads-forms.service";
import { CreateRealEstateAdFormsItemsDto } from "./dto/create-real-estate-ads-form-item.dto";
import { UpdateRealEstateAdsFormsDto } from "./dto/update-real-estate-ads-forms.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetRealEstateAdFormsItemsDto } from "./dto/get-real-estate-ads-forms.dto";
import RealEstateAdFormsTransformer from "./Transformer";
import { UpdateSortItemsRealEstateAdsFormsDto } from "./dto/update-sort-items-real-estate-ads-forms.dto";
import { CreateRealEstateAdFormsDto } from "./dto/create-real-estate-ads-form.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateRealEstateAdFormsItemsDto } from "./dto/update-real-estate-ads-form-item.dto";
export declare class RealEstateAdsFormsController {
    private readonly realEstateAdsFormsService;
    private readonly realEstateAdFormsTransformer;
    private readonly responseHandler;
    constructor(realEstateAdsFormsService: RealEstateAdsFormsService, realEstateAdFormsTransformer: RealEstateAdFormsTransformer, responseHandler: HttpResponsehandler);
    createForm(body: CreateRealEstateAdFormsDto, req: any, res: Response): Promise<any>;
    findForms(query: PaginationDto, req: any, res: Response): Promise<any>;
    updateForm(body: UpdateRealEstateAdsFormsDto, req: any, res: Response): Promise<any>;
    removeForm(form_id: string, req: any, res: Response): Promise<any>;
    saveItem(body: CreateRealEstateAdFormsItemsDto, icon: Express.Multer.File, req: any, res: Response): Promise<any>;
    findItems(query: GetRealEstateAdFormsItemsDto, req: any, res: Response): Promise<any>;
    removeItem(item_id: string, req: any, res: Response): Promise<any>;
    updateItem(body: UpdateRealEstateAdFormsItemsDto, icon: Express.Multer.File, req: any, res: Response): Promise<any>;
    updateDraggableItems(body: UpdateSortItemsRealEstateAdsFormsDto, req: any, res: Response): Promise<any>;
}
