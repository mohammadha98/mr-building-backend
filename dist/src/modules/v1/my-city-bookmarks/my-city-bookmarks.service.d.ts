import { CreateMyCityBookmarkDto } from "./dto/create-my-city-bookmark.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { Request } from "express";
import { BookmarkMyCityFactory } from "./factories/bookmark.factory";
import { HttpStatusCode } from "axios";
import { PublicMessage } from "src/commons/enums/messages";
import BookmarkCityTransformer from "./Transformer";
export declare class MyCityBookmarksService {
    private request;
    private readonly prismaService;
    private readonly bookmarkFactory;
    private readonly bookmarkTransformer;
    constructor(request: Request, prismaService: PrismaService, bookmarkFactory: BookmarkMyCityFactory, bookmarkTransformer: BookmarkCityTransformer);
    create(createBookmarkDto: CreateMyCityBookmarkDto): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatusCode;
        message: PublicMessage;
        data: {
            id: any;
            location_info: {
                id: any;
                title: any;
                latitude: any;
                longitude: any;
                category: any;
                province: {
                    id: any;
                    name: any;
                };
                city: {
                    id: any;
                    name: any;
                };
            };
        }[];
    }>;
    findExist(myCityId: string, client_id: number): Promise<{
        myCity: import("@prisma/client/runtime").GetResult<{
            id: string;
            category: string;
            title: string;
            description: string;
            size: number;
            year_built: number;
            number_of_rooms: number;
            status: string;
            renovation_tax: boolean;
            latitude: number;
            longitude: number;
            province_id: number;
            city_id: number;
            created_at: Date;
            updated_at: Date;
            clientId: number;
        }, unknown, never> & {};
    } & import("@prisma/client/runtime").GetResult<{
        id: string;
        client_id: number;
        myCityId: string;
    }, unknown, never> & {}>;
}
