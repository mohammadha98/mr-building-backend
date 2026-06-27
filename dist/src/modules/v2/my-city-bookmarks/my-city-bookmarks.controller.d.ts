import { MyCityBookmarksService } from "./my-city-bookmarks.service";
import { CreateMyCityBookmarkDto } from "./dto/create-my-city-bookmark.dto";
export declare class MyCityBookmarksController {
    private readonly myCityBookmarksService;
    constructor(myCityBookmarksService: MyCityBookmarksService);
    create(createBookmarkDto: CreateMyCityBookmarkDto): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../commons/enums/messages").PublicMessage;
    }>;
    findAll(): Promise<{
        statusCode: import("axios").HttpStatusCode;
        message: import("../../../commons/enums/messages").PublicMessage;
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
}
