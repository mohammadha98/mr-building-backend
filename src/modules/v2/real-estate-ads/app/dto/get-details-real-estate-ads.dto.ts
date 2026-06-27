import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum AdsDetailTags {
  mrbuilding = "mr-building",
  divar = "divar",
}
export class GetDetailsRealEstateAdItemsDto {
  client_id: number;

  @ApiProperty({ required: false })
  item_id: string;

  @ApiProperty({ required: false })
  tracking_code: string;
}
