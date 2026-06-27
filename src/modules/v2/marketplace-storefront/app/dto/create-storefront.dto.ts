import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateStorefrontDto {
  user_id: number;
  oldAvatar: string;
  oldLicense: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({
    name: "avatar",
    type: "string",
    format: "binary",
    required: false,
  })
  avatar: string;

  @ApiProperty({
    name: "license",
    type: "string",
    format: "binary",
    required: false,
  })
  license: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  @IsNumberString()
  province_id: number;

  @ApiProperty()
  @IsNumberString()
  city_id: number;
}
