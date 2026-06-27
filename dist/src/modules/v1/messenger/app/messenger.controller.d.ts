import { MessengerService } from "./messenger.service";
import { CreateChatMessenger } from "./dto/create-chat.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetMyCHatsDto } from "./dto/get-my-chats.dto";
import MessengerAppTransformer from "./Transformer";
import { GetMessagesDto } from "./dto/get-messages.dto";
import MessengerGroupsTransformer from "../../messenger_groups/app/Transformer";
import MessengerChannelTransformer from "../../messenger_channels/app/Transformer";
export declare class MessengerController {
    private readonly messengerService;
    private readonly messengerTransformer;
    private readonly responsehandler;
    private readonly messengerGroupsTransformer;
    private readonly messengerChannelTransformer;
    constructor(messengerService: MessengerService, messengerTransformer: MessengerAppTransformer, responsehandler: HttpResponsehandler, messengerGroupsTransformer: MessengerGroupsTransformer, messengerChannelTransformer: MessengerChannelTransformer);
    storeChatRequest(createChatRealEstateDto: CreateChatMessenger, req: any, res: Response): Promise<any>;
    findMyChats(query: GetMyCHatsDto, req: any, res: Response): Promise<any>;
    findMessages(query: GetMessagesDto, req: any, res: Response): Promise<any>;
    AllDataInMessenger(req: any, res: Response): Promise<any>;
}
