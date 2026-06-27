import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreatePrizeDto {
  user_id: number;

  @ApiProperty()
  item_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ isArray: true, type: "string" })
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  coupons: [];
  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  point: number;

  @ApiProperty({
    name: "thumbnail",
    type: "string",
    format: "binary",
    required: false,
  })
  thumbnail: string;
}
