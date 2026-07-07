import { DatabaseSeederService } from "../seeds/database-seeder.service";
export declare class DatabaseSeederController {
    private readonly seederService;
    constructor(seederService: DatabaseSeederService);
    initializeDatabase(): Promise<{
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
}
