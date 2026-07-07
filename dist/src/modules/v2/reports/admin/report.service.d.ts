import { PrismaService } from "../../../../../prisma/prisma.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { GetReportsViolationsDto } from "./dto/get-reports-violations.dto";
import { WebinarService } from "src/modules/v2/webinar/app/webinar.service";
import { EventRoomsService } from "src/modules/v2/event-rooms/app/event-rooms.service";
import { eventGroupsService } from "src/modules/v2/events/group/app/event-groups.service";
import { RealEstateAgentsService } from "src/modules/v2/real-estate-agents/admin/real-estate-agents.service";
import { RealEstateAgentsAdvisorsService } from "src/modules/v2/real-estate-agents-advisors/admin/real-estate-agents-advisors.service";
import { ChannelRealEstateService } from "src/modules/v2/channel-real-estate/app/channel-real-estate.service";
import { ChatRealEstateService } from "src/modules/v2/chat-real-estate/app/chat-real-estate.service";
import { RealEstateAdsService } from "src/modules/v2/real-estate-ads/admin/real-estate-ads.service";
export declare class ReportService {
    private readonly prismaService;
    private readonly webinarService;
    private readonly eventRoomsService;
    private readonly eventGroupsService;
    private readonly realEstateAgentsService;
    private readonly realEstateAdsService;
    private readonly realEstateAgentsAdvisorsService;
    private readonly channelRealEstateService;
    private readonly chatRealEstateService;
    constructor(prismaService: PrismaService, webinarService: WebinarService, eventRoomsService: EventRoomsService, eventGroupsService: eventGroupsService, realEstateAgentsService: RealEstateAgentsService, realEstateAdsService: RealEstateAdsService, realEstateAgentsAdvisorsService: RealEstateAgentsAdvisorsService, channelRealEstateService: ChannelRealEstateService, chatRealEstateService: ChatRealEstateService);
    getAll(query: PaginationDto): Promise<{
        status: number;
        list?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        list: {
            id: number;
            content: string;
            image: string;
            voice: string;
            type: string;
            created_at: Date;
            client: {
                id: number;
                name: string;
                surname: string;
                phone: string;
            };
        }[];
        metadata: IMetadata;
    }>;
    getAllViolations(query: GetReportsViolationsDto): Promise<{
        status: number;
        transformer?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        transformer: any;
        metadata: IMetadata;
    }>;
    reportViolationTransform(violations: any[], type: string): Promise<any>;
    getWebinarInfo(items: any[]): Promise<any[]>;
    getEventRoomInfo(items: any[]): Promise<any[]>;
    getEventGroupInfo(items: any[]): Promise<any[]>;
    getRealEstateAgentInfo(items: any[]): Promise<any[]>;
    getRealEstateAdsInfo(items: any[]): Promise<any[]>;
    getRealEstateAdvisorsInfo(items: any[]): Promise<any[]>;
    getRealEstateChannelsInfo(items: any[]): Promise<any[]>;
    getRealEstateChannelsMessagesInfo(items: any[]): Promise<any[]>;
    single(query: any): Promise<{
        status: number;
        item?: undefined;
    } | {
        status: number;
        item: {
            id: number;
            content: string;
            image: string;
            type: string;
            voice: string;
            created_at: Date;
            client: {
                id: number;
                name: string;
                surname: string;
                phone: string;
            };
        };
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
