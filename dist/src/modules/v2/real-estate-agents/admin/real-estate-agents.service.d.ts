import { ClientService } from "src/modules/v2/client/admin/client.service";
import statuses from "src/commons/contracts/Statuses";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { RealEstateAgentChangeStatusDto } from "./dto/real-estate-change-change-status.dtop";
import RealEstateAgentsPostgresqlRepository from "../repositories/RealEstateAgentsPostgresqlRepository";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v2/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { ChannelRealEstateService } from "src/modules/v2/channel-real-estate/app/channel-real-estate.service";
import { PrismaService } from "../../../../../prisma/prisma.service";
import RealEstateAdsPostgresqlRepository from "../../real-estate-ads/repositories/RealEstateAdsPostgresqlRepository";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { DeleteRealEstateAgentsAdvisorsDto } from "../../real-estate-agents-advisors/app/dto/delete-real-estate-agents-advisors.dto";
import { PublicMessage } from "src/commons/enums/messages";
import { MessengerChannelsService } from "../../messenger_channels/app/messenger-channels.service";
export declare class RealEstateAgentsService {
    private readonly prismaService;
    private readonly realEstateAgentPostgresRepository;
    private readonly commentsPostgresqlRepository;
    private readonly clientService;
    private readonly channelRealEstateService;
    private readonly realEstateAdsPostgresqlRepository;
    private readonly messengerChannelsService;
    private readonly smsService;
    private readonly uploadService;
    constructor(prismaService: PrismaService, realEstateAgentPostgresRepository: RealEstateAgentsPostgresqlRepository, commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository, clientService: ClientService, channelRealEstateService: ChannelRealEstateService, realEstateAdsPostgresqlRepository: RealEstateAdsPostgresqlRepository, messengerChannelsService: MessengerChannelsService);
    listOfRealEstateAgents(query: ListRealEstateAgentDto): Promise<{
        status: number;
        list: {
            id: number;
            name: string;
            avatar: string;
            license: string;
            license_status: string;
            status: string;
            score: number;
            published_count: number;
            client_id: number;
            province: {
                id: number;
                name: string;
            };
            city: {
                id: number;
                name: string;
            };
            client: {
                id: number;
                name: string;
                surname: string;
                phone: string;
            };
            created_at: Date;
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        list?: undefined;
        metadata?: undefined;
    }>;
    changeStatus(query: RealEstateAgentChangeStatusDto): Promise<{
        status: number;
        client_status: statuses.active | statuses.inactive;
        license_status: statuses.approved | statuses.rejected;
    } | {
        status: number;
        client_status?: undefined;
        license_status?: undefined;
    }>;
    private createChannelForRealEstate;
    CreateChannelForOldRealEstates_test(): Promise<void>;
    findOneByID(item_id: number): Promise<{
        id: number;
        name: string;
    }>;
    findAds(agent_id: number, query: PaginationDto): Promise<{
        status: number;
        result?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: any[];
        metadata: IMetadata;
    }>;
    findAdvisors(agent_id: number): Promise<{
        status: number;
        advisors?: undefined;
    } | {
        status: number;
        advisors: {
            id: number;
            number_of_ads: number;
            total_customers: number;
            score: number;
            biography: string;
            comment_visibility: boolean;
            avatar: string;
            status: string;
            permissions: string[];
            phone: string;
            validate_phone: boolean;
            client: {
                id: number;
                name: string;
                surname: string;
                phone: string;
            };
            real_estate_agent: {
                id: number;
                name: string;
                score: number;
            };
        }[];
    }>;
    findAdmins(agent_id: number): Promise<{
        status: number;
        admins?: undefined;
    } | {
        status: number;
        admins: {
            id: number;
            permissions: string[];
            color: string;
            client: {
                id: number;
                name: string;
                surname: string;
                phone: string;
                status: string;
            };
            real_estate_agent: {
                id: number;
                name: string;
                avatar: string;
                number_of_ads: number;
                score: number;
                province: {
                    name: string;
                };
            };
        }[];
    }>;
    findAllComments(agent_id: number, query: PaginationDto): Promise<{
        status: number;
        result: any[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    makeTrackingCode(): Promise<{
        status: number;
    }>;
    private generateTrackingCode;
    private getAdOwnerInfo;
    removeAdvisorInRealEstate(body: DeleteRealEstateAgentsAdvisorsDto): Promise<{
        statusCode: number;
        message: PublicMessage;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
