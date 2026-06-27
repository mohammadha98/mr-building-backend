import { HttpStatus } from "@nestjs/common";
import { CreateRealEstateAgentsCommentDto } from "./dto/create-real-estate-agents-comment.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
import RealEstateAgentsCommentsPostgresqlRepository from "../repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { RealEstateAgentsService } from "src/modules/v1/real-estate-agents/app/real-estate-agents.service";
import { GetCommentsListForRealEstateAgentDto } from "src/modules/v1/real-estate-agents/app/dto/get-list..dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { PublicMessage } from "src/commons/enums/messages";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { DeleteCommentDto } from "./dto/update-real-estate-agents-comment.dto";
export declare class RealEstateAgentsCommentsService {
    private readonly commentsPostgresqlRepository;
    private readonly agentsService;
    private readonly clientService;
    private readonly prismaService;
    constructor(commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository, agentsService: RealEstateAgentsService, clientService: ClientService, prismaService: PrismaService);
    storeComment(body: CreateRealEstateAgentsCommentDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: any;
    }>;
    findComments(query: GetCommentsListForRealEstateAgentDto): Promise<{
        status: number;
        result?: undefined;
        statistics?: undefined;
        user_comment?: undefined;
        comment_submitted?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: any[];
        statistics: {
            total_comments: number;
            total_score: any;
        };
        user_comment: any;
        comment_submitted: boolean;
        metadata: IMetadata;
    }>;
    deleteCommentForRealEstate(query: DeleteCommentDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {};
    }>;
    private calculateScore;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
