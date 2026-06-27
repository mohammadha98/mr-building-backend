import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsString } from "class-validator";
import InstalledVersionTypes from "src/commons/contracts/InstalledVersionTypes";

export class CreateForceUpdateDto {
  user_id: number;

  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty({
    enum: InstalledVersionTypes,
    default: InstalledVersionTypes.direct,
    required: false,
  })
  installed_version_type: string;

  @ApiProperty({ type: "boolean" })
  @IsBooleanString()
  required: boolean;

  @ApiProperty({ isArray: true, type: "string" })
  items: string[];

  @ApiProperty({
    name: "file_apk",
    type: "string",
    format: "binary",
    required: false,
  })
  file_apk: string;

  @ApiProperty({ required: false })
  @IsString()
  indirect_link: string;
}
