import { CreateSliderDto } from "./dto/create-slider.dto";
import { UpdateSliderDto } from "./dto/update-slider.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
import IMetadata from "src/commons/contracts/IMetadata";
import SliderTransformerApp from "./contracts/transformer-app";
export declare class SliderService {
    private readonly prisma;
    private readonly sliderTransformer;
    private readonly uploaderService;
    constructor(prisma: PrismaService, sliderTransformer: SliderTransformerApp);
    create(createSliderDto: CreateSliderDto): Promise<false | {
        id: number;
        title: string;
        tag: string;
        thumbnail: string;
        created_at: Date;
    }>;
    findAll(pagination: PaginationSchema): Promise<{
        sliders: (import("@prisma/client/runtime").GetResult<{
            id: number;
            title: string;
            thumbnail: string;
            status: string;
            tag: string;
            created_at: Date;
            updated_at: Date;
        }, unknown, never> & {})[];
        metadata: IMetadata;
    }>;
    update(body: UpdateSliderDto): Promise<{
        status: number;
        result: {
            id: number;
            title: string;
            thumbnail: string;
        };
    } | {
        status: number;
        result?: undefined;
    }>;
    remove(id: number): Promise<{
        status: number;
    }>;
    getSliders(tag: string): Promise<{
        id: any;
        title: any;
        thumbnail: string;
    }[]>;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
