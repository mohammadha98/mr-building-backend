import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { SliderEnum } from "../enums/slider.enum";

export class CreateSliderDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: SliderEnum, default: SliderEnum.home })
  @IsEnum(SliderEnum)
  tag: string;

  @ApiProperty({ name: "thumbnail", type: "string", format: "binary" })
  thumbnail: string;
}
