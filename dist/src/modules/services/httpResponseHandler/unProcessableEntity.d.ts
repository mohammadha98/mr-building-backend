import { HttpException } from "@nestjs/common";
export declare class UnProcessableEntity extends HttpException {
    constructor(message: any);
}
