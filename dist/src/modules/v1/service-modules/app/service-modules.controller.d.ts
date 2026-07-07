import { ServiceModulesService } from "./service-modules.service";
import ServicesModuleAppTransformer from "./Transformer";
import { GetServicesMediaDto } from "./dto/get-service-media-module.dto";
import { SaveCommentInServicesDto } from "./dto/save-comment.dto";
import { GetCommentsDto } from "./dto/get-comments.dto";
export declare class ServiceModulesController {
    private readonly serviceModulesService;
    private readonly transformer;
    private readonly httpResponsehandler;
    constructor(serviceModulesService: ServiceModulesService, transformer: ServicesModuleAppTransformer);
    findAll(query: GetServicesMediaDto, req: any, res: Response): Promise<any>;
    saveComment(body: SaveCommentInServicesDto, req: any, res: Response): Promise<any>;
    getComments(query: GetCommentsDto, req: any, res: Response): Promise<any>;
    actionForComment(comment_id: string, req: any, res: Response): Promise<any>;
}
