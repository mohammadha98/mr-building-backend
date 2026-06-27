import { HttpException } from "@nestjs/common";
export declare class ConflictErrorHandler extends HttpException {
    constructor(message: any);
}
