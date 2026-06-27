import { CreatePrizeDto } from "./dto/create-mission.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { UsersService } from "src/modules/v2/users/admin/users.service";
import IMetadata from "src/commons/contracts/IMetadata";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusMissionDto } from "src/modules/v2/missions/admin/dto/change-status-mission.dto";
export declare class PrizesService {
    private readonly prismaService;
    private readonly userService;
    private readonly UploadService;
    constructor(prismaService: PrismaService, userService: UsersService);
    create(body: CreatePrizeDto): Promise<any>;
    getPrizes(query: PaginationDto): Promise<{
        prizes: {
            id: number;
            title: string;
            status: string;
            description: string;
            created_at: Date;
            thumbnail: string;
            point: number;
            url: string;
            coupons: {
                id: string;
                coupon: string;
                status: string;
            }[];
            creator_id: number;
            expired_at: Date;
        }[];
        metadata: IMetadata;
    }>;
    changeStatus(body: ChangeStatusMissionDto): Promise<void>;
    deletePrize(body: any): Promise<void>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
