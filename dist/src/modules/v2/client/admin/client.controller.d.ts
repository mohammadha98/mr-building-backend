import { ClientService } from "./client.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { CreateOperatorRealEstateAgentDto } from "./dto/create-operator-real-estate-agent";
import ReportsTransformer from "../../reports/admin/Transformer";
import { ClientReportsPaginationDto } from "./dto/Client-Reports-Pagination.dto";
import PrizesTransformer from "../../prizes/app/transformer";
import RealEstateAdsTransformer from "../../real-estate-ads/admin/Transformer";
export declare class ClientController {
    private readonly clientService;
    private readonly reportsTransformer;
    private readonly prizesTransformer;
    private readonly realEstateAdsTransformer;
    private responsehandler;
    private clientTransformer;
    constructor(clientService: ClientService, reportsTransformer: ReportsTransformer, prizesTransformer: PrizesTransformer, realEstateAdsTransformer: RealEstateAdsTransformer);
    findOne(client_id: number, req: any, res: Response): Promise<any>;
    clientList(queryDto: PaginationDto, request: any, response: any): Promise<any>;
    getPublicOperators(queryDto: PaginationDto, request: any, response: any): Promise<any>;
    saveNewPublicOperators(body: CreateOperatorRealEstateAgentDto, request: any, response: any): Promise<any>;
    deletePublicOperators(client_id: number, request: any, response: any): Promise<any>;
    generateKeyForClients(request: any, response: any): Promise<any>;
    getAllReports(query: ClientReportsPaginationDto, req: any, res: Response): Promise<any>;
    getAllPrizes(client_id: string, query: PaginationDto, req: any, res: Response): Promise<any>;
    getHistoryOfScores(client_id: string, query: PaginationDto, req: any, res: Response): Promise<any>;
    findAds(client_id: number, query: PaginationDto, req: any, res: Response): Promise<any>;
}
