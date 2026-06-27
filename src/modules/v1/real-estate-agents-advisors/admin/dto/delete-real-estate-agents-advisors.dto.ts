import { ApiProperty } from "@nestjs/swagger";

export class DeleteRealEstateAgentsAdvisorsDto {
  client_id: number;

  @ApiProperty()
  agent_id: number;

  @ApiProperty()
  advisor_id: number;
}
