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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const SmsService_1 = require("../../../services/notifications/sms/SmsService");
const EventService_1 = require("../../webinar/provider/EventService");
const client_list_dto_1 = require("./dto/client-list.dto");
const crypto_1 = require("crypto");
const ClientRoles_1 = require("../../../../commons/contracts/ClientRoles");
const forbiddenErrorHandler_1 = require("../../../services/httpResponseHandler/forbiddenErrorHandler");
const internalServerErrorHandler_1 = require("../../../services/httpResponseHandler/internalServerErrorHandler");
const RealEstateAdMediaType_1 = require("../../../../commons/contracts/RealEstateAdMediaType");
const RealEstateAdMediaTypePriorities_1 = require("../../../../commons/contracts/RealEstateAdMediaTypePriorities");
const SortingTypes_1 = require("../../../../commons/contracts/SortingTypes");
let ClientService = class ClientService {
    constructor(prisma) {
        this.prisma = prisma;
        this.eventService = new EventService_1.default();
        this.smsService = new SmsService_1.default();
    }
    async create(phone) {
        try {
            const client = await this.prisma.client.create({
                data: {
                    phone,
                    password: null,
                },
            });
            return client;
        }
        catch (error) {
            return false;
        }
    }
    async findAll(query) {
        let condition = {};
        if (query.type === client_list_dto_1.GetTypes.search) {
            condition = {
                OR: [
                    {
                        name: {
                            contains: query.keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        surname: {
                            contains: query.keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        phone: {
                            contains: query.keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            };
        }
        let orderBy = { id: "desc" };
        if (query.sort === SortingTypes_1.default.oldest) {
            orderBy = { id: "asc" };
        }
        const count = await this.prisma.client.count({ where: Object.assign({}, condition) });
        const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
        const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
        const clients = await this.prisma.client.findMany({
            where: Object.assign({}, condition),
            skip: paginationValue.offset,
            take: paginationValue.per_page,
            orderBy,
        });
        return {
            clients,
            metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
        };
    }
    async getAllReports(body) {
        try {
            const user = await this.prisma.client.findUnique({
                where: { id: Number(body.client_id) },
            });
            if (!user) {
                return { status: 403 };
            }
            let conditions = {};
            if (body.type === "all") {
                conditions = {
                    client_id: Number(body.client_id),
                };
            }
            else {
                conditions = {
                    client_id: Number(body.client_id),
                    type: body.type,
                };
            }
            console.log({ conditions });
            const count = await this.prisma.reportBugs.count({
                where: Object.assign({}, conditions),
            });
            const total = this.getTotalPageNumber(Number(count), Number(body.per_page));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            const list = await this.prisma.reportBugs.findMany({
                where: Object.assign({}, conditions),
                select: {
                    id: true,
                    content: true,
                    image: true,
                    voice: true,
                    type: true,
                    created_at: true,
                    client: {
                        select: { id: true, name: true, surname: true, phone: true },
                    },
                },
                orderBy: { id: "desc" },
                take: paginationValue.per_page,
                skip: paginationValue.offset,
            });
            return {
                status: 200,
                list,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async getUserPrizes(query) {
        try {
            const client = await this.prisma.client.findFirst({
                where: { id: Number(query.client_id) },
            });
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const total_score = client.score;
            const count = await this.prisma.receivePrizes.count({
                where: { clientId: Number(query.client_id) },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const prizes = await this.prisma.receivePrizes.findMany({
                where: { clientId: Number(query.client_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
            });
            return {
                result: {
                    status: 200,
                    prizes,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async getHistoryOfScores(query) {
        try {
            const client = await this.prisma.client.findFirst({
                where: { id: Number(query.client_id) },
            });
            if (!client) {
                throw new forbiddenErrorHandler_1.ForbiddenErrorHandler();
            }
            const total_score = client.score;
            const count = await this.prisma.historyOfScores.count({
                where: { client_id: Number(query.client_id) },
            });
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const history = await this.prisma.historyOfScores.findMany({
                where: { client_id: Number(query.client_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                orderBy: { id: "desc" },
            });
            return {
                result: {
                    total_score,
                    history,
                    metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
                },
            };
        }
        catch (error) {
            console.log(error);
            throw new internalServerErrorHandler_1.InternalServerErrorHandler();
        }
    }
    async findAds(body) {
        try {
            const client = await this.prisma.client.findUnique({
                where: {
                    id: Number(body.user_id),
                },
            });
            if (!client) {
                return { status: 403 };
            }
            console.log("*** find Client Ads: ADMIN ***");
            console.log({ body });
            const count = await this.prisma.realEstateAds.count({
                where: { client_id: Number(body.user_id) },
            });
            const total = this.getTotalPageNumber(Number(count), Number(Number(body.per_page)));
            const paginationValue = this.makePagination(Number(body.page), Number(body.per_page));
            let result = await this.prisma.realEstateAds.findMany({
                where: { client_id: Number(body.user_id) },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
                select: {
                    id: true,
                    category: { select: { id: true, title: true, type: true } },
                    subCategory: { select: { id: true, title: true } },
                    title: true,
                    status: true,
                    province: { select: { id: true, name: true } },
                    city: { select: { id: true, name: true } },
                    agent_id: true,
                    advisor_id: true,
                    seller_type: true,
                    tracking_code: true,
                    sale_price: true,
                    deposit_price: true,
                    rent_price: true,
                    number_of_rooms: true,
                    max_capicity: true,
                    created_at: true,
                    area: true,
                    media: {
                        where: {
                            file_type: RealEstateAdMediaType_1.default.image,
                            priority: RealEstateAdMediaTypePriorities_1.default.primary,
                        },
                        select: {
                            id: true,
                            file_name: true,
                            file_type: true,
                            sort_number: true,
                            priority: true,
                        },
                        orderBy: { id: "desc" },
                    },
                },
            });
            if (!result) {
                return { status: 400 };
            }
            return {
                status: 200,
                result,
                metadata: this.makeMetadata(Number(body.page), Number(body.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getPublicOperators(pagination) {
        const count = await this.prisma.client.count({
            where: {
                roles: { has: ClientRoles_1.default.operator_estate_agent },
            },
        });
        const total = this.getTotalPageNumber(Number(count), Number(pagination.per_page));
        const paginationValue = this.makePagination(Number(pagination.page), Number(pagination.per_page));
        const clients = await this.prisma.client.findMany({
            where: {
                roles: { has: ClientRoles_1.default.operator_estate_agent },
            },
            skip: paginationValue.offset,
            take: paginationValue.per_page,
            orderBy: { id: "desc" },
        });
        return {
            clients,
            metadata: this.makeMetadata(Number(pagination.page), Number(pagination.per_page), Number(total)),
        };
    }
    async saveNewPublicOperators(body) {
        try {
            let status = 201;
            let client = await this.prisma.client.findFirst({
                where: {
                    id: Number(body.client_id),
                },
            });
            const clientRoles = client.roles;
            if (clientRoles.includes(ClientRoles_1.default.operator_estate_agent)) {
                status = 200;
            }
            else if (clientRoles.includes(ClientRoles_1.default.estate_agent)) {
                status = 400;
            }
            if (status === 400) {
                return { status: 400 };
            }
            const checkExistOperator = await this.prisma.operator_realEstateAgents.findFirst({
                where: {
                    client_id: Number(body.client_id),
                },
            });
            if (!checkExistOperator) {
                await this.addRole(Number(body.client_id), ClientRoles_1.default.operator_estate_agent);
                await this.prisma.operator_realEstateAgents.create({
                    data: {
                        client_id: Number(body.client_id),
                    },
                });
                status = 201;
            }
            else {
                status = 200;
                await this.removeRole(Number(body.client_id), ClientRoles_1.default.operator_estate_agent);
                await this.prisma.operator_realEstateAgents.deleteMany({
                    where: {
                        client_id: Number(body.client_id),
                    },
                });
            }
            client = await this.prisma.client.findFirst({
                where: {
                    id: Number(body.client_id),
                },
            });
            return {
                client,
                status,
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async deletePublicOperator(body) {
        try {
            const user = await this.prisma.users.findFirst({
                where: { id: Number(body.user_id) },
            });
            if (!user) {
                return { status: 403 };
            }
            const clients = await this.prisma.client.findFirst({
                where: {
                    id: Number(body.client_id),
                    roles: { has: ClientRoles_1.default.operator_estate_agent },
                },
            });
            if (!clients) {
                return { status: 400 };
            }
            await this.removeRole(Number(body.client_id), ClientRoles_1.default.operator_estate_agent);
            await this.prisma.operator_realEstateAgents.deleteMany({
                where: { client_id: Number(body.client_id) },
            });
            return {
                clients,
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async addRole(client_id, role) {
        await this.prisma.client.update({
            where: { id: client_id },
            data: { roles: { push: [role] } },
        });
    }
    async removeRole(client_id, role) {
        const clientInfo = await this.prisma.client.findFirst({
            where: { id: Number(client_id) },
        });
        const roles = clientInfo.roles;
        if (roles.includes(role)) {
            roles.splice(roles.indexOf(role), 1);
        }
        await this.prisma.client.update({
            where: { id: client_id },
            data: { roles },
        });
    }
    async generateKeyForClients(user_id) {
        const user = await this.prisma.users.findUnique({
            where: { id: Number(user_id) },
        });
        if (!user) {
            return { status: 403 };
        }
        const clients = await this.prisma.client.findMany({});
        await Promise.all(clients.map(async (client) => {
            if (client.key === "") {
                const key = await this.generateKey();
                await this.prisma.client.update({
                    where: { id: client.id },
                    data: { key },
                });
            }
        }));
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
    async findOne(phone) {
        return await this.prisma.client.findFirst({
            where: { phone },
        });
    }
    async findOneByID(client_id) {
        console.log("findOneByID");
        return await this.prisma.client.findUnique({
            where: { id: Number(client_id) },
        });
    }
    async updateToken(id, token) {
        return await this.prisma.client.update({
            where: {
                id: id,
            },
            data: {
                token: token,
            },
        });
    }
    async updateOne(where, updatedData) {
        return await this.prisma.client.update({
            where,
            data: updatedData,
        });
    }
    generateCode(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
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
};
ClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map