import { MissionsAdminService } from "./missions.service";
import { CreateMissionDto } from "./dto/create-mission.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MissionsTransformer from "./transformer";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "./dto/change-status-mission.dto";
export declare class MissionsController {
    private readonly missionsService;
    private readonly responseHandler;
    private readonly missionsTransformer;
    constructor(missionsService: MissionsAdminService, responseHandler: HttpResponsehandler, missionsTransformer: MissionsTransformer);
    create(body: CreateMissionDto, req: any, res: Response): Promise<any>;
    updateClientMissions(req: any, res: Response): Promise<any>;
    getMissions(query: PaginationDto, req: any, res: Response): Promise<any>;
    changeStatus(body: ChangeStatusMissionDto, req: any, res: Response): Promise<any>;
    deleteMission(item_id: number, req: any, res: Response): Promise<any>;
}
