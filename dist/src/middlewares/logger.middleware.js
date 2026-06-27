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
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LoggerMiddleware = class LoggerMiddleware {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.logger = new common_1.Logger("HTTP");
    }
    use(req, res, next) {
        const { method, baseUrl } = req;
        const ip = req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress;
        req.ip_address = ip;
        this.logger.log("--- Logger ---");
        this.logger.log(`Ip: ${ip}`);
        this.logger.log(`clientId: ${req.client.id}`);
        const userAgent = req.get("user-agent") || "";
        const startAt = process.hrtime();
        res.on("finish", async () => {
            const { statusCode } = res;
            const contentLength = res.get("content-length");
            const diff = process.hrtime(startAt);
            const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
            if (statusCode == 400 ||
                statusCode == 401 ||
                statusCode == 403 ||
                statusCode == 404 ||
                statusCode === 422 ||
                statusCode === 500 ||
                statusCode == 401) {
                try {
                    await this.prismaService.logger.create({
                        data: {
                            method,
                            baseUrl,
                            status_code: statusCode,
                            content_length: contentLength || "0",
                            response_time: responseTime.toFixed(2),
                            user_agent: userAgent,
                            ip,
                        },
                    });
                    this.logger.log(`${method} ${baseUrl} ${statusCode} ${contentLength} - ${responseTime.toFixed(2)} ms ${userAgent} ${ip} `);
                }
                catch (error) {
                    next(error);
                }
            }
        });
        next();
    }
};
LoggerMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoggerMiddleware);
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map