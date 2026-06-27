import { CreateValidateClientDto } from "./dto/create-validate-client.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { VerifyCodeValidateClientDto } from "./dto/verify-validate-client.dto";
import SmsService from "src/modules/services/notifications/sms/SmsService";
export declare class ValidateClientsService {
    private readonly prismaService;
    private readonly smsService;
    constructor(prismaService: PrismaService, smsService: SmsService);
    create(body: CreateValidateClientDto): Promise<{
        status: number;
    }>;
    VerifyValidatePhone(body: VerifyCodeValidateClientDto): Promise<{
        status: number;
    }>;
}
