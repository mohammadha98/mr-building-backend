import { HttpStatus } from "@nestjs/common";
import IMetadata from "src/commons/contracts/IMetadata";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import MailerService from "src/modules/services/notifications/mailer/mailerService";
import BackupTransformer from "./Transformer";
import { PublicMessage } from "src/commons/enums/messages";
import { Request } from "express";
export declare class DbBackupService {
    private request;
    private readonly prismaService;
    private readonly mailerService;
    private readonly backupTransFormer;
    constructor(request: Request, prismaService: PrismaService, mailerService: MailerService, backupTransFormer: BackupTransformer);
    saveBackup(): Promise<{
        status: HttpStatus;
        message: PublicMessage;
        data: {
            id: any;
            link: string;
            created_at: string;
        };
    }>;
    private executeCommand;
    getBackupList(query: PaginationDto): Promise<{
        status: number;
        result: {
            id: string;
            filename: string;
            createdAt: Date;
            userId: number;
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        result?: undefined;
        metadata?: undefined;
    }>;
    createZipPublicDir(user_id: number): Promise<{
        status: any;
        result: any;
    } | {
        status: number;
        result?: undefined;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
