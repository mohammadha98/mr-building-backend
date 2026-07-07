import { ValidateClientsService } from "./validate-clients.service";
import { CreateValidateClientDto } from "./dto/create-validate-client.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { VerifyCodeValidateClientDto } from "./dto/verify-validate-client.dto";
export declare class ValidateClientsController {
    private readonly validateClientsService;
    private readonly responseHandler;
    constructor(validateClientsService: ValidateClientsService, responseHandler: HttpResponsehandler);
    validatePhone(body: CreateValidateClientDto, req: any, res: Response): Promise<any>;
    VerifyValidatePhone(body: VerifyCodeValidateClientDto, req: any, res: Response): Promise<any>;
}
