import { HttpException } from "@nestjs/common";
export declare class BadRequestErrorHandler extends HttpException {
    constructor(message: any);
}
