import { AdminUsersRolesService } from "./admin-users-roles.service";
import adminUserRolesTransformer from "./Transformer";
import { CreateRoleDto } from "../private/dto/create-role";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
export declare class AdminUsersRolesController {
    private readonly adminUsersRolesService;
    private readonly transformer;
    private readonly responseHandler;
    constructor(adminUsersRolesService: AdminUsersRolesService, transformer: adminUserRolesTransformer);
    getCategoryRoles(request: any, res: Response): Promise<any>;
    createCategoryRoles(body: CreateRoleDto, request: any, res: Response): Promise<any>;
    roleList(query: PaginationDto, res: Response): Promise<any>;
    roleInfo(role_id: string, request: any, res: Response): Promise<any>;
    deleteRole(role_id: string, request: any, res: Response): Promise<any>;
}
