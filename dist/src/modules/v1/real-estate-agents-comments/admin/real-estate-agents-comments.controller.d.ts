import { RealEstateAgentsCommentsService } from "./real-estate-agents-comments.service";
import { UpdateRealEstateAgentsCommentDto } from "./dto/update-real-estate-agents-comment.dto";
import RealEstateAgentsCommentsTransformer from "./Transformer";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ChangeStatusCommentAgentDto } from "./dto/change-status.dto";
import { GetCommentsListForRealEstateAgentDto } from "./dto/get-list..dto copy";
export declare class RealEstateAgentsCommentsController {
    private readonly responseHandler;
    private readonly agentsCommentsService;
    private readonly agentsCommentsTransformer;
    constructor(responseHandler: HttpResponsehandler, agentsCommentsService: RealEstateAgentsCommentsService, agentsCommentsTransformer: RealEstateAgentsCommentsTransformer);
    findAllComments(query: GetCommentsListForRealEstateAgentDto, req: any, res: any): Promise<any>;
    changeStatus(body: ChangeStatusCommentAgentDto, req: any, res: any): Promise<any>;
    findOne(id: string): Promise<string>;
    update(id: string, updateRealEstateAgentsCommentDto: UpdateRealEstateAgentsCommentDto): Promise<string>;
    remove(id: string): Promise<string>;
}
