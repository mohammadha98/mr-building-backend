import { AdminUsersRolesService } from "./admin-users-roles.service";
import { CreateCategoryRolePermissionsDto } from "src/modules/v2//admin-users-roles/private/dto/create-category-role-permissions";
import { CreateCategoryRolesDto } from "src/modules/v2//admin-users-roles/private/dto/create-category-roles";
import { UpdateCategoryRolesDto } from "src/modules/v2//admin-users-roles/private/dto/update-category-roles";
import { UpdatePermissionCategoryRoleDto } from "src/modules/v2//admin-users-roles/private/dto/update-category-roles-permission";
import adminUserRolesTransformer from "./Transformer";
export declare class AdminUsersRolesController {
    private readonly adminUsersRolesService;
    private readonly transformer;
    private readonly responseHandler;
    constructor(adminUsersRolesService: AdminUsersRolesService, transformer: adminUserRolesTransformer);
    createCategoryRoles(body: CreateCategoryRolesDto, request: any, res: Response): Promise<any>;
    getCategoryRoles(request: any, res: Response): Promise<any>;
    deleteCategoryRoles(category_id: string, request: any, res: Response): Promise<any>;
    updateCategoryRoles(body: UpdateCategoryRolesDto, request: any, res: Response): Promise<any>;
    CreateCategoryRolePermissions(body: CreateCategoryRolePermissionsDto, request: any, res: Response): Promise<any>;
    UpdatePermissionCategoryRole(body: UpdatePermissionCategoryRoleDto, request: any, res: Response): Promise<any>;
    deleteCategoryPermission(permission_id: string, request: any, res: Response): Promise<any>;
}
