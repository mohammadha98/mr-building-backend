import { PrismaService } from "../../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
export declare class EventRoomsService {
    private prisma;
    private readonly eventService;
    private readonly smsService;
    constructor(prisma: PrismaService);
    findAllMyOwnWebinars(query: PaginationDto): Promise<{
        status: number;
        client_info?: undefined;
        list?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        client_info: import("@prisma/client/runtime").GetResult<{
            id: number;
            uniqKey: string;
            name: string;
            email: string;
            phone: string;
            password: string;
            avatar: string;
            token: string;
            refresh_token: string;
            status: string;
            created_at: Date;
            updated_at: Date;
            creator_id: number;
        }, unknown, never> & {};
        list: (import("@prisma/client/runtime").GetResult<{
            id: number;
            webinar_id: number;
            owner_id: number;
            title: string;
            type: string;
            event_link: string;
            guest_count: number;
            tag: string;
            status: string;
            created_at: Date;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    findInvitedWebinars(room_id: number): Promise<(import("@prisma/client/runtime").GetResult<{
        id: number;
        client_id: number;
        userid: number;
        display_name: string;
        phone: string;
        role: string;
        event_room_id: number;
    }, unknown, never> & {})[]>;
    deleteRoom(data: DeleteEventRoomDto): Promise<{
        status: number;
    }>;
    webinarStatusInactived(data: DeleteEventRoomDto): Promise<{
        status: number;
    }>;
    private sendLoginInfo;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
