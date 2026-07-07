import { CreateMissionDto } from "./dto/create-mission.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UsersService } from "src/modules/v2/users/admin/users.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "./dto/change-status-mission.dto";
export declare class MissionsAdminService {
    private readonly prismaService;
    private readonly userService;
    constructor(prismaService: PrismaService, userService: UsersService);
    create(body: CreateMissionDto): Promise<{
        retsult: {
            status: number;
            message: string;
            data: any;
        };
    }>;
    updateClientMissions(user_id: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        key: string;
        title: string;
        description: string;
        point: number;
        is_limited: boolean;
        number_of_hours: number;
        status: string;
        number_of_used: number;
        created_at: Date;
        creator_id: number;
    }, unknown, never> & {}>;
    getMissions(query: PaginationDto): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        key: string;
        title: string;
        description: string;
        point: number;
        is_limited: boolean;
        number_of_hours: number;
        status: string;
        number_of_used: number;
        created_at: Date;
        creator_id: number;
    }, unknown, never> & {})[]>;
    changeStatus(body: ChangeStatusMissionDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        key: string;
        title: string;
        description: string;
        point: number;
        is_limited: boolean;
        number_of_hours: number;
        status: string;
        number_of_used: number;
        created_at: Date;
        creator_id: number;
    }, unknown, never> & {}>;
    deleteMission(body: any): Promise<void>;
    findActivate(): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        key: string;
        title: string;
        description: string;
        point: number;
        is_limited: boolean;
        number_of_hours: number;
        status: string;
        number_of_used: number;
        created_at: Date;
        creator_id: number;
    }, unknown, never> & {})[]>;
}
