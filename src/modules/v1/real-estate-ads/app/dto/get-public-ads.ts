import { ApiProperty } from "@nestjs/swagger";

export class GetPublicAdsDto {
  client_id: number;

  @ApiProperty({ isArray: true, type: "string", name: "ad_type" })
  ad_type: string[];

  @ApiProperty({ isArray: true, type: "integer", name: "province" })
  province: number[];

  @ApiProperty({ isArray: true, type: "integer", name: "city" })
  city: number[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;
}
