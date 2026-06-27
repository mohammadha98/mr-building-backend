import { ApiProperty } from "@nestjs/swagger";

export class EstimatePriceAd {
  client_id: number;

  @ApiProperty()
  ad_id: number;

  @ApiProperty()
  status: string;
}
