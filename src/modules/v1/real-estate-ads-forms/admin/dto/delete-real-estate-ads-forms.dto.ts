import { ApiProperty } from "@nestjs/swagger";

export class DeleteRealEstateAdFormsItemDto {
  client_id: number;

  @ApiProperty()
  item_id: string;
}
