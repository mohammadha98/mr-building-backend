import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class SearchForRealEstateAgentDto {
  client_id: number;
  @ApiProperty()
  @IsString()
  keyword: string;

  @ApiProperty()
  province_id: number;

  @ApiProperty()
  city_id: number;

  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: number;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: number;
}
