import { HttpStatus } from "@nestjs/common";
import { VerifyAuthDto } from "./dto/verify-auth.dto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ClientService } from "src/modules/v2//client/app/client.service";
import AppSteps from "src/commons/contracts/AppSteps";
import { ReferralCodeService } from "src/modules/v2/referral-code/app/referral-code.service";
import { MessengerChannelsService } from "../messenger_channels/app/messenger-channels.service";
import SmsService from "src/modules/services/notifications/sms/SmsService";
export declare class AuthService {
    private prisma;
    private smsService;
    private jwtService;
    private clientService;
    private referralCodeService;
    private readonly messengerChannelsService;
    constructor(prisma: PrismaService, smsService: SmsService, jwtService: JwtService, clientService: ClientService, referralCodeService: ReferralCodeService, messengerChannelsService: MessengerChannelsService);
    create(phone: string, code: number): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        phone: string;
        code: number;
        created_at: Date;
        expires_at: Date;
    }, unknown, never> & {}>;
    findOne(VerifyAuthDto: VerifyAuthDto): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        phone: string;
        code: number;
        created_at: Date;
        expires_at: Date;
    }, unknown, never> & {}>;
    verify(VerifyAuthDto: VerifyAuthDto): Promise<{
        status: number;
        message?: undefined;
        client?: undefined;
        next_step?: undefined;
    } | {
        status: HttpStatus;
        message: string;
        client?: undefined;
        next_step?: undefined;
    } | {
        status: HttpStatus.OK | HttpStatus.CREATED;
        message: any;
        client: any;
        next_step: AppSteps;
    }>;
    addAllUserToDefaultChannel(): Promise<void>;
    private saveMissionForNewClient;
    private generateKey;
    private generateReferralCode;
    delete(phone: string): Promise<void>;
}
