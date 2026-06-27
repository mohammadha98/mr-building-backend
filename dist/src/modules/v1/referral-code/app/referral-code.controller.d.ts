import { ReferralCodeService } from "./referral-code.service";
import { CreateReferralCodeDto } from "./dto/create-referal-code.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ReferralCodeTransformer from "./transformer";
import { GetUsersReferralCodeDto } from "./dto/get-users-referal-code.dto";
import { getDetailsReferralCodeDto } from "./dto/getDetails.dto";
export declare class ReferralCodeController {
    private readonly referralCodeService;
    private readonly responseHandler;
    private readonly referalCodeTransformer;
    constructor(referralCodeService: ReferralCodeService, responseHandler: HttpResponsehandler, referalCodeTransformer: ReferralCodeTransformer);
    create(body: CreateReferralCodeDto, req: any, res: Response): Promise<any>;
    getMyUser(query: GetUsersReferralCodeDto, req: any, res: Response): Promise<any>;
    getReferralDetails(query: getDetailsReferralCodeDto, req: any, res: Response): Promise<any>;
    updateCodes(req: any, res: Response): Promise<any>;
}
