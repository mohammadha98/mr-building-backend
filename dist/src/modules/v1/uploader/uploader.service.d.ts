import { CreateUploaderDto } from "./dto/create-uploader.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
export declare class UploaderService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    uploaderFile(body: CreateUploaderDto): Promise<{
        status: number;
        result?: undefined;
    } | {
        status: number;
        result: {
            file_name: string;
            file_type: string;
            source: string;
            file_url: string;
            path: string;
            size: number;
            length: number;
            thumbnail: string;
        };
    }>;
    private getDuration;
    private moveFile;
    renameSync(file_name: string, source: string, destination: string): void;
    mkdir(target: string): void;
    removeFile(file: string, target: string): Promise<boolean>;
    private getPath;
    private getFileUrl;
}
