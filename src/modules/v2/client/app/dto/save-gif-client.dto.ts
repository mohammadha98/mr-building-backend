import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SaveGifClientDto extends PartialType(CreateClientDto) {
  client_id: number;

  @ApiProperty({
    name: "file",
    type: "string",
    format: "binary",
    required: true,
  })
  file: string;
}
