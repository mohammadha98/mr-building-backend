import { HomePageService } from "./home-page.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import HomePageTransformer from "./Transformer";
import { GetHomePageDto } from "./dto/create-home-page.dto";
export declare class HomePageController {
    private readonly homePageService;
    private readonly homePageTransformer;
    private readonly responseHandler;
    constructor(homePageService: HomePageService, homePageTransformer: HomePageTransformer, responseHandler: HttpResponsehandler);
    findAll(query: GetHomePageDto, req: any, res: Response): Promise<any>;
}
