import { ApiProperty } from "@nestjs/swagger";

export class CreateChannelRealEstateDto {
  @ApiProperty()
  agent_id: number;
}
