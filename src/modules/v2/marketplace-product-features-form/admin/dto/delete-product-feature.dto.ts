import { ApiProperty } from "@nestjs/swagger";

export class DeleteProductFeatureDto {
  client_id: number;

  @ApiProperty()
  item_id: string;
}
