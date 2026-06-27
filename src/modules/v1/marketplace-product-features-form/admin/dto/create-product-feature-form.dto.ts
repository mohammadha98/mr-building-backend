import { ApiProperty } from "@nestjs/swagger";

export class createProductFeatureFormsDto {
  user_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
