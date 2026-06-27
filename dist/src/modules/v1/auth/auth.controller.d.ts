import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { VerifyAuthDto } from "./dto/verify-auth.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientTransformer from "src/modules/v1//client/app/Transformer";
export declare class AuthController {
    private readonly authService;
    private readonly clientTransformer;
    private readonly responseHandler;
    constructor(authService: AuthService, clientTransformer: ClientTransformer, responseHandler: HttpResponsehandler);
    register(RegisterAuthDto: RegisterAuthDto, req: any, res: Response): Promise<any>;
    verify(verifyAuthDto: VerifyAuthDto, res: Response): Promise<any>;
    addAllUserToDefaultChannel(res: Response): Promise<any>;
}
