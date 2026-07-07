/// <reference types="multer" />
import { ClientService } from "./client.service";
import { UpdateClientDto } from "./dto/update-client.dto";
import ClientTransformer from "./Transformer";
import { DisableUpdateStatus } from "./dto/disbale-update-status";
import { SaveGifClientDto } from "./dto/save-gif-client.dto";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { UpdateClienProfiletDto } from "./dto/update-profile.dto";
export declare class ClientController {
    private readonly clientService;
    private readonly clientTransformer;
    private responsehandler;
    constructor(clientService: ClientService, clientTransformer: ClientTransformer);
    clientInfo(req: any, res: Response): Promise<any>;
    disableUpdateStatus(item_id: number, req: any, res: Response): Promise<any>;
    disableUpdateStatusMain(query: DisableUpdateStatus, req: any, res: Response): Promise<any>;
    update(updateClientDto: UpdateClientDto, request: any, response: any): Promise<any>;
    updateClienProfile(body: UpdateClienProfiletDto, request: any, response: any, file: Express.Multer.File): Promise<any>;
    saveGif(body: SaveGifClientDto, request: any, response: any, file: Express.Multer.File): Promise<any>;
    findMyChats(query: PaginationDto, req: any, res: Response): Promise<any>;
}
