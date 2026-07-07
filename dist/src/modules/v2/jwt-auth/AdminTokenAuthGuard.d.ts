import { CanActivate, ExecutionContext } from "@nestjs/common";
export default class AdminTokenAuthGuard implements CanActivate {
    private jwtService;
    private prismaService;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    private validateToken;
}
