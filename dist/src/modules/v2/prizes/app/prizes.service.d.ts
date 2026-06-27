import { PrismaService } from "../../../../../prisma/prisma.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { MissionsAdminService } from "src/modules/v2/missions/admin/missions.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import IMetadata from "src/commons/contracts/IMetadata";
import { UsePrizeDto } from "./dto/use-prize.dto";
export declare class PrizesService {
    private readonly prismaService;
    private readonly clientService;
    private readonly missionService;
    constructor(prismaService: PrismaService, clientService: ClientService, missionService: MissionsAdminService);
    getMissions(query: PaginationDto): Promise<{
        result: {
            total_score: number;
            missions: any[];
        };
    }>;
    private checkMissionsForUser;
    calculateTimeDifference(loginDate: any, lastLoginDate: any): boolean;
    getPrizes(query: PaginationDto): Promise<{
        result: {
            total_score: number;
            prizes: (import("@prisma/client/runtime").GetResult<{
                id: number;
                title: string;
                description: string;
                point: number;
                thumbnail: string;
                url: string;
                status: string;
                created_at: Date;
                expired_at: Date;
                creator_id: number;
            }, unknown, never> & {})[];
            metadata: IMetadata;
        };
    }>;
    getHistoryOfScores(query: PaginationDto): Promise<{
        result: {
            total_score: number;
            history: (import("@prisma/client/runtime").GetResult<{
                id: number;
                title: string;
                score: number;
                type: string;
                action: string;
                client_id: number;
                created_at: Date;
            }, unknown, never> & {})[];
            metadata: IMetadata;
        };
    }>;
    getUserPrizes(query: PaginationDto): Promise<{
        result: {
            total_score: number;
            prizes: {
                id: number;
                coupon: string;
                point: number;
                thumbnail: string;
                url: string;
                title: string;
                description: string;
            }[];
            metadata: IMetadata;
        };
    }>;
    usePrize(body: UsePrizeDto): Promise<{
        status: number;
        id?: undefined;
        total_score?: undefined;
        coupon?: undefined;
    } | {
        id: number;
        total_score: number;
        coupon: string;
        status?: undefined;
    }>;
    findActivateMissions(): Promise<(import("@prisma/client/runtime").GetResult<{
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
    findActivatePrizes(offset: number, per_page: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        title: string;
        description: string;
        point: number;
        thumbnail: string;
        url: string;
        status: string;
        created_at: Date;
        expired_at: Date;
        creator_id: number;
    }, unknown, never> & {})[]>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
    private generateRedisKey;
}
