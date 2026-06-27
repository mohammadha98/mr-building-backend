import { CreateRealEstateAgentDto } from "./create-real-estate-agent.dto";
declare const UpdateRealEstateAgentDto_base: import("@nestjs/common").Type<Partial<CreateRealEstateAgentDto>>;
export declare class UpdateRealEstateAgentDto extends UpdateRealEstateAgentDto_base {
    estate_agent_id: number;
    name: string;
    avatar: string;
    license: string;
    province_id: number;
    city_id: number;
}
export {};
