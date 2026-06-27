import { ChatRealEstateService } from "./chat-real-estate.service";
import { CreateChatRealEstateDto } from "./dto/create-chat-real-estate.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { GetChatRealEstateDto } from "./dto/get-chat-real-estate.dto";
import MessageTransformer from "./Transformer";
import { GetMessagesChatRealEstateDto } from "./dto/get-messages-chat-real-estate.dto";
export declare class ChatRealEstateController {
    private readonly chatRealEstateService;
    private readonly chatRealEstateTransformer;
    private readonly responsehandler;
    constructor(chatRealEstateService: ChatRealEstateService, chatRealEstateTransformer: MessageTransformer, responsehandler: HttpResponsehandler);
    storeChatRequest(createChatRealEstateDto: CreateChatRealEstateDto, req: any, res: Response): Promise<any>;
    findMyChats(query: GetChatRealEstateDto, req: any, res: Response): Promise<any>;
    findMessages(query: GetMessagesChatRealEstateDto, req: any, res: Response): Promise<any>;
}
