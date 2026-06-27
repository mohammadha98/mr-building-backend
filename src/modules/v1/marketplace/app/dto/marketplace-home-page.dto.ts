import { ApiProperty } from "@nestjs/swagger";

export class MarketplaceHomePageDto {
  @ApiProperty()
  province_id: number;

  @ApiProperty()
  city_id: number;
}
