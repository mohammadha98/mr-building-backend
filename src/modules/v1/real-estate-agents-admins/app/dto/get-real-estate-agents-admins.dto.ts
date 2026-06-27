import { ApiProperty } from "@nestjs/swagger";

export class GetRealEstateAgentsAdminsDto {
  client_id: number;

  @ApiProperty()
  agent_id: number;
}
