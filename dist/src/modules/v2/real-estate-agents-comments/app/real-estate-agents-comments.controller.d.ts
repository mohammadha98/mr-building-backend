import { RealEstateAgentsCommentsService } from "./real-estate-agents-comments.service";
import { CreateRealEstateAgentsCommentDto } from "./dto/create-real-estate-agents-comment.dto";
import RealEstateAgentsCommentsTransformer from "./Transformer";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetCommentsListForRealEstateAgentDto } from "src/modules/v2/real-estate-agents/app/dto/get-list..dto";
import { DeleteCommentDto } from "./dto/update-real-estate-agents-comment.dto";
export declare class RealEstateAgentsCommentsController {
    private readonly responseHandler;
    private readonly agentsCommentsService;
    private readonly agentsCommentsTransformer;
    constructor(responseHandler: HttpResponsehandler, agentsCommentsService: RealEstateAgentsCommentsService, agentsCommentsTransformer: RealEstateAgentsCommentsTransformer);
    create(body: CreateRealEstateAgentsCommentDto, req: any, res: any): Promise<any>;
    findComments(query: GetCommentsListForRealEstateAgentDto, req: any, res: any): Promise<any>;
    deleteCommentForRealEstate(query: DeleteCommentDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {};
    }>;
}
