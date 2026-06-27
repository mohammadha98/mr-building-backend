import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

export default class ClientTokenAuthGuardSocket implements CanActivate {
  private jwtService: JwtService;
  private prismaService: PrismaService;

  constructor() {
    this.jwtService = new JwtService();
    this.prismaService = new PrismaService();
  }

  async canActivate(context: ExecutionContext) {
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
        throw new UnauthorizedException();
      }
      request.data = validateClientId;
      return true;
    }
    return false;
  }
}
