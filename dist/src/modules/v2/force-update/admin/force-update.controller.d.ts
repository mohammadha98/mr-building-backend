/// <reference types="multer" />
import { ForceUpdateService } from "./force-update.service";
import { CreateForceUpdateDto } from "./dto/create-forceupdate.dto";
import RealEstateAgentsCommentsTransformer from "./Transformer";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusDto } from "./dto/change-status.dto";
import { RemoveDto } from "./dto/remove.dto";
export declare class RealEstateAgentsCommentsController {
    private readonly responseHandler;
    private readonly agentsCommentsService;
    private readonly agentsCommentsTransformer;
    constructor(responseHandler: HttpResponsehandler, agentsCommentsService: ForceUpdateService, agentsCommentsTransformer: RealEstateAgentsCommentsTransformer);
    storeForceUpdate(body: CreateForceUpdateDto, file_apk: Express.Multer.File, req: any, res: any): Promise<any>;
    findAllComments(query: PaginationDto, req: any, res: any): Promise<any>;
    changeStatus(body: ChangeStatusDto, req: any, res: any): Promise<any>;
    remove(query: RemoveDto, req: any, res: any): Promise<any>;
}
