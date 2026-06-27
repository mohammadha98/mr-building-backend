import { HttpStatus } from "@nestjs/common";
import { CreateRealEstateAgentDto } from "./dto/create-real-estate-agent.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { ListRealEstateAgentDto } from "./dto/list-real-estate-agent.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import RealEstateAgentsPostgresqlRepository from "../repositories/RealEstateAgentsPostgresqlRepository";
import { SearchForRealEstateAgentDto } from "./dto/search.real-estate-agents.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import { PublicMessage } from "src/commons/enums/messages";
import { MessengerChannelsService } from "../../messenger_channels/app/messenger-channels.service";
import RealEstateAgentsTransformer from "./Transformer";
export declare class RealEstateAgentsService {
    private readonly prismaService;
    private readonly realEstateAgentPostgresRepository;
    private readonly clientService;
    private readonly mailerService;
    private readonly messengerChannelsService;
    private readonly realEstateAgentsTransFormer;
    private readonly uploadService;
    constructor(prismaService: PrismaService, realEstateAgentPostgresRepository: RealEstateAgentsPostgresqlRepository, clientService: ClientService, mailerService: MailerService, messengerChannelsService: MessengerChannelsService, realEstateAgentsTransFormer: RealEstateAgentsTransformer);
    storeRequest(createRealEstateAgentDto: CreateRealEstateAgentDto, avatar: string | null, license: string | null): Promise<{
        status: number;
        response?: undefined;
    } | {
        status: number;
        response: {
            id: number;
            name: string;
            phone: string;
            validate_phone: boolean;
            avatar: string;
            license: string;
            license_status: string;
            status: string;
            score: number;
            published_count: number;
            number_of_ads: number;
            client_id: number;
            province: {
                id: number;
                name: string;
            };
            city: {
                id: number;
                name: string;
            };
            channels: {
                id: number;
                key: string;
            }[];
        };
    }>;
    private generateTrackingCode;
    listOfRealEstateAgents(query: ListRealEstateAgentDto, clientId: number): Promise<{
        list: any[];
        metadata: IMetadata;
    }>;
    getActiveRealEstates(query: ListRealEstateAgentDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {
            data: {
                id: any;
                client_id: any;
                name: any;
                phone: any;
                validate_phone: any;
                avatar: string;
                license: string;
                license_status: any;
                status: any;
                score: any;
                number_of_ads: any;
                province: any;
                city: any;
                channel: any;
            }[];
            metadata: {
                page: number;
                per_page: number;
                total_page: number;
                next: boolean;
                back: boolean;
            };
        };
    }>;
    GetRealEstateAgentInfo(agent_id: number, client_id: number): Promise<{
        list: any[];
    }>;
    search(query: SearchForRealEstateAgentDto): Promise<{
        list: any[];
        metadata: IMetadata;
    }>;
    findOne(id: number): Promise<any>;
    updateScore(where: any, data: any): Promise<any>;
    remove(id: number): string;
    private getUserPermittedAds;
    sendEmailForAdmins(): Promise<void>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
