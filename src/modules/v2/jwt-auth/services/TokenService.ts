import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  public singClientToken(payload: any): void {}

  public verifyClientToken(token: string): any {
    try {
      const { sub } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return sub;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
