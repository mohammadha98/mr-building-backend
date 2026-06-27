import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export default class TokenAuthGuardClient implements CanActivate {
  private jwtService: JwtService;
  private prismaService: PrismaService;

  constructor() {
    this.jwtService = new JwtService();
    this.prismaService = new PrismaService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const bearerToken = request.headers["authorization"] as string;

    if (bearerToken) {
      const token = bearerToken.slice(
        bearerToken.indexOf(" ") + 1,
        bearerToken.length
      );

      const decodedToken = this.jwtService.decode(token);

      if (!decodedToken) {
        throw new UnauthorizedException();
      }

      if (this.validateToken(token)) {
        const validateAdminUser = await this.prismaService.client.findFirst({
          where: { id: decodedToken.sub },
        });
        if (!validateAdminUser) {
          throw new UnauthorizedException();
        }
        request.client = validateAdminUser;
        return true;
      }
      throw new UnauthorizedException();
    }
    throw new UnauthorizedException();
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const verify = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      if (!verify) {
        return false;
      }
      return verify;
    } catch (error) {
      return false;
    }
  }
}
