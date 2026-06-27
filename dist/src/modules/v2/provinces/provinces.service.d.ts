import { UpdateProvinceDto } from "./dto/update-province.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
export declare class ProvincesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(): string;
    findAll(): Promise<{
        id: number;
        name: string;
        cities: {
            id: number;
            name: string;
        }[];
    }[]>;
    findProvinces(): Promise<{
        id: number;
        name: string;
    }[]>;
    update(id: number, updateProvinceDto: UpdateProvinceDto): string;
    remove(id: number): string;
}
