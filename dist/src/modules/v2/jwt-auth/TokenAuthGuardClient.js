"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
class TokenAuthGuardClient {
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
                throw new common_1.UnauthorizedException();
            }
            if (this.validateToken(token)) {
                const validateAdminUser = await this.prismaService.client.findFirst({
                    where: { id: decodedToken.sub },
                });
                if (!validateAdminUser) {
                    throw new common_1.UnauthorizedException();
                }
                request.client = validateAdminUser;
                return true;
            }
            throw new common_1.UnauthorizedException();
        }
        throw new common_1.UnauthorizedException();
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
exports.default = TokenAuthGuardClient;
//# sourceMappingURL=TokenAuthGuardClient.js.map