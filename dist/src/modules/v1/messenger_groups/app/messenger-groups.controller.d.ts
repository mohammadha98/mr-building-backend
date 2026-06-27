/// <reference types="multer" />
import { MessengerGroupsService } from "./messenger-groups.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import MessageTransformer from "./Transformer";
import { GetGroupsMessagesDto } from "./dto/get-messages.dto";
import { UpdateGroupTypeDto } from "./dto/update-group-type.dto";
import { GetGroupMembersDto } from "./dto/getMembers";
export declare class MessengerGroupsController {
    private readonly messengerGroupsService;
    private readonly messengerGroupsTransformer;
    private readonly responsehandler;
    constructor(messengerGroupsService: MessengerGroupsService, messengerGroupsTransformer: MessageTransformer, responsehandler: HttpResponsehandler);
    createGroup(body: CreateGroupDto, req: any, res: Response, avatar: Express.Multer.File): Promise<any>;
    generateUsernameForGroup(group_id: number, req: any, res: Response): Promise<any>;
    updateGroupType(body: UpdateGroupTypeDto, req: any, res: Response): Promise<any>;
    validateGroupLink(body: UpdateGroupTypeDto, req: any, res: Response): Promise<any>;
    GroupsList(req: any, res: Response): Promise<any>;
    getMessages(query: GetGroupsMessagesDto, req: any, res: Response): Promise<any>;
    getMembers(query: GetGroupMembersDto, req: any, res: Response): Promise<any>;
    groupInfo(username: string, req: any, res: Response): Promise<any>;
}
