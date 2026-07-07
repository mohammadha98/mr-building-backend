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
exports.ForceUpdateService = void 0;
const common_1 = require("@nestjs/common");
const Statuses_1 = require("../../../../commons/contracts/Statuses");
const UserPrismaRepository_1 = require("../../users/admin/repositories/UserPrismaRepository");
const prisma_service_1 = require("../../../../../prisma/prisma.service");
const fs_1 = require("fs");
const path_1 = require("path");
const client_service_1 = require("../../client/app/client.service");
const InstalledVersionTypes_1 = require("../../../../commons/contracts/InstalledVersionTypes");
const FcmNotificationService_1 = require("../../../services/notifications/fcm/FcmNotificationService");
let ForceUpdateService = class ForceUpdateService {
    constructor(prismaService, clientService, userPrismaRepository, fcmNotificationService) {
        this.prismaService = prismaService;
        this.clientService = clientService;
        this.userPrismaRepository = userPrismaRepository;
        this.fcmNotificationService = fcmNotificationService;
    }
    async changeStatus(body) {
        try {
            const user = await this.userPrismaRepository.findOneByID(Number(Number(body.user_id)));
            if (!user) {
                return { status: 403 };
            }
            const item = await this.prismaService.forceUpdate.findUnique({
                where: { id: Number(body.item_id) },
            });
            if (!item) {
                return { status: 400, message: "خطا. آیتم موردنظر موجود نمیباشد." };
            }
            await this.prismaService.forceUpdate.update({
                where: {
                    id: Number(body.item_id),
                },
                data: { status: body.status },
            });
            return {
                status: 201,
            };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async findAll(query) {
        try {
            const user = await this.userPrismaRepository.findOneByID(Number(Number(query.user_id)));
            if (!user) {
                return { status: 403 };
            }
            const count = await this.prismaService.forceUpdate.count();
            const total = this.getTotalPageNumber(Number(count), Number(query.per_page));
            const paginationValue = this.makePagination(Number(query.page), Number(query.per_page));
            const result = await this.prismaService.forceUpdate.findMany({
                orderBy: { id: "desc" },
                skip: paginationValue.offset,
                take: paginationValue.per_page,
            });
            const total_clients = await this.prismaService.client.count();
            return {
                status: 200,
                result,
                total_clients,
                metadata: this.makeMetadata(Number(query.page), Number(query.per_page), Number(total)),
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async storeForceUpdate(body) {
        try {
            const user = await this.userPrismaRepository.findOneByID(Number(Number(body.user_id)));
            if (!user) {
                return { status: 403 };
            }
            await this.prismaService.forceUpdate.updateMany({
                where: {
                    status: Statuses_1.default.active,
                    installed_version_type: body.installed_version_type,
                },
                data: { status: Statuses_1.default.inactive },
            });
            if (body.file_apk) {
                body.indirect_link = null;
            }
            if (body.installed_version_type !== InstalledVersionTypes_1.default.direct) {
                body.file_apk = null;
            }
            const result = await this.prismaService.forceUpdate.create({
                data: {
                    installed_version_type: body.installed_version_type,
                    version: body.version,
                    required: JSON.parse(body.required),
                    file_name: body.file_apk,
                    indirect_link: body.indirect_link,
                    title: "",
                    content: body.content,
                    items: body.items,
                    status: Statuses_1.default.active,
                    user_id: Number(body.user_id),
                },
                select: {
                    id: true,
                    required: true,
                    installed_version_type: true,
                    version: true,
                    file_name: true,
                    indirect_link: true,
                    total_installs: true,
                    status: true,
                    content: true,
                    items: true,
                },
            });
            await this.fcmNotificationService.sendToTopic({
                body: JSON.stringify({ source: "force_update" }),
                title: "نسخه جدید رسید",
                key: "force_update",
                topic: "force_update",
            });
            if (!body.installed_version_type) {
                body.installed_version_type = InstalledVersionTypes_1.default.direct;
            }
            await this.clientService.activateUpdates(body.installed_version_type);
            const total_clients = await this.prismaService.client.count();
            return {
                status: 200,
                result,
                total_clients,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async remove(body) {
        try {
            const user = await this.userPrismaRepository.findOneByID(Number(Number(body.user_id)));
            if (!user) {
                return { status: 403 };
            }
            const item = await this.prismaService.forceUpdate.findUnique({
                where: { id: Number(body.item_id) },
            });
            if (!item) {
                return { status: 400, message: "خطا. آیتم موردنظر موجود نمیباشد." };
            }
            const condition = this.makeUpdateCondition(item.installed_version_type);
            if (item.status === Statuses_1.default.active) {
                await this.prismaService.client.updateMany({
                    where: condition.where,
                    data: condition.data,
                });
            }
            await this.removeFileFromStorage(item.file_name, "./../../../../public/contents/force_updates/");
            await this.prismaService.forceUpdate.delete({
                where: {
                    id: Number(body.item_id),
                },
            });
            return {
                status: 201,
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    makeUpdateCondition(installed_version_type) {
        const forceUpdateCondition = {
            direct: {
                where: { has_update_direct: true },
                data: { has_update_direct: false },
            },
            cafebazar: {
                where: { has_update_cafebazar: true },
                data: { has_update_cafebazar: false },
            },
            myket: {
                where: { has_update_myket: true },
                data: { has_update_myket: false },
            },
            google_play: {
                where: { has_update_google_play: true },
                data: { has_update_google_play: false },
            },
        };
        const condition = {
            where: {},
            data: {},
        };
        if (installed_version_type === "direct") {
            condition.where = forceUpdateCondition.direct.where;
            condition.data = forceUpdateCondition.direct.data;
        }
        else if (installed_version_type === "cafebazar") {
            condition.where = forceUpdateCondition.cafebazar.where;
            condition.data = forceUpdateCondition.cafebazar.data;
        }
        else if (installed_version_type === "myket") {
            condition.where = forceUpdateCondition.myket.where;
            condition.data = forceUpdateCondition.myket.data;
        }
        else if (installed_version_type === "google_play") {
            condition.where = forceUpdateCondition.google_play.where;
            condition.data = forceUpdateCondition.google_play.data;
        }
        return condition;
    }
    async removeFileFromStorage(file_name, destination) {
        try {
            if ((0, fs_1.existsSync)((0, path_1.join)(__dirname, destination, file_name))) {
                (0, fs_1.unlinkSync)((0, path_1.join)(__dirname, destination, file_name));
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
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
};
ForceUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        client_service_1.ClientService,
        UserPrismaRepository_1.default,
        FcmNotificationService_1.default])
], ForceUpdateService);
exports.ForceUpdateService = ForceUpdateService;
//# sourceMappingURL=force-update.service.js.map