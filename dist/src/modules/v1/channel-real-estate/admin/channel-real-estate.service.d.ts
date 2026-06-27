import { PrismaService } from "../../../../../prisma/prisma.service";
import IMetadata from "src/commons/contracts/IMetadata";
import { PinnedChannelRealEstateDto } from "./dto/pinned-channel-real-estate.dto";
import { GetChannelsDto } from "./dto/get-channels-pagination..dto";
export declare class ChannelRealEstateService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    pinnedChannel(body: PinnedChannelRealEstateDto): Promise<{
        status: number;
    }>;
    getChannels(query: GetChannelsDto): Promise<{
        status: number;
        channels?: undefined;
        metadata?: undefined;
    } | {
        status: number;
        channels: {
            id: number;
            key: string;
            last_message_time: Date;
            tag: string;
            created_at: Date;
            _count: {
                members: number;
            };
            real_estate_agent: {
                id: number;
                name: string;
                avatar: string;
            };
        }[];
        metadata: IMetadata;
    }>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
