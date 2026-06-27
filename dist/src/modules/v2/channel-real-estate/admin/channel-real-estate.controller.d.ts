import { ChannelRealEstateService } from "./channel-real-estate.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MessageTransformer from "./Transformer";
import { PinnedChannelRealEstateDto } from "./dto/pinned-channel-real-estate.dto";
import { GetChannelsDto } from "./dto/get-channels-pagination..dto";
export declare class ChannelRealEstateController {
    private readonly channelRealEstateService;
    private readonly ChannelRealEstateTransformer;
    private readonly responsehandler;
    constructor(channelRealEstateService: ChannelRealEstateService, ChannelRealEstateTransformer: MessageTransformer, responsehandler: HttpResponsehandler);
    channelsList(query: GetChannelsDto, req: any, res: Response): Promise<any>;
    pinnedChannel(body: PinnedChannelRealEstateDto, req: any, res: Response): Promise<any>;
}
