import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { users } from "@prisma/client";

export default class AdminTokenAuthGuard implements CanActivate {
  private jwtService: JwtService;
  private prismaService: PrismaService;

  constructor() {
    this.jwtService = new JwtService();
    this.prismaService = new PrismaService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const bearerToken = request.headers["authorization"] as string;

    if (bearerToken) {
      const token = bearerToken.slice(
        bearerToken.indexOf(" ") + 1,
        bearerToken.length
      );

      const decodedToken = this.jwtService.decode(token);

      if (!decodedToken) {
        throw new ForbiddenException();
      }

      if (this.validateToken(token)) {
        const validateAdminUser = await this.prismaService.users.findFirst({
          where: { uniqKey: decodedToken.sub },
        });

        if (!validateAdminUser) {
          throw new ForbiddenException();
        }
        request.user = validateAdminUser as users;
        return true;
      }
      return false;
    }
    return false;
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
