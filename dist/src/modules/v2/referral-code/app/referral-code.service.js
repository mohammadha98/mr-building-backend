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
exports.ReferralCodeService = void 0;
const common_1 = require("@nestjs/common");
const client_service_1 = require("../../client/app/client.service");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const crypto_1 = require("crypto");
const MissionTypes_1 = require("../../../../commons/contracts/MissionTypes");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
let ReferralCodeService = class ReferralCodeService {
    constructor(prismaService, clientService) {
        this.prismaService = prismaService;
        this.clientService = clientService;
    }
    async create(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const validateReferralCode = await this.prismaService.referralCodes.findFirst({
                where: { code: body.code },
            });
            if (!validateReferralCode) {
                return { status: 400 };
            }
            const history = await this.prismaService.referralHistorry.findFirst({
                where: {
                    client_id: body.client_id,
                },
                select: {
                    client: { select: { name: true, surname: true } },
                },
            });
            if (!history) {
                if (validateReferralCode.owner_id !== client.id) {
                    const referralCodeOwner = await this.prismaService.client.findFirst({
                        where: { id: validateReferralCode.owner_id },
                    });
                    const missionReferral = await this.prismaService.missions.findFirst({
                        where: { key: MissionTypes_1.default.referral_code },
                    });
                    await this.saveMissionForNewClient(validateReferralCode, missionReferral, client);
                    await this.saveMissionForSubcategoryRegistration(referralCodeOwner, missionReferral);
                    return {
                        status: 201,
                        message: `شما با موفقیت توسط ${referralCodeOwner.name + " " + referralCodeOwner.surname} دعوت شدید.`,
                    };
                }
                else {
                    return {
                        status: 409,
                    };
                }
            }
            const referralHistorry = await this.prismaService.referralHistorry.findFirst({
                where: { client_id: Number(body.client_id) },
                select: {
                    referral: { select: { owner_id: true } },
                },
            });
            const referralCodeOwner = await this.prismaService.client.findFirst({
                where: { id: referralHistorry.referral.owner_id },
            });
            return {
                status: 200,
                message: `شما توسط ${referralCodeOwner.name + " " + referralCodeOwner.surname} دعوت شده اید.`,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async saveMissionForNewClient(referralCode, missionReferral, client) {
        await this.clientService.saveMission(missionReferral, client);
        await this.prismaService.referralHistorry.create({
            data: {
                referral: { connect: { id: referralCode.id } },
                client: { connect: { id: Number(client.id) } },
            },
        });
    }
    async saveMissionForSubcategoryRegistration(client, mission) {
        const subcategory_registration = await this.prismaService.missions.findFirst({
            where: { key: MissionTypes_1.default.subcategory_registration },
        });
        await this.clientService.saveMission(subcategory_registration, client);
    }
    async getMyUser(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const getUsers = await this.prismaService.referralCodes.findFirst({
                where: { owner_id: query.client_id },
                select: {
                    referral_historry: {
                        select: {
                            client: {
                                select: {
                                    id: true,
                                    name: true,
                                    surname: true,
                                    phone: true,
                                    roles: true,
                                },
                            },
                        },
                        orderBy: { id: "desc" },
                    },
                },
            });
            const clients = getUsers.referral_historry;
            const subSystemReferralCode = await this.getSubSystemReferralCode(clients);
            const missionReferralCode = await this.prismaService.missions.findFirst({
                where: { key: MissionTypes_1.default.referral_code },
            });
            return {
                status: 200,
                clients: subSystemReferralCode,
                score: missionReferralCode.point,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getReferralDetails(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const getUsers = await this.prismaService.referralHistorry.findMany({
                where: { referral_id: Number(query.referra_id) },
                select: {
                    client: {
                        select: { id: true, name: true, surname: true, roles: true },
                    },
                },
            });
            const totalUsedMyReferralCode = this.getTotalUsedMyReferralCode(getUsers);
            const missionReferralCode = await this.prismaService.missions.findFirst({
                where: { key: MissionTypes_1.default.referral_code },
            });
            const totalPoint = await this.prismaService.receiveMissions.count({
                where: {
                    mission_id: missionReferralCode.id,
                    client_id: Number(query.client_id),
                },
            });
            return {
                status: 200,
                total: totalUsedMyReferralCode,
                point: missionReferralCode.point * totalPoint,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getSubSystemReferralCode(clients) {
        return await Promise.all(clients.map(async (item) => {
            const referralInfo = await this.prismaService.referralCodes.findFirst({
                where: { owner_id: Number(item.client.id) },
            });
            const number_of_sub_categories = await this.prismaService.referralHistorry.count({
                where: { referral_id: referralInfo.id },
            });
            return {
                client_id: item.client.id,
                client_name: item.client.name + " " + item.client.surname,
                client_phone: item.client.phone,
                client_roles: item.client.roles,
                referral_code: referralInfo.code,
                referral_id: referralInfo.id,
                number_of_sub_categories,
            };
        }));
    }
    getTotalUsedMyReferralCode(clients) {
        const totalUsed = {
            clients: 0,
            estate_agent: 0,
            advisor: 0,
            admin: 0,
            operator_estate_agent: 0,
        };
        clients.map((item) => {
            if (item.client.roles.includes(UserTypes_1.default.estate_agent)) {
                totalUsed.estate_agent = totalUsed.estate_agent + 1;
            }
            else if (item.client.roles.includes(UserTypes_1.default.advisor)) {
                totalUsed.advisor = totalUsed.advisor + 1;
            }
            else if (item.client.roles.includes(UserTypes_1.default.admin)) {
                totalUsed.admin = totalUsed.admin + 1;
            }
            else {
                totalUsed.clients = totalUsed.clients + 1;
            }
        });
        return totalUsed;
    }
    async getReferralCodeForClient(client_id) {
        try {
            return await this.prismaService.referralCodes.findFirst({
                where: { owner_id: Number(client_id) },
            });
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async saveReferralCodeForCLient(client_id) {
        try {
            const validateClient = await this.getReferralCodeForClient(client_id);
            if (!validateClient) {
                const referralCode = await this.generateReferralCode();
                await this.prismaService.referralCodes.create({
                    data: {
                        code: referralCode,
                        owner_id: Number(client_id),
                    },
                });
                return referralCode;
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateCodes() {
        try {
            const clientList = await this.prismaService.client.findMany({
                select: { id: true },
            });
            const clientListIds = clientList.map((item) => item.id);
            const existReferralCodes = await this.prismaService.referralCodes.findMany();
            const existReferralCodeOwnerIds = existReferralCodes.map((item) => item.owner_id);
            const newClientIdsInReferralCodes = clientListIds.filter((item) => !existReferralCodeOwnerIds.includes(item));
            console.log("newClientIds");
            console.log(newClientIdsInReferralCodes.length);
            await Promise.all(newClientIdsInReferralCodes.map(async (client_id) => {
                const referralCode = await this.generateReferralCode();
                await this.prismaService.referralCodes.create({
                    data: {
                        owner_id: client_id,
                        code: referralCode,
                    },
                });
            }));
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async generateReferralCode() {
        const newCode = (0, crypto_1.randomBytes)(8).toString("hex").toUpperCase();
        const validateCode = await this.prismaService.referralCodes.findFirst({
            where: { code: newCode },
        });
        if (validateCode) {
            this.generateReferralCode;
        }
        return newCode;
    }
};
ReferralCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        client_service_1.ClientService])
], ReferralCodeService);
exports.ReferralCodeService = ReferralCodeService;
//# sourceMappingURL=referral-code.service.js.map