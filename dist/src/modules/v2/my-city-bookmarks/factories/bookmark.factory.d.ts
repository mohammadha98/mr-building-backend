import { MyCityModel } from "@prisma/client";
import { MyCityService } from "../../my-city/app/my-city.service";
export declare class BookmarkMyCityFactory {
    private readonly myCityService;
    constructor(myCityService: MyCityService);
    findOneLocationById(location_id: string): Promise<MyCityModel | Error>;
}
