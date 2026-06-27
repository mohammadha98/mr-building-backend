import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import ServicesTypes from "src/commons/contracts/ServicesTypes";

enum ServicesFileType {
  image = "image",
  video = "video",
}

export class CreateServiceMediaDto {
  user_id: number;

  @ApiProperty({ enum: ServicesFileType, default: ServicesFileType.video })
  @IsEnum(ServicesFileType)
  file_type: ServicesFileType;

  @ApiProperty({ enum: ServicesTypes, default: ServicesTypes.general })
  @IsEnum(ServicesTypes)
  type: ServicesTypes;

  @ApiProperty({ name: "file", type: "string", format: "binary" })
  file: string;
}
