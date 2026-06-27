"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
class ClientTokenAuthGuardSocket {
    constructor() {
        this.jwtService = new jwt_1.JwtService();
        this.prismaService = new prisma_service_1.PrismaService();
    }
    async canActivate(context) {
        const httpContext = context.switchToWs();
        const request = httpContext.getClient();
        const authorization = request.handshake.headers.authorization;
        if (!authorization || authorization === "") {
            return false;
        }
        const token = this.jwtService.verify(authorization, {
            secret: process.env.JWT_SECRET_KEY,
        });
        if (token) {
            const validateClientId = await this.prismaService.client.findFirst({
                where: { id: token.sub },
            });
            if (!validateClientId) {
                throw new common_1.UnauthorizedException();
            }
            request.data = validateClientId;
            return true;
        }
        return false;
    }
}
exports.default = ClientTokenAuthGuardSocket;
//# sourceMappingURL=ClientTokenAuthGuard_Socket.js.map