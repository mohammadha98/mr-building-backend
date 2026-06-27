import { ApiProperty } from "@nestjs/swagger";

export class CreateRealEstateAdFormsDto {
  user_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
