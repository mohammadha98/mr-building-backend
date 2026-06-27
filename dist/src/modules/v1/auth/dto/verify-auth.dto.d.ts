import { RegisterAuthDto } from "./register-auth.dto";
declare const VerifyAuthDto_base: import("@nestjs/mapped-types").MappedType<Partial<RegisterAuthDto>>;
export declare class VerifyAuthDto extends VerifyAuthDto_base {
    key: string;
    phone: string;
    code: number;
}
export {};
