import { ApiProperty } from "@nestjs/swagger";

export class ChangeCoverMediaProductDto {
  client_id: number;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  item_id: number;
}
