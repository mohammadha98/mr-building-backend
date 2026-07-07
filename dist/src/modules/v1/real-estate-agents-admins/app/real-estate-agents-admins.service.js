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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateAgentsAdminsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const client_service_1 = require("../../client/app/client.service");
const UserTypes_1 = require("../../../../commons/contracts/UserTypes");
const cache_manager_1 = require("@nestjs/cache-manager");
const Transformer_1 = require("./Transformer");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const Templates_1 = require("../../../../commons/contracts/Templates");
let RealEstateAgentsAdminsService = class RealEstateAgentsAdminsService {
    constructor(cacheManager, prismaService, realEstateAdminTransformer, clientService, smsService) {
        this.cacheManager = cacheManager;
        this.prismaService = prismaService;
        this.realEstateAdminTransformer = realEstateAdminTransformer;
        this.clientService = clientService;
        this.smsService = smsService;
    }
    async validate(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const user = await this.clientService.findOne(body.phone);
            if (!user) {
                return { status: 200, result: "not_found", user: null };
            }
            const userTransform = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                phone: user.phone,
            };
            if (user.roles.includes(UserTypes_1.default.admin)) {
                return { status: 200, result: "busy", user: userTransform };
            }
            else if (user.roles.includes(UserTypes_1.default.estate_agent)) {
                return { status: 200, result: "estate_agent", user: userTransform };
            }
            else if (user.roles.includes(UserTypes_1.default.advisor)) {
                return { status: 200, result: "advisor", user: userTransform };
            }
            else if (user.roles.includes(UserTypes_1.default.operator_estate_agent)) {
                return {
                    status: 200,
                    result: UserTypes_1.default.operator_estate_agent,
                    user: userTransform,
                };
            }
            return { status: 200, result: "free", user: userTransform };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async create(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const user = await this.clientService.findOne(body.phone);
            if (!user) {
                return { status: 200, result: "not_found" };
            }
            const userTransform = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                phone: user.phone,
            };
            console.log(body.permissions);
            if (user.roles.includes(UserTypes_1.default.advisor)) {
                return { status: 200, result: "busy", admin: userTransform };
            }
            else if (user.roles.includes(UserTypes_1.default.estate_agent)) {
                return { status: 200, result: "estate_agent", admin: userTransform };
            }
            const validateAdmin = await this.prismaService.realEstateAgentAdmins.findFirst({
                where: { client_id: Number(user.id) },
            });
            if (!validateAdmin) {
                const admin = await this.prismaService.realEstateAgentAdmins.create({
                    data: {
                        real_estate_agent: { connect: { id: Number(body.agent_id) } },
                        client: { connect: { id: user.id } },
                        color: body.color,
                        permissions: body.permissions,
                    },
                    select: {
                        id: true,
                        permissions: true,
                        color: true,
                        client: {
                            select: { id: true, name: true, surname: true, phone: true },
                        },
                        real_estate_agent: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                number_of_ads: true,
                                score: true,
                                province: { select: { name: true } },
                            },
                        },
                    },
                });
                await this.clientService.addRole(Number(user.id), UserTypes_1.default.advisor);
                const transform = this.realEstateAdminTransformer.transform(admin);
                const channelInfo = await this.prismaService.channelRealEstateAgent.findUnique({
                    where: { id: Number(body.agent_id) },
                });
                const agentInfo = await this.prismaService.realEstateAgents.findFirst({
                    where: { id: Number(body.agent_id) },
                });
                await this.smsService.send({
                    message: agentInfo.name,
                    templateID: Number(Templates_1.default.verify_real_estate_advisor),
                    recipient: body.phone,
                    parameterKey: "text",
                });
                await this.prismaService.channelRealEstateMembers.deleteMany({
                    where: { channel_id: Number(body.agent_id), client_id: user.id },
                });
                return { status: 201, result: "created", transform };
            }
            return { status: 200, result: "busy", admin: userTransform };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async findAll(query) {
        try {
            const client = await this.clientService.validateWithID(Number(query.client_id));
            if (!client) {
                return { status: 403 };
            }
            const agentInfo = await this.prismaService.realEstateAgents.findUnique({
                where: { id: Number(query.agent_id) },
            });
            if (!agentInfo) {
                return { status: 400 };
            }
            let transformer;
            const resourceKey = this.generateRedisKey(query);
            const admins = await this.cacheManager.get(resourceKey);
            if (!admins) {
                const result = await this.prismaService.realEstateAgentAdmins.findMany({
                    where: { agent_id: Number(query.agent_id) },
                    orderBy: { id: "desc" },
                    select: {
                        id: true,
                        permissions: true,
                        color: true,
                        client: {
                            select: { id: true, name: true, surname: true, phone: true },
                        },
                        real_estate_agent: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                number_of_ads: true,
                                score: true,
                                province: { select: { name: true } },
                            },
                        },
                    },
                });
                if (result.length > 0) {
                    await this.cacheManager.set(resourceKey, result);
                }
                transformer = this.realEstateAdminTransformer.collection(result);
            }
            else {
                transformer = this.realEstateAdminTransformer.collection(admins);
            }
            return {
                status: 200,
                admins: transformer,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async changeStatus(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
                where: { id: Number(body.admin_id) },
            });
            if (!admin) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAgentAdmins.update({
                where: { id: Number(body.admin_id) },
                data: { status: body.status },
            });
            return { status: 200 };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async updatePermissions(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
                where: { id: Number(body.admin_id) },
            });
            if (!admin) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAgentAdmins.update({
                where: { id: Number(body.admin_id) },
                data: { permissions: body.permissions },
            });
            const resourceKey = this.generateRedisKey({ agent_id: admin.agent_id });
            const adminsInCacheDB = (await this.cacheManager.get(resourceKey));
            if (adminsInCacheDB && adminsInCacheDB.length > 0) {
                const result = adminsInCacheDB.map((admin) => {
                    if (admin.id === Number(body.admin_id)) {
                        admin.permissions = body.permissions;
                    }
                    return admin;
                });
                await this.cacheManager.set(resourceKey, result);
            }
            else {
                const result = await this.prismaService.realEstateAgentAdmins.findMany({
                    where: { agent_id: Number(body.agent_id) },
                    orderBy: { id: "desc" },
                    select: {
                        id: true,
                        permissions: true,
                        color: true,
                        client: {
                            select: { id: true, name: true, surname: true, phone: true },
                        },
                        real_estate_agent: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                number_of_ads: true,
                                score: true,
                                province: { select: { name: true } },
                            },
                        },
                    },
                });
                await this.cacheManager.set(resourceKey, result);
            }
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async removeAdmin(body) {
        try {
            const client = await this.clientService.validateWithID(Number(body.client_id));
            if (!client) {
                return { status: 403 };
            }
            const admin = await this.prismaService.realEstateAgentAdmins.findFirst({
                where: {
                    id: Number(body.admin_id),
                    agent_id: Number(body.agent_id),
                },
                select: {
                    id: true,
                    client_id: true,
                    agent_id: true,
                },
            });
            if (!admin) {
                return { status: 400 };
            }
            await this.prismaService.realEstateAgentAdmins.delete({
                where: {
                    id: Number(body.admin_id),
                },
            });
            await this.clientService.removeRole(admin.client_id, UserTypes_1.default.admin);
            const resourceKey = this.generateRedisKey({ agent_id: admin.agent_id });
            const adminsInCacheDB = (await this.cacheManager.get(resourceKey));
            if (adminsInCacheDB && adminsInCacheDB.length > 0) {
                const result = adminsInCacheDB.filter((admin) => admin.id !== Number(body.admin_id));
                if (result.length > 0) {
                    await this.cacheManager.set(resourceKey, result);
                }
                else {
                    await this.cacheManager.del(resourceKey);
                }
            }
            return { status: 200 };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
    generateRedisKey(query) {
        const resourceKey = `get_real_estate_agents_admins_agentId_${query.agent_id}`;
        console.log("* resourceKey *");
        console.log(resourceKey);
        return resourceKey;
    }
};
RealEstateAgentsAdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService,
        Transformer_1.default,
        client_service_1.ClientService,
        SmsService_1.default])
], RealEstateAgentsAdminsService);
exports.RealEstateAgentsAdminsService = RealEstateAgentsAdminsService;
//# sourceMappingURL=real-estate-agents-admins.service.js.map