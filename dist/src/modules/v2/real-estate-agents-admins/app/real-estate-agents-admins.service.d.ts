import { CreateRealEstateAgentsAdminDto } from "./dto/create-real-estate-agents-admin.dto";
import { ValidateRealEstateAgentsAdvisorDto } from "./dto/validate-real-estate-agents-advisor.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v2/client/app/client.service";
import { GetRealEstateAgentsAdminsDto } from "./dto/get-real-estate-agents-admins.dto";
import { ChangeStatusRealEstateAdminsAdminsDto } from "./dto/change-status-real-estate-agents-admins.dto";
import { DeleteRealEstateAgentsAdminsDto } from "./dto/delete-real-estate-agents-admin.dto";
import { Cache } from "cache-manager";
import RealEstateAdminTransformer from "./Transformer";
import { UpdateAdminPermissionsDto } from "./dto/update-admin-permisions";
import SmsService from "src/modules/services/notifications/sms/SmsService";
export declare class RealEstateAgentsAdminsService {
    private cacheManager;
    private readonly prismaService;
    private readonly realEstateAdminTransformer;
    private readonly clientService;
    private smsService;
    constructor(cacheManager: Cache, prismaService: PrismaService, realEstateAdminTransformer: RealEstateAdminTransformer, clientService: ClientService, smsService: SmsService);
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
    create(body: CreateRealEstateAgentsAdminDto): Promise<{
        status: number;
        result?: undefined;
        admin?: undefined;
        transform?: undefined;
    } | {
        status: number;
        result: string;
        admin?: undefined;
        transform?: undefined;
    } | {
        status: number;
        result: string;
        admin: {
            id: number;
            name: string;
            surname: string;
            phone: string;
        };
        transform?: undefined;
    } | {
        status: number;
        result: string;
        transform: {
            permissions: any;
            agent_id: any;
            agent_name: any;
            agent_number_of_ads: any;
            agent_score: any;
            agent_avatar: string;
            province: any;
            color: any;
            name: string;
            phone: any;
            id: any;
        };
        admin?: undefined;
    }>;
    findAll(query: GetRealEstateAgentsAdminsDto): Promise<{
        status: number;
        admins?: undefined;
    } | {
        status: number;
        admins: any;
    }>;
    changeStatus(body: ChangeStatusRealEstateAdminsAdminsDto): Promise<{
        status: number;
    }>;
    updatePermissions(body: UpdateAdminPermissionsDto): Promise<{
        status: number;
    }>;
    removeAdmin(body: DeleteRealEstateAgentsAdminsDto): Promise<{
        status: number;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
    private generateRedisKey;
}
