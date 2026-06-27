import { CreateReportBugDto } from "./dto/create-report-bugs.dto";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { CreateReportViolationDto } from "./dto/create-report-violation.dto";
import { ClientService } from "src/modules/v1/client/app/client.service";
export declare class ReportsService {
    private readonly prismaService;
    private readonly clientService;
    constructor(prismaService: PrismaService, clientService: ClientService);
    storeBug(body: CreateReportBugDto): Promise<{
        status: number;
    }>;
    storeViolation(body: CreateReportViolationDto): Promise<{
        status: number;
    }>;
}
