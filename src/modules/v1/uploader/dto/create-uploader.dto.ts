import { ApiProperty } from "@nestjs/swagger";
import UploaderFileTypes from "src/commons/contracts/UploaderFileTypes";
import UploaderSources from "src/commons/contracts/UploaderSources";

export class CreateUploaderDto {
  client_id: number;
  size: number;

  @ApiProperty()
  key: string;

  @ApiProperty({
    enum: UploaderFileTypes,
    default: UploaderFileTypes.image,
  })
  file_type: string;

  @ApiProperty({
    enum: UploaderSources,
    default: UploaderSources.chat_real_estate,
  })
  source: string;

  @ApiProperty({ name: "file", type: "string", format: "binary" })
  file: string;
}
