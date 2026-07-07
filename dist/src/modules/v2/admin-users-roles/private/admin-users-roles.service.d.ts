import { CreateCategoryRolePermissionsDto } from "./dto/create-category-role-permissions";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateCategoryRolesDto } from "./dto/create-category-roles";
import { AdminUserRoleCategories } from "@prisma/client";
import { UpdateCategoryRolesDto } from "./dto/update-category-roles";
import { UpdatePermissionCategoryRoleDto } from "./dto/update-category-roles-permission";
export declare class AdminUsersRolesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createCategoryRoles(body: CreateCategoryRolesDto): Promise<AdminUserRoleCategories | any>;
    UpdateCategoryRolesDto(body: UpdateCategoryRolesDto): Promise<AdminUserRoleCategories | any>;
    UpdatePermissionCategoryRoleDto(body: UpdatePermissionCategoryRoleDto): Promise<AdminUserRoleCategories | any>;
    getCategoryRoles(): Promise<any>;
    deleteCategoryRoles(category_id: string): Promise<any>;
    deleteCategoryPermission(permission_id: string): Promise<any>;
    CreateCategoryRolePermissions(body: CreateCategoryRolePermissionsDto): Promise<CreateCategoryRolePermissionsDto | any>;
}
