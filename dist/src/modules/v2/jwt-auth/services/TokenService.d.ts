import { JwtService } from "@nestjs/jwt";
export declare class TokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    singClientToken(payload: any): void;
    verifyClientToken(token: string): any;
}
