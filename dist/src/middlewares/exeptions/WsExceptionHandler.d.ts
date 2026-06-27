import { ArgumentsHost } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";
export declare class WsExceptionHandler extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
