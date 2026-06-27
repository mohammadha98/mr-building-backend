"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const client_service_1 = require("../client/app/client.service");
const Templates_1 = require("../../../commons/contracts/Templates");
const AppSteps_1 = require("../../../commons/contracts/AppSteps");
const crypto_1 = require("crypto");
const MissionTypes_1 = require("../../../commons/contracts/MissionTypes");
const referral_code_service_1 = require("../referral-code/app/referral-code.service");
const MissionTypes_2 = require("../../../commons/contracts/MissionTypes");
const messenger_channels_service_1 = require("../messenger_channels/app/messenger-channels.service");
const SmsService_1 = require("../../services/notifications/sms/SmsService");
let AuthService = class AuthService {
    constructor(prisma, smsService, jwtService, clientService, referralCodeService, messengerChannelsService) {
        this.prisma = prisma;
        this.smsService = smsService;
        this.jwtService = jwtService;
        this.clientService = clientService;
        this.referralCodeService = referralCodeService;
        this.messengerChannelsService = messengerChannelsService;
    }
    async create(phone, code) {
        try {
            const now = new Date(Date.now());
            const expiresAt = new Date(Date.now());
            expiresAt.setTime(now.getTime() + 5 * 60000);
            const client = await this.prisma.registeredModel.findFirst({
                where: {
                    phone,
                },
            });
            if (!client) {
                await this.prisma.registeredModel.create({
                    data: {
                        phone,
                        code,
                        expires_at: expiresAt,
                    },
                });
            }
            else {
                await this.prisma.registeredModel.updateMany({
                    where: {
                        phone: phone,
                    },
                    data: {
                        code,
                        expires_at: expiresAt,
                    },
                });
            }
            await this.smsService.send({
                message: String(code),
                templateID: Number(Templates_1.default.login_test),
                recipient: phone,
                parameterKey: "code",
            });
            return client;
        }
        catch (error) {
            console.log(error);
        }
    }
    async findOne(VerifyAuthDto) {
        return await this.prisma.registeredModel.findFirst({
            where: {
                phone: VerifyAuthDto.phone,
                code: Number(VerifyAuthDto.code),
            },
        });
    }
    async verify(VerifyAuthDto) {
        try {
            const result = await this.findOne(VerifyAuthDto);
            console.log("*** verify ***");
            if (!result) {
                return { status: 400 };
            }
            let client = await this.prisma.client.findFirst({
                where: { phone: VerifyAuthDto.phone },
                select: {
                    id: true,
                    webinar_provider_id: true,
                    name: true,
                    surname: true,
                    phone: true,
                    username: true,
                    email: true,
                    has_update_direct: true,
                    avatar: true,
                    token: true,
                    key: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                },
            });
            let status = common_1.HttpStatus.OK;
            let message = null;
            let next_step = AppSteps_1.default.home;
            if (!client) {
                next_step = AppSteps_1.default.complete_registration;
                VerifyAuthDto.key = await this.generateKey();
                client = await this.clientService.create(VerifyAuthDto);
                client.token = this.jwtService.sign({ sub: client.id });
                await this.clientService.updateToken(Number(client.id), client.token);
                await this.saveMissionForNewClient(client);
                client.referralCode =
                    await this.referralCodeService.saveReferralCodeForCLient(client.id);
                status = common_1.HttpStatus.CREATED;
                message = "ثبت نام با موفقیت انجام شد.";
                const channelInfo = await this.messengerChannelsService.channelInfo({
                    username: "mrbuilding",
                    client_id: client.id,
                });
                if (channelInfo.channels.length) {
                    await this.messengerChannelsService.joinChannel({
                        channel_id: channelInfo.channels[0].id,
                        client_id: client.id,
                    });
                }
            }
            else {
                next_step = client.webinar_provider_id
                    ? AppSteps_1.default.home
                    : AppSteps_1.default.complete_registration;
                message = "کد ارسالی تایید شد. با موفقیت وارد شدید.";
                const referral = (await this.referralCodeService.getReferralCodeForClient(client.id));
                if (referral) {
                    client.referralCode = referral.code;
                }
                else {
                    client.referralCode = "";
                }
            }
            await this.delete(VerifyAuthDto.phone);
            return { status, message, client, next_step };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async addAllUserToDefaultChannel() {
        const clients = await this.prisma.client.findMany({});
        const channelInfo = await this.messengerChannelsService.channelInfo({
            username: "mrbuilding",
            client_id: 1,
        });
        if (channelInfo.status === 200) {
            clients.map(async (item) => {
                await this.messengerChannelsService.joinChannel({
                    channel_id: channelInfo.channels[0].id,
                    client_id: item.id,
                });
            });
        }
    }
    async saveMissionForNewClient(client) {
        let registerMission = (await this.prisma.missions.findFirst({
            where: { key: MissionTypes_1.default.register },
        }));
        if (!registerMission) {
            registerMission = {
                id: 1,
                key: MissionTypes_2.default.register,
                title: "ثبت ‌نام و ورود به اپلیکیشن",
                description: "با اولین ورود به اپلیکیشن به‌صورت خودکار امتیاز می‌گیرید",
                point: 130,
                type: MissionTypes_1.default.register,
            };
        }
        await this.clientService.saveMission(registerMission, client);
    }
    async generateKey() {
        const key = (0, crypto_1.randomBytes)(12).toString("hex").toUpperCase();
        const isDuplicateChatId = await this.prisma.client.findFirst({
            where: { key },
        });
        if (isDuplicateChatId) {
            await this.generateKey();
        }
        return key;
    }
    async generateReferralCode() {
        const newCode = (0, crypto_1.randomBytes)(6).toString("hex").toUpperCase();
        const validateCode = await this.prisma.referralCodes.findFirst({
            where: { code: newCode },
        });
        if (validateCode) {
            this.generateReferralCode;
        }
        return newCode;
    }
    async delete(phone) {
        await this.prisma.registeredModel.deleteMany({
            where: {
                phone,
            },
        });
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        SmsService_1.default,
        jwt_1.JwtService,
        client_service_1.ClientService,
        referral_code_service_1.ReferralCodeService,
        messenger_channels_service_1.MessengerChannelsService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map