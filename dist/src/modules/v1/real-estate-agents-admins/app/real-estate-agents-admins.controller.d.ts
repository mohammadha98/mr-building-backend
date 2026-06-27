import { RealEstateAgentsAdminsService } from "./real-estate-agents-admins.service";
import { CreateRealEstateAgentsAdminDto } from "./dto/create-real-estate-agents-admin.dto";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientTransformer from "src/modules/v1/client/app/Transformer";
import { GetRealEstateAgentsAdminsDto } from "./dto/get-real-estate-agents-admins.dto";
import RealEstateAdminTransformer from "./Transformer";
import { ChangeStatusRealEstateAdminsAdminsDto } from "./dto/change-status-real-estate-agents-admins.dto";
import { DeleteRealEstateAgentsAdminsDto } from "./dto/delete-real-estate-agents-admin.dto";
import { UpdateAdminPermissionsDto } from "./dto/update-admin-permisions";
export declare class RealEstateAgentsAdminsController {
    private readonly responseHandler;
    private readonly realEstateAdminTransformer;
    private readonly clientTransformer;
    private readonly realEstateAgentsAdminsService;
    constructor(responseHandler: HttpResponsehandler, realEstateAdminTransformer: RealEstateAdminTransformer, clientTransformer: ClientTransformer, realEstateAgentsAdminsService: RealEstateAgentsAdminsService);
    validate(body: ValidateRealEstateAgentsAdvisorDto, req: any, res: Response): Promise<any>;
    create(body: CreateRealEstateAgentsAdminDto, req: any, res: Response): Promise<any>;
    findAll(query: GetRealEstateAgentsAdminsDto, req: any, res: Response): Promise<any>;
    changeStatus(body: ChangeStatusRealEstateAdminsAdminsDto, req: any, res: Response): Promise<any>;
    updatePermissions(body: UpdateAdminPermissionsDto, req: any, res: Response): Promise<any>;
    removeAdmin(body: DeleteRealEstateAgentsAdminsDto, req: any, res: Response): Promise<any>;
}
