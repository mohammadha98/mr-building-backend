import { CreateBinstaDto } from "./dto/create-binsta.dto";
import { UpdateBinstaDto } from "./dto/update-binsta.dto";
import { ValidateUsernameBinstaDto } from "./dto/validate-username.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v1//client/app/client.service";
export declare class BinstaService {
    private readonly prismaService;
    private readonly clientService;
    constructor(prismaService: PrismaService, clientService: ClientService);
    validateUsername(body: ValidateUsernameBinstaDto): Promise<{
        status: number;
    }>;
    create(createBinstaDto: CreateBinstaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBinstaDto: UpdateBinstaDto): string;
    remove(id: number): string;
}
