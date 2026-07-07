/// <reference types="multer" />
import { PrizesService } from "./prizes.service";
import { CreatePrizeDto } from "./dto/create-mission.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import PrizesTransformer from "./transformer";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "src/modules/v2/missions/admin/dto/change-status-mission.dto";
export declare class PrizesController {
    private readonly prizesService;
    private readonly responseHandler;
    private readonly prizesTransformer;
    constructor(prizesService: PrizesService, responseHandler: HttpResponsehandler, prizesTransformer: PrizesTransformer);
    create(body: CreatePrizeDto, req: any, res: Response, thumbnail: Express.Multer.File): Promise<any>;
    getPrizes(query: PaginationDto, req: any, res: Response): Promise<any>;
    changeStatus(body: ChangeStatusMissionDto, req: any, res: Response): Promise<any>;
    deletePrize(item_id: number, req: any, res: Response): Promise<any>;
}
