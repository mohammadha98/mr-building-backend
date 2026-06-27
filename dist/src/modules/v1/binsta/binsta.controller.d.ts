import { BinstaService } from "./binsta.service";
import { UpdateBinstaDto } from "./dto/update-binsta.dto";
import { ValidateUsernameBinstaDto } from "./dto/validate-username.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
export declare class BinstaController {
    private readonly binstaService;
    private readonly responseHandler;
    constructor(binstaService: BinstaService, responseHandler: HttpResponsehandler);
    validateUsername(body: ValidateUsernameBinstaDto, req: any, res: Response): Promise<any>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBinstaDto: UpdateBinstaDto): string;
    remove(id: string): string;
}
