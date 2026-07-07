import { ChangeStatusDto } from "./dto/change-status.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import UserPrismaRepository from "src/modules/v2//users/admin/repositories/UserPrismaRepository";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { RemoveDto } from "./dto/remove.dto";
import { CreateForceUpdateDto } from "./dto/create-forceupdate.dto";
import { ClientService } from "src/modules/v2//client/app/client.service";
import FcmNotificationService from "src/modules/services/notifications/fcm/FcmNotificationService";
export declare class ForceUpdateService {
    private readonly prismaService;
    private readonly clientService;
    private readonly userPrismaRepository;
    private readonly fcmNotificationService;
    constructor(prismaService: PrismaService, clientService: ClientService, userPrismaRepository: UserPrismaRepository, fcmNotificationService: FcmNotificationService);
    changeStatus(body: ChangeStatusDto): Promise<{
        status: number;
        message?: undefined;
    } | {
        status: number;
        message: string;
    }>;
    findAll(query: PaginationDto): Promise<{
        status: number;
        result?: undefined;
        total_clients?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: (import("@prisma/client/runtime").GetResult<{
            id: number;
            installed_version_type: string;
            title: string;
            items: string[];
            content: string;
            file_name: string;
            indirect_link: string;
            version: string;
            required: boolean;
            status: string;
            total_installs: number;
            user_id: number;
            created_at: Date;
        }, unknown, never> & {})[];
        total_clients: number;
        metadata: IMetadata;
    }>;
    storeForceUpdate(body: CreateForceUpdateDto): Promise<{
        status: number;
        result?: undefined;
        total_clients?: undefined;
    } | {
        status: number;
        result: {
            id: number;
            required: boolean;
            installed_version_type: string;
            version: string;
            file_name: string;
            indirect_link: string;
            total_installs: number;
            status: string;
            content: string;
            items: string[];
        };
        total_clients: number;
    }>;
    remove(body: RemoveDto): Promise<{
        status: number;
        message?: undefined;
    } | {
        status: number;
        message: string;
    }>;
    private makeUpdateCondition;
    removeFileFromStorage(file_name: string, destination: string): Promise<boolean>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
