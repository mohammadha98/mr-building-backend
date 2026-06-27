import { ApiProperty } from "@nestjs/swagger";

export class UpdateRealEstateAdsFormsDto {
  user_id: number;

  @ApiProperty()
  form_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
