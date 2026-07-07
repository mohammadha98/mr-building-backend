import { WebinarService } from "./webinar.service";
import { DeleteWebinarDto } from "./dto/delete-webinar.dto.ts";
import { InvitedClientsIntoWebinarDto } from "./dto/InvitedClientsIntoWebinarDto";
export declare class WebinarController {
    private readonly weninarService;
    private responsehandler;
    private webinarTransformer;
    constructor(weninarService: WebinarService);
    finWebinars(query: any, req: any, res: Response): Promise<any>;
    findInvitedWebinars(query: InvitedClientsIntoWebinarDto, res: Response): Promise<any>;
    deleteWebinar(deleteWebinarDto: DeleteWebinarDto, req: any, res: Response): Promise<any>;
}
