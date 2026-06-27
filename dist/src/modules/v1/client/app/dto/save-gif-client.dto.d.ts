import { CreateClientDto } from "./create-client.dto";
declare const SaveGifClientDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateClientDto>>;
export declare class SaveGifClientDto extends SaveGifClientDto_base {
    client_id: number;
    file: string;
}
export {};
