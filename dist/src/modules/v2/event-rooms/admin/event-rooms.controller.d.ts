import { EventRoomsService } from "./event-rooms.service";
import { DeleteEventRoomDto } from "./dto/delete-event-rooms.dto.ts";
import { InvitedClientsIntoEventRoomDto } from "./dto/InvitedClientsInto-event-room.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
export declare class EventRoomsController {
    private readonly weninarService;
    private responsehandler;
    private roomTransformer;
    private eventService;
    constructor(weninarService: EventRoomsService);
    findAllMyOwnWebinars(query: PaginationDto, req: any, res: Response): Promise<any>;
    findInvitedWebinars(query: InvitedClientsIntoEventRoomDto, res: Response): Promise<any>;
    deleteWebinar(deleteWebinarDto: DeleteEventRoomDto, req: any, res: Response): Promise<any>;
}
