import { ApiProperty } from "@nestjs/swagger";

export class saveNewSuspiciousBehavior {
  client_id: number;

  @ApiProperty()
  ad_id: number;

  @ApiProperty()
  reasons: string[];
}
