import { CreateReferralCodeDto } from "./dto/create-referal-code.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetUsersReferralCodeDto } from "./dto/get-users-referal-code.dto";
import { getDetailsReferralCodeDto } from "./dto/getDetails.dto";
import { ReferralCodes } from "@prisma/client";
export declare class ReferralCodeService {
    private readonly prismaService;
    private readonly clientService;
    constructor(prismaService: PrismaService, clientService: ClientService);
    create(body: CreateReferralCodeDto): Promise<{
        status: number;
        message?: undefined;
    } | {
        status: number;
        message: string;
    }>;
    private saveMissionForNewClient;
    private saveMissionForSubcategoryRegistration;
    getMyUser(query: GetUsersReferralCodeDto): Promise<{
        status: number;
        clients?: undefined;
        score?: undefined;
    } | {
        status: number;
        clients: {
            client_id: any;
            client_name: string;
            client_phone: any;
            client_roles: any;
            referral_code: string;
            referral_id: number;
            number_of_sub_categories: number;
        }[];
        score: number;
    }>;
    getReferralDetails(query: getDetailsReferralCodeDto): Promise<{
        status: number;
        total?: undefined;
        point?: undefined;
    } | {
        status: number;
        total: {
            clients: number;
            estate_agent: number;
            advisor: number;
            admin: number;
            operator_estate_agent: number;
        };
        point: number;
    }>;
    private getSubSystemReferralCode;
    private getTotalUsedMyReferralCode;
    getReferralCodeForClient(client_id: number): Promise<ReferralCodes | boolean>;
    saveReferralCodeForCLient(client_id: number): Promise<string | false>;
    updateCodes(): Promise<{
        status: number;
    }>;
    private generateReferralCode;
}
