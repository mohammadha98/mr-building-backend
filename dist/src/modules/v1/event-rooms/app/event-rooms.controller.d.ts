import { EventRoomsService } from "./event-rooms.service";
import { CreateEventRoomDto } from "./dto/Create-event-room.dto";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { UpdateEventRoomDto } from "./dto/update-event-room.dto";
import { InviteContactDto } from "./dto/InviteContactDto";
import { InvitedClientsIntoEventRoomDto } from "./dto/InvitedClientsInto-event-room.dto";
import { EventRoomPaginationDto } from "./dto/Event-room-pagination.dto";
import { Response } from "express";
export declare class EventRoomsController {
    private readonly weninarService;
    constructor(weninarService: EventRoomsService);
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
            metadata: import("../../../../commons/contracts/IMetadata").default;
        };
    }>;
    findInvitedWebinars(query: InvitedClientsIntoEventRoomDto): Promise<{
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
    deleteWebinar(deleteWebinarDto: DeleteEventRoomDto): Promise<{
        statusCode: number;
        message: string;
        data: {};
    }>;
    updateWbinar(updateWebinarDto: UpdateEventRoomDto): Promise<{
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
    inviteContactToEventRoom(inviteContactDto: InviteContactDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
