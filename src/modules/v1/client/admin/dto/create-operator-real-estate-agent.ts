import { ApiProperty } from "@nestjs/swagger";

export class CreateOperatorRealEstateAgentDto {
  user_id: number;

  @ApiProperty()
  client_id: number;
}
