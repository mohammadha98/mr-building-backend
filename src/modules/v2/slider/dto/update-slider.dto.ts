import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { SliderEnum } from "../enums/slider.enum";

export class UpdateSliderDto {
  @ApiProperty()
  @IsString()
  item_id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: SliderEnum, default: SliderEnum.home })
  @IsEnum(SliderEnum)
  tag: string;

  @ApiProperty({
    name: "file",
    type: "string",
    format: "binary",
    required: false,
  })
  file: string;
}
