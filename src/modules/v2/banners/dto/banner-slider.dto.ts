import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { BannerEnum } from "../enums/banner.enum";

export class BannerSliderDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: BannerEnum, default: BannerEnum.home })
  @IsEnum(BannerEnum)
  tag: string;

  @ApiProperty({ nullable: true, default: null })
  url: string | null;

  @ApiProperty({ name: "thumbnail", type: "string", format: "binary" })
  thumbnail: string;
}
