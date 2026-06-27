import { ClientService } from "src/modules/v1/client/admin/client.service";
import statuses from "src/commons/contracts/Statuses";
import { ListStorefrontsDto } from "./dto/list-storefronts.dto";
import IMetadata from "src/commons/contracts/IMetadata";
import { RealEstateAgentChangeStatusDto } from "./dto/storefront-change-status.dtop";
import StorefrontPostgresqlRepository from "../repositories/StorefrontPostgresqlRepository";
import RealEstateAgentsCommentsPostgresqlRepository from "src/modules/v1/real-estate-agents-comments/repositories/RealEstateAgentsCommentsPostgresqlRepository";
import { PrismaService } from "../../../../../prisma/prisma.service";
import { GetProductDto } from "../app/dto/get-product.dto";
export declare class StorefrontService {
    private readonly prismaService;
    private readonly storefrontsPostgresRepository;
    private readonly commentsPostgresqlRepository;
    private readonly clientService;
    private readonly smsService;
    constructor(prismaService: PrismaService, storefrontsPostgresRepository: StorefrontPostgresqlRepository, commentsPostgresqlRepository: RealEstateAgentsCommentsPostgresqlRepository, clientService: ClientService);
    listOfStorefronts(query: ListStorefrontsDto): Promise<{
        status: number;
        list: {
            id: string;
            name: string;
            description: string;
            avatar: string;
            license: string;
            license_status: string;
            status: string;
            score: number;
            number_of_sales: number;
            number_of_products: number;
            client_id: number;
            created_at: Date;
            province: {
                id: number;
                name: string;
            };
            city: {
                id: number;
                name: string;
            };
            client: {
                id: number;
                name: string;
                surname: string;
                phone: string;
            };
        }[];
        metadata: IMetadata;
    } | {
        status: number;
        list?: undefined;
        metadata?: undefined;
    }>;
    findStorefrontProducts(body: GetProductDto): Promise<{
        status: number;
        list?: undefined;
        metadata?: undefined;
    } | {
        list: any[];
        metadata: IMetadata;
        status?: undefined;
    }>;
    changeStatus(query: RealEstateAgentChangeStatusDto): Promise<{
        status: number;
        client_status: statuses.active | statuses.inactive;
        license_status: statuses.approved | statuses.rejected;
    } | {
        status: number;
        client_status?: undefined;
        license_status?: undefined;
    }>;
    findOneByID(item_id: number): Promise<{
        id: number;
        name: string;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
