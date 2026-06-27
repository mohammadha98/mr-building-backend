/// <reference types="multer" />
import { SliderService } from "./slider.service";
import { CreateSliderDto } from "./dto/create-slider.dto";
import { UpdateSliderDto } from "./dto/update-slider.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import SliderTransformerAdmin from "./contracts/transformer-admin";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
export declare class SliderController {
    private readonly sliderService;
    private readonly responseHandler;
    private readonly sliderTransformer;
    constructor(sliderService: SliderService, responseHandler: HttpResponsehandler, sliderTransformer: SliderTransformerAdmin);
    create(createSliderDto: CreateSliderDto, thumbnail: Express.Multer.File, req: Request, res: Response): Promise<any>;
    findAll(query: PaginationSchema, res: Response): Promise<any>;
    update(body: UpdateSliderDto, res: Response, file: Express.Multer.File): Promise<any>;
    remove(id: number, res: Response): Promise<any>;
}
