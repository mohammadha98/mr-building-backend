import { HttpStatus } from "@nestjs/common";
import { CreateRealEstateAgentsAdvisorDto, UpdatePermissionsForAdvisorDto } from "./dto/create-real-estate-agents-advisor.dto";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { GetRealEstateAgentsAdvisorsDto } from "./dto/get-real-estate-agents-advisors.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { ChangeStatusRealEstateAgentsAdvisorsDto } from "./dto/change-status-real-estate-agents-advisors.dto";
import { DeleteRealEstateAgentsAdvisorsDto } from "./dto/delete-real-estate-agents-advisors.dto";
import { Cache } from "cache-manager";
import RealEstateAdvisorTransformer from "./Transformer";
import { CreateActiveAreaAdvisorDto } from "./dto/create-active-area-advisor.dto";
import { DeleteActiveAreaAdvisorDto } from "./dto/delete-active-area-advisor.dto";
import { GetActiveAreasAdvisorDto } from "./dto/get-active-areas-advisor.dto";
import { DeleteFilteredWordAdvisorDto } from "./dto/delete-filtered-word-advisor.dto";
import { CreateAdvisorCommentDto } from "./dto/create-advisor-comment.dto";
import { GetAdvisorCommentsDto } from "./dto/get-advisor-comments..dto";
import { SaveAdvisorSettingDto } from "./dto/save-advisor-settings..dto";
import { UpdateAdvisorProfileDto } from "./dto/update-profile.dto";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import { PublicMessage } from "src/commons/enums/messages";
import { DeleteCommentDto } from "../../real-estate-agents-comments/app/dto/update-real-estate-agents-comment.dto";
export declare class RealEstateAgentsAdvisorsService {
    private cacheManager;
    private readonly prismaService;
    private readonly realEstateAdvisorTransformer;
    private readonly clientService;
    private smsService;
    constructor(cacheManager: Cache, prismaService: PrismaService, realEstateAdvisorTransformer: RealEstateAdvisorTransformer, clientService: ClientService, smsService: SmsService);
    validate(body: ValidateRealEstateAgentsAdvisorDto): Promise<{
        status: number;
        result?: undefined;
        user?: undefined;
    } | {
        status: number;
        result: string;
        user: {
            id: number;
            name: string;
            surname: string;
            phone: string;
        };
    }>;
    storeActiveArea(body: CreateActiveAreaAdvisorDto): Promise<{
        status: number;
        active_areas?: undefined;
    } | {
        status: number;
        active_areas: {
            id: number;
            title: string;
        }[];
    }>;
    storeFilteredWord(body: CreateActiveAreaAdvisorDto): Promise<{
        status: number;
        filtered_words?: undefined;
    } | {
        status: number;
        filtered_words: {
            id: number;
            title: string;
        }[];
    }>;
    removeActiveArea(body: DeleteActiveAreaAdvisorDto): Promise<{
        status: number;
    }>;
    removeFilteredWord(body: DeleteFilteredWordAdvisorDto): Promise<{
        status: number;
    }>;
    getActiveAreas(query: GetActiveAreasAdvisorDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: (import("@prisma/client/runtime").GetResult<{
            id: number;
            title: string;
            advisor_id: number;
        }, unknown, never> & {})[];
    }>;
    getFilteredWords(query: GetActiveAreasAdvisorDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: (import("@prisma/client/runtime").GetResult<{
            id: number;
            title: string;
            advisor_id: number;
        }, unknown, never> & {})[];
    }>;
    create(body: CreateRealEstateAgentsAdvisorDto): Promise<{
        status: number;
        result?: undefined;
        advisor?: undefined;
    } | {
        status: number;
        result: string;
        advisor?: undefined;
    } | {
        status: number;
        result: string;
        advisor: {
            id: number;
        };
    }>;
    updatePermissions(body: UpdatePermissionsForAdvisorDto): Promise<{
        statusCode: number;
        message: PublicMessage;
    }>;
    findAll(query: GetRealEstateAgentsAdvisorsDto): Promise<{
        status: number;
        advisors?: undefined;
    } | {
        status: number;
        advisors: any;
    }>;
    changeStatus(body: ChangeStatusRealEstateAgentsAdvisorsDto): Promise<{
        status: number;
    }>;
    removeAdvisor(body: DeleteRealEstateAgentsAdvisorsDto): Promise<{
        status: number;
    }>;
    removeAdvisorInRealEstate(body: DeleteRealEstateAgentsAdvisorsDto): Promise<{
        status: number;
        realEstateTrackingCode?: undefined;
    } | {
        status: number;
        realEstateTrackingCode: string;
    }>;
    storeComment(body: CreateAdvisorCommentDto): Promise<{
        status: number;
        result?: undefined;
        is_blocked?: undefined;
    } | {
        status: number;
        result: {
            id: number;
            comment: string;
            score: number;
            status: string;
            created_at: Date;
            client: {
                id: number;
                name: string;
                surname: string;
            };
        };
        is_blocked?: undefined;
    } | {
        status: number;
        result: any;
        is_blocked: boolean;
    }>;
    private filteredComment;
    findComments(query: GetAdvisorCommentsDto): Promise<{
        status: number;
        result?: undefined;
        statistics?: undefined;
        user_comment?: undefined;
        comment_submitted?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        result: {
            id: number;
            comment: string;
            score: number;
            created_at: Date;
            status: string;
            client: {
                id: number;
                name: string;
                surname: string;
            };
        }[];
        statistics: {
            total_comments: number;
            total_score: number;
        };
        user_comment: {
            id: number;
            comment: string;
            score: number;
            created_at: Date;
            status: string;
            client: {
                id: number;
                name: string;
                surname: string;
            };
        };
        comment_submitted: boolean;
        metadata: IMetadata;
    }>;
    deleteCommentForAdvisor(query: DeleteCommentDto): Promise<{
        statusCode: HttpStatus;
        message: PublicMessage;
        data: {};
    }>;
    saveSettings(body: SaveAdvisorSettingDto): Promise<{
        status: number;
    }>;
    updateProfile(body: UpdateAdvisorProfileDto): Promise<{
        status: number;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
    private generateRedisKey;
}
