import { ApiProperty } from "@nestjs/swagger";

export class GetDetailsRealEstateAdItemsDto {
  client_id: number;

  @ApiProperty({ required: false })
  item_id: string;

  @ApiProperty({ required: false })
  tracking_code: string;
}
