import { HttpStatus } from "@nestjs/common";
import { AdminReportsDto } from "./dto/admin-reports.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { GetInActiveClients } from "./dto/getInActiveClients";
export declare class AdminReportsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    generateAdsReports(reportDto: AdminReportsDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            ads: {
                total: number;
                daily: any;
                weekly: any;
                monthly: any;
                yearly: any;
                period_count: number;
                data: any;
            };
        };
    }>;
    generateClientReports(reportDto: AdminReportsDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            clients: {
                total: number;
                daily: any;
                weekly: any;
                monthly: any;
                yearly: any;
                period_count: number;
                data: any;
            };
        };
    }>;
    generateRealEstateReports(reportDto: AdminReportsDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            real_estates: {
                total: number;
                daily: any;
                weekly: any;
                monthly: any;
                yearly: any;
                period_count: number;
                data: any;
            };
        };
    }>;
    getInActiveClients(body: GetInActiveClients): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            data: {
                id: number;
                name: string;
                surname: string;
                phone: string;
                last_login_time: Date;
            }[];
        };
    }>;
    private getInstallationStats;
    private getRealEstateAgentsStats;
    private getAdsStats;
    private generateCondition;
    private formattedStats;
    private generateDateForStats;
}
