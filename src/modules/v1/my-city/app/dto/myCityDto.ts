import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length } from "class-validator";

export class MyCityDto {
  @ApiProperty({ type: String })
  category: string;

  @ApiProperty({ type: String })
  title: string;

  @IsOptional()
  @ApiProperty({ type: String })
  description: string;

  @IsOptional()
  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Number })
  number_of_rooms: number;

  @ApiProperty({ type: String })
  status: string;

  @IsOptional()
  @ApiProperty({ type: String })
  renovation_tax: string;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Number })
  province_id: number;

  @ApiProperty({ type: Number })
  city_id: number;
}
