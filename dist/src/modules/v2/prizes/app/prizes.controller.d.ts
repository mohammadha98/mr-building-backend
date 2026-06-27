import { PrizesService } from "./prizes.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import PrizesTransformer from "./transformer";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UsePrizeDto } from "./dto/use-prize.dto";
export declare class PrizesController {
    private readonly prizesService;
    private readonly responseHandler;
    private readonly prizesTransformer;
    constructor(prizesService: PrizesService, responseHandler: HttpResponsehandler, prizesTransformer: PrizesTransformer);
    getMissions(query: PaginationDto, req: any, res: Response): Promise<any>;
    getPrizes(query: PaginationDto, req: any, res: Response): Promise<any>;
    getUserPrizes(query: PaginationDto, req: any, res: Response): Promise<any>;
    usePrize(body: UsePrizeDto, req: any, res: Response): Promise<any>;
    getHistoryOfScores(query: PaginationDto, req: any, res: Response): Promise<any>;
}
