import { PrismaService } from "prisma/prisma.service";
export declare class DatabaseSeederService {
    private prisma;
    constructor(prisma: PrismaService);
    seedDatabase(): Promise<{
        success: boolean;
        message: string;
        data: {
            categoriesCreated: number;
            permissionsCreated: number;
            rolesCreated: number;
            usersCreated: number;
            users: any[];
        };
    }>;
    private seedRoleCategories;
    private seedPermissions;
    private seedRoles;
    private seedAdminUsers;
}
