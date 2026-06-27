/// <reference types="multer" />
import { MessengerChannelsService } from "./messenger-channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MessageTransformer from "./Transformer";
import { GetChannelsMessagesDto } from "./dto/get-messages.dto";
import { UpdateChannelTypeDto } from "./dto/update-channel-type-channel.dto";
import { GetChannelsMembersDto } from "./dto/getMembers";
import { RequestVerifyChannelDto } from "./dto/request-verify-channel.dto";
export declare class MessengerChannelsController {
    private readonly messengerChannelService;
    private readonly messengerChannelTransformer;
    private readonly responsehandler;
    constructor(messengerChannelService: MessengerChannelsService, messengerChannelTransformer: MessageTransformer, responsehandler: HttpResponsehandler);
    createChannel(body: CreateChannelDto, req: any, res: Response, avatar: Express.Multer.File): Promise<any>;
    generateUsernameForChannel(channel_id: number, req: any, res: Response): Promise<any>;
    updateChannelType(body: UpdateChannelTypeDto, req: any, res: Response): Promise<any>;
    validateChannelLink(body: UpdateChannelTypeDto, req: any, res: Response): Promise<any>;
    channelsList(req: any, res: Response): Promise<any>;
    getChannelVerified(req: any, res: Response): Promise<any>;
    getMessages(query: GetChannelsMessagesDto, req: any, res: Response): Promise<any>;
    getMembers(query: GetChannelsMembersDto, req: any, res: Response): Promise<any>;
    channelInfo(username: string, req: any, res: Response): Promise<any>;
    requestToOfficialChannel(body: RequestVerifyChannelDto, req: any, res: Response): Promise<any>;
}
