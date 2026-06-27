import { PrismaService } from "../../../../../prisma/prisma.service";
import { AdminUserRolesProfile } from "@prisma/client";
import { CreateRoleDto } from "../private/dto/create-role";
import { PaginationDto } from "src/commons/dto/pagination.dto";
export declare class AdminUsersRolesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createRole(body: CreateRoleDto): Promise<AdminUserRolesProfile | any>;
    getCategoryRoles(): Promise<any>;
    roleList(query: PaginationDto): Promise<any>;
    roleInfo(role_id: string): Promise<any>;
    deleteRole(role_id: string): Promise<any>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
