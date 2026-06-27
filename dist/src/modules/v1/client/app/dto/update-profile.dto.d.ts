import { CreateClientDto } from "./create-client.dto";
declare const UpdateClienProfiletDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateClientDto>>;
export declare class UpdateClienProfiletDto extends UpdateClienProfiletDto_base {
    client_id: number;
    name: string;
    surname: string;
    avatar: string;
}
export {};
