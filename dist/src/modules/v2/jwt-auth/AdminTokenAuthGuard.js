"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
class AdminTokenAuthGuard {
    constructor() {
        this.jwtService = new jwt_1.JwtService();
        this.prismaService = new prisma_service_1.PrismaService();
    }
    async canActivate(context) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const bearerToken = request.headers["authorization"];
        if (bearerToken) {
            const token = bearerToken.slice(bearerToken.indexOf(" ") + 1, bearerToken.length);
            const decodedToken = this.jwtService.decode(token);
            if (!decodedToken) {
                throw new common_1.ForbiddenException();
            }
            if (this.validateToken(token)) {
                const validateAdminUser = await this.prismaService.users.findFirst({
                    where: { uniqKey: decodedToken.sub },
                });
                if (!validateAdminUser) {
                    throw new common_1.ForbiddenException();
                }
                request.user = validateAdminUser;
                return true;
            }
            return false;
        }
        return false;
    }
    async validateToken(token) {
        try {
            const verify = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY,
            });
            if (!verify) {
                return false;
            }
            return verify;
        }
        catch (error) {
            return false;
        }
    }
}
exports.default = AdminTokenAuthGuard;
//# sourceMappingURL=AdminTokenAuthGuard.js.map