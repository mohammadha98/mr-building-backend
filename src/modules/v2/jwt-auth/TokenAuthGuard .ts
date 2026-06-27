import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToWs().getClient();
    const token = request.handshake.headers.authorization
      ? request.handshake.headers.authorization
      : request.handshake.query["authorization"];

    console.log("token token toke10n token");

    if (this.validateToken(token)) {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      request.user = { id: decodedToken.sub };
      return true;
    }

    return false;
  }

  private validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
