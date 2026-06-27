export declare class CreateRealEstateAgentsAdvisorDto {
    client_id: string;
    agent_id: number;
    phone: string;
    permissions: string[];
}
export declare class UpdatePermissionsForAdvisorDto {
    advisor_id: number;
    permissions: string[];
}
