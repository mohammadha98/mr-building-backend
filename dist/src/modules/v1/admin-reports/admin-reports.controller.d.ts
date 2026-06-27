import { AdminReportsService } from "./admin-reports.service";
import { AdminReportsDto } from "./dto/admin-reports.dto";
import { GetInActiveClients } from "./dto/getInActiveClients";
export declare class AdminReportsController {
    private readonly adminReportsService;
    constructor(adminReportsService: AdminReportsService);
    generateAdsReports(reportDto: AdminReportsDto): Promise<{
        statusCode: import("@nestjs/common").HttpStatus;
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
        statusCode: import("@nestjs/common").HttpStatus;
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
        statusCode: import("@nestjs/common").HttpStatus;
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
        statusCode: import("@nestjs/common").HttpStatus;
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
}
