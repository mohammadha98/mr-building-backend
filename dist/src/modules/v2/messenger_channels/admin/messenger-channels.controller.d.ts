import { MessengerChannelsService } from "./messenger-channels.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MessageTransformer from "./Transformer";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ChangeStatusRequestVerifyDto } from "./dto/changeStatus-request-verify.dto";
export declare class MessengerChannelsController {
    private readonly messengerChannelService;
    private readonly messengerChannelTransformer;
    private readonly responsehandler;
    constructor(messengerChannelService: MessengerChannelsService, messengerChannelTransformer: MessageTransformer, responsehandler: HttpResponsehandler);
    channelsList(query: PaginationDto, req: any, res: Response): Promise<any>;
    getChannelVerified(query: PaginationDto, req: any, res: Response): Promise<any>;
    changeStatusRequests(body: ChangeStatusRequestVerifyDto, req: any, res: Response): Promise<any>;
    getMessages(query: GetChannelsMessagesDto, req: any, res: Response): Promise<any>;
    getMembers(query: GetChannelsMembersDto, req: any, res: Response): Promise<any>;
    channelInfo(username: string, req: any, res: Response): Promise<any>;
}
