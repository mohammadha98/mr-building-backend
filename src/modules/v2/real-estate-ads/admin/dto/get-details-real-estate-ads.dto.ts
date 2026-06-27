import { ApiProperty } from "@nestjs/swagger";

export class GetDetailsRealEstateAdItemsDto {
  user_id: number;

  @ApiProperty({ required: false })
  tracking_code: string;
}
