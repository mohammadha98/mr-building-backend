import { DeleteFilteredWordAdvisorDto } from "./dto/delete-filtered-word-advisor.dto";
import { RealEstateAgentsAdvisorsService } from "./real-estate-agents-advisors.service";
import { CreateRealEstateAgentsAdvisorDto, UpdatePermissionsForAdvisorDto } from "./dto/create-real-estate-agents-advisor.dto";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientTransformer from "src/modules/v2/client/app/Transformer";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import RealEstateAdvisorTransformer from "./Transformer";
import { ChangeStatusRealEstateAgentsAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import { DeleteRealEstateAgentsAdvisorsDto } from "./dto/delete-real-estate-agents-advisors.dto";
import { CreateActiveAreaAdvisorDto } from "./dto/create-active-area-advisor.dto";
import { DeleteActiveAreaAdvisorDto } from "./dto/delete-active-area-advisor.dto";
import { GetActiveAreasAdvisorDto } from "./dto/get-active-areas-advisor.dto";
import { CreateAdvisorCommentDto } from "./dto/create-advisor-comment.dto";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
import { SaveAdvisorSettingDto } from "./dto/save-advisor-settings..dto";
import { UpdateAdvisorProfileDto } from "./dto/update-profile.dto";
import { DeleteCommentDto } from "../../real-estate-agents-comments/app/dto/update-real-estate-agents-comment.dto";
export declare class RealEstateAgentsAdvisorsController {
    private readonly responseHandler;
    private readonly realEstateAdvisorTransformer;
    private readonly clientTransformer;
    private readonly realEstateAgentsAdvisorsService;
    constructor(responseHandler: HttpResponsehandler, realEstateAdvisorTransformer: RealEstateAdvisorTransformer, clientTransformer: ClientTransformer, realEstateAgentsAdvisorsService: RealEstateAgentsAdvisorsService);
    validate(body: ValidateRealEstateAgentsAdvisorDto, req: any, res: Response): Promise<any>;
    create(body: CreateRealEstateAgentsAdvisorDto, req: any, res: Response): Promise<any>;
    updatePermissions(body: UpdatePermissionsForAdvisorDto): Promise<{
        statusCode: number;
        message: import("../../../../commons/enums/messages").PublicMessage;
    }>;
    findAll(query: GetRealEstateAgentsAdvisorsDto, req: any, res: Response): Promise<any>;
    changeStatus(body: ChangeStatusRealEstateAgentsAdvisorsDto, req: any, res: Response): Promise<any>;
    removeAdvisor(body: DeleteRealEstateAgentsAdvisorsDto, req: any, res: Response): Promise<any>;
    storeActiveArea(body: CreateActiveAreaAdvisorDto, req: any, res: Response): Promise<any>;
    removeActiveArea(body: DeleteActiveAreaAdvisorDto, req: any, res: Response): Promise<any>;
    getActiveAreas(query: GetActiveAreasAdvisorDto, req: any, res: Response): Promise<any>;
    storeFilteredWord(body: CreateActiveAreaAdvisorDto, req: any, res: Response): Promise<any>;
    removeFilteredWord(body: DeleteFilteredWordAdvisorDto, req: any, res: Response): Promise<any>;
    getFilteredWords(query: GetActiveAreasAdvisorDto, req: any, res: Response): Promise<any>;
    storeComment(body: CreateAdvisorCommentDto, req: any, res: any): Promise<any>;
    findComments(query: GetAdvisorCommentsDto, req: any, res: any): Promise<any>;
    deleteCommentForRealEstate(query: DeleteCommentDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
        message: import("../../../../commons/enums/messages").PublicMessage;
        data: {};
    }>;
    saveSettings(body: SaveAdvisorSettingDto, req: any, res: any): Promise<any>;
    updateProfile(body: UpdateAdvisorProfileDto, req: any, res: any): Promise<any>;
}
