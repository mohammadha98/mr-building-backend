import { PrismaService } from "../../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import { DeleteWebinarDto } from "./dto/delete-webinar.dto.ts";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
export declare class WebinarService {
    private prisma;
    private readonly eventService;
    constructor(prisma: PrismaService);
    findAllWebinars(pagination: PaginationDto): Promise<{
        webinars: (import("@prisma/client/runtime").GetResult<{
            id: number;
            webinar_id: number;
            owner_id: number;
            title: string;
            description: string;
            type: string;
            event_link: string;
            proceeding: string;
            tag: string;
            status: string;
            start_by_admin: number;
            is_unlimited: number;
            guest_count: number;
            guest_access: number;
            created_at: Date;
            started_at: string;
            start_time: string;
            end_time: string;
            year: number;
            month: number;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    findAllMyWebinars(pagination: PaginationDto): Promise<{
        webinars: (import("@prisma/client/runtime").GetResult<{
            id: number;
            webinar_id: number;
            owner_id: number;
            title: string;
            description: string;
            type: string;
            event_link: string;
            proceeding: string;
            tag: string;
            status: string;
            start_by_admin: number;
            is_unlimited: number;
            guest_count: number;
            guest_access: number;
            created_at: Date;
            started_at: string;
            start_time: string;
            end_time: string;
            year: number;
            month: number;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    findInvitedWebinars(webinar_id: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        client_id: number;
        userid: number;
        display_name: string;
        phone: string;
        role: string;
        webinar_id: number;
    }, unknown, never> & {})[]>;
    deleteWebinar(data: DeleteWebinarDto): Promise<{
        status: number;
    }>;
    private generateSlug;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
