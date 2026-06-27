import { CanActivate, ExecutionContext } from "@nestjs/common";
export default class ClientTokenAuthGuardSocket implements CanActivate {
    private jwtService;
    private prismaService;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
