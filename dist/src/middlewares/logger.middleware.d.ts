import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "../../prisma/prisma.service";
export declare class LoggerMiddleware implements NestMiddleware {
    private prismaService;
    private logger;
    constructor(prismaService: PrismaService);
    use(req: Request, res: Response, next: NextFunction): void;
}
