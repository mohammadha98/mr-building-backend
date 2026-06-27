import { ApiProperty } from "@nestjs/swagger";

export class DeleteRealEstateAdItemsDto {
  client_id: number;

  @ApiProperty()
  ad_id: string;

  @ApiProperty()
  reasons: string[];
}
