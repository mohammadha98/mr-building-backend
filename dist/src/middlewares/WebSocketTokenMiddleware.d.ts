import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
export declare class WebSocketTokenMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction): void;
}
