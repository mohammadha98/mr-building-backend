import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class ListRealEstateAgentDto {
  user_id: number;

  @ApiProperty()
  @IsNumberString()
  province_id: number;

  @ApiProperty()
  @IsNumberString()
  city_id: number;

  @ApiProperty({ default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ default: 12 })
  @IsNumberString()
  per_page: string;
}
