import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { ChangeStatusAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import RealEstateAdvisorTransformer from "./Transformer";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
export declare class RealEstateAgentsAdvisorsService {
    private readonly prismaService;
    private readonly realEstateAdvisorTransformer;
    constructor(prismaService: PrismaService, realEstateAdvisorTransformer: RealEstateAdvisorTransformer);
    findAll(query: GetRealEstateAgentsAdvisorsDto): Promise<{
        status: number;
        advisors?: undefined;
    } | {
        status: number;
        advisors: (import("@prisma/client/runtime").GetResult<{
            id: number;
            tracking_code: string;
            phone: string;
            validate_phone: boolean;
            avatar: string;
            status: string;
            score: number;
            total_score: number;
            biography: string;
            color: string;
            permissions: string[];
            comment_visibility: boolean;
            number_of_ads: number;
            total_customers: number;
            keywords: string[];
            client_id: number;
            real_estate_agent_id: number;
        }, unknown, never> & {})[];
    }>;
    changeStatus(query: ChangeStatusAdvisorsDto): Promise<{
        status: number;
    }>;
    private calculateScore;
    findComments(query: GetAdvisorCommentsDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: {
            id: number;
            comment: string;
            score: number;
            created_at: Date;
            status: string;
            real_estate_advisor: {
                id: number;
                client: {
                    name: string;
                    surname: string;
                };
            };
            client: {
                name: string;
                surname: string;
            };
        }[];
        metadata: IMetadata;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
    private generateRedisKey;
}
