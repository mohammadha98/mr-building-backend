import { UpdateRealEstateAgentsCommentDto } from "./dto/update-real-estate-agents-comment.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
import RealEstateAgentsCommentsPostgresqlRepository from "../repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { RealEstateAgentsService } from "src/modules/v1/real-estate-agents/app/real-estate-agents.service";
import { ChangeStatusCommentAgentDto } from "./dto/change-status.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import UserPrismaRepository from "src/modules/v1/users/admin/repositories/UserPrismaRepository";
import { GetCommentsListForRealEstateAgentDto } from "./dto/get-list..dto copy";
export declare class RealEstateAgentsCommentsService {
    private readonly commentsPostgresqlRepository;
    private readonly agentsService;
    private readonly clientService;
    private readonly userPrismaRepository;
    constructor(commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository, agentsService: RealEstateAgentsService, clientService: ClientService, userPrismaRepository: UserPrismaRepository);
    changeStatus(body: ChangeStatusCommentAgentDto): Promise<{
        status: number;
    }>;
    findAllComments(query: GetCommentsListForRealEstateAgentDto): Promise<{
        status: number;
        result: any[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    findOne(id: number): Promise<string>;
    update(id: number, updateRealEstateAgentsCommentDto: UpdateRealEstateAgentsCommentDto): Promise<string>;
    remove(id: number): Promise<string>;
    private calculateScore;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
