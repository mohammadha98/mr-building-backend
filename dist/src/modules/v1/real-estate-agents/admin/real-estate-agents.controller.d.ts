import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { RealEstateAgentsService } from "./real-estate-agents.service";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import RealEstateAgentsTransformer from "./Transformer";
import { RealEstateAgentChangeStatusDto } from "./dto/real-estate-change-change-status.dtop";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import RealEstateAdsTransformer from "../../real-estate-ads/admin/Transformer";
import RealEstateAgentsCommentsTransformer from "../../real-estate-agents-comments/admin/Transformer";
import { DeleteRealEstateAgentsAdvisorsDto } from "../../real-estate-agents-advisors/app/dto/delete-real-estate-agents-advisors.dto";
export declare class RealEstateAgentsController {
    private readonly realEstateAgentsService;
    private readonly realEstateAgentsTransFormer;
    private readonly responseHandler;
    private readonly realEstateAdsTransformer;
    private readonly agentsCommentsTransformer;
    constructor(realEstateAgentsService: RealEstateAgentsService, realEstateAgentsTransFormer: RealEstateAgentsTransformer, responseHandler: HttpResponsehandler, realEstateAdsTransformer: RealEstateAdsTransformer, agentsCommentsTransformer: RealEstateAgentsCommentsTransformer);
    listOfRealEstateAgents(query: ListRealEstateAgentDto, req: any, res: Response): Promise<any>;
    changeStatus(query: RealEstateAgentChangeStatusDto, req: any, res: Response): Promise<any>;
    findAds(agent_id: number, query: PaginationDto, req: any, res: Response): Promise<any>;
    findAdvisors(agent_id: number, req: any, res: Response): Promise<any>;
    findAdmins(agent_id: number, req: any, res: Response): Promise<any>;
    findAllComments(agent_id: number, query: PaginationDto, req: any, res: any): Promise<any>;
    removeAdvisorInRealEstate(body: DeleteRealEstateAgentsAdvisorsDto): Promise<{
        statusCode: number;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    generateTrackingCode(): Promise<{
        status: number;
    }>;
    CreateChannelForOldRealEstates_test(): Promise<void>;
}
