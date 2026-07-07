/// <reference types="multer" />
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { RealEstateAgentsService } from "./real-estate-agents.service";
import { CreateRealEstateAgentDto } from "./dto/create-real-estate-agent.dto";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import RealEstateAgentsTransformer from "./Transformer";
import { SearchForRealEstateAgentDto } from "./dto/search.real-estate-agents.dto";
export declare class RealEstateAgentsController {
    private readonly realEstateAgentsService;
    private readonly realEstateAgentsTransFormer;
    private readonly responseHandler;
    constructor(realEstateAgentsService: RealEstateAgentsService, realEstateAgentsTransFormer: RealEstateAgentsTransformer, responseHandler: HttpResponsehandler);
    create(createDto: CreateRealEstateAgentDto, req: any, res: Response, files: {
        avatar?: Express.Multer.File;
        license?: Express.Multer.File;
    }): Promise<any>;
    listOfRealEstateAgents(query: ListRealEstateAgentDto, req: any, res: Response): Promise<any>;
    search(query: SearchForRealEstateAgentDto, res: Response): Promise<any>;
    GetRealEstateAgentInfo(agent_id: number, req: any, res: Response): Promise<any>;
    getActiveRealEstates(query: ListRealEstateAgentDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {
            data: {
                id: any;
                client_id: any;
                name: any;
                phone: any;
                validate_phone: any;
                avatar: string;
                license: string;
                license_status: any;
                status: any;
                score: any;
                number_of_ads: any;
                province: any;
                city: any;
                channel: any;
            }[];
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
}
