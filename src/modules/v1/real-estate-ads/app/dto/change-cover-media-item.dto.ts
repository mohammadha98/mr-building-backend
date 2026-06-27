import { ApiProperty } from "@nestjs/swagger";

export class ChangeCoverMediaDto {
  client_id: number;

  @ApiProperty()
  ad_id: number;

  @ApiProperty()
  item_id: number;
}
