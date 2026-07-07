import { CreateEventGroupDto } from "./dto/Create-event-group.dto";
import { DeleteEventGroupDto } from "./dto/delete-event-groupdto.ts";
import { EventGroupPaginationDto } from "./dto/Event-group-pagination.dto";
import { eventGroupsService } from "./event-groups.service";
export declare class EventsGroupController {
    private readonly groupsService;
    private responsehandler;
    private Transformer;
    private eventService;
    constructor(groupsService: eventGroupsService);
    store(createEventGroupDto: CreateEventGroupDto, req: any, res: Response): Promise<void>;
    findAllMys(query: EventGroupPaginationDto, req: any, res: Response): Promise<any>;
    deleteWebinar(group_id: DeleteEventGroupDto, req: any, res: Response): Promise<any>;
}
