import { ChannelRealEstateService } from "./channel-real-estate.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MessageTransformer from "./Transformer";
import { GetMessagesChannelRealEstateDto } from "./dto/get-messages-channel-real-estate.dto";
import { JoinChannelRealEstateDto } from "./dto/join-channel-real-estate.dto";
import { StoreMessageChannelRealEstateDto } from "./dto/store-message-channel-real-estate.dto";
export declare class ChannelRealEstateController {
    private readonly channelRealEstateService;
    private readonly ChannelRealEstateTransformer;
    private readonly responsehandler;
    constructor(channelRealEstateService: ChannelRealEstateService, ChannelRealEstateTransformer: MessageTransformer, responsehandler: HttpResponsehandler);
    joinChannel(body: JoinChannelRealEstateDto, req: any, res: Response): Promise<any>;
    leaveChannel(body: JoinChannelRealEstateDto, req: any, res: Response): Promise<any>;
    channelsList(req: any, res: Response): Promise<any>;
    getMessages(query: GetMessagesChannelRealEstateDto, req: any, res: Response): Promise<any>;
    storeNewMessage(body: StoreMessageChannelRealEstateDto, req: any, res: Response): Promise<any>;
}
