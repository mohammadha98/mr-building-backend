import { ApiProperty } from "@nestjs/swagger";

export class DeleteRealEstateAgentsAdminsDto {
  client_id: number;

  @ApiProperty()
  agent_id: number;

  @ApiProperty()
  admin_id: number;
}
