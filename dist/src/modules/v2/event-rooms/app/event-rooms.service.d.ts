import { CreateEventRoomDto } from "./dto/Create-event-room.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { UpdateEventRoomDto } from "./dto/update-event-room.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import { EventRoomPaginationDto } from "./dto/Event-room-pagination.dto";
import { Request, Response } from "express";
import EventRoomsTransformer from "./Transformer";
import { PrismaService } from "../../../../../prisma/prisma.service";
export declare class EventRoomsService {
    private request;
    private prisma;
    private readonly roomTransformer;
    private readonly eventService;
    private readonly smsService;
    constructor(request: Request, prisma: PrismaService, roomTransformer: EventRoomsTransformer);
    findAllMyOwnWebinars(): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: any;
            is_owner: boolean;
            title: any;
            type: any;
            tag: any;
            guest_count: any;
            event_link: any;
            status: any;
            created_at: any;
            login_info: {
                username: any;
                password: any;
            };
        }[];
    }>;
    findAllMyRooms(query: EventRoomPaginationDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            data: {
                id: any;
                is_owner: boolean;
                title: any;
                type: any;
                tag: any;
                guest_count: any;
                event_link: any;
                status: any;
                created_at: any;
                login_info: {
                    username: any;
                    password: any;
                };
            }[];
            metadata: IMetadata;
        };
    }>;
    findInvitedWebinars(room_id: number): Promise<{
        statusCode: number;
        message: string;
        data: {
            client_id: any;
            userid: any;
            display_name: any;
            phone: any;
            role: any;
        }[];
    }>;
    deleteWebinar(data: DeleteEventRoomDto): Promise<{
        statusCode: number;
        message: string;
        data: {};
    }>;
    webinarStatusInactived(data: DeleteEventRoomDto): Promise<{
        status: number;
    }>;
    updateWebinar(eventInfo: UpdateEventRoomDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: any;
            is_owner: boolean;
            title: any;
            type: any;
            tag: any;
            guest_count: any;
            event_link: any;
            status: any;
            created_at: any;
            login_info: {
                username: any;
                password: any;
            };
        };
    }>;
    store(createEventRoomDto: CreateEventRoomDto): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: any;
            is_owner: boolean;
            title: any;
            type: any;
            tag: any;
            guest_count: any;
            event_link: any;
            status: any;
            created_at: any;
            login_info: {
                username: any;
                password: any;
            };
        };
    }>;
    createNewWebinarInProvider(CreateWebinarDto: any): Promise<any>;
    addUserToEvent_teacherRole(event_id: number, users: any): Promise<any>;
    inviteContactToEventRoom(inviteContactDto: InviteContactDto, res: Response): Promise<Response<any, Record<string, any>>>;
    private generateSlug;
    private sendSmsIntoContacts;
    findOneByID(item_id: number): Promise<{
        id: number;
        title: string;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
