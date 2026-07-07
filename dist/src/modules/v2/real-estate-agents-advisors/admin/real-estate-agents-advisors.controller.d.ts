import { RealEstateAgentsAdvisorsService } from "./real-estate-agents-advisors.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientTransformer from "src/modules/v2/client/app/Transformer";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import RealEstateAdvisorTransformer from "./Transformer";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
import { ChangeStatusAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
export declare class RealEstateAgentsAdvisorsController {
    private readonly responseHandler;
    private readonly realEstateAdvisorTransformer;
    private readonly clientTransformer;
    private readonly realEstateAgentsAdvisorsService;
    constructor(responseHandler: HttpResponsehandler, realEstateAdvisorTransformer: RealEstateAdvisorTransformer, clientTransformer: ClientTransformer, realEstateAgentsAdvisorsService: RealEstateAgentsAdvisorsService);
    findAll(query: GetRealEstateAgentsAdvisorsDto, req: any, res: Response): Promise<any>;
    changeStatus(body: ChangeStatusAdvisorsDto, req: any, res: Response): Promise<any>;
    findComments(query: GetAdvisorCommentsDto, req: any, res: any): Promise<any>;
}
