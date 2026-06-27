import { TermsOfServicesService } from "./terms-of-services.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import TermsOfServicetarnsformer from "./Transformer";
export declare class TermsOfServicesController {
    private readonly termsOfServicesService;
    private readonly termsOfServicetarnsformer;
    private readonly httpResponsehandler;
    constructor(termsOfServicesService: TermsOfServicesService, termsOfServicetarnsformer: TermsOfServicetarnsformer, httpResponsehandler: HttpResponsehandler);
    findAll(req: any, res: Response): Promise<void>;
}
