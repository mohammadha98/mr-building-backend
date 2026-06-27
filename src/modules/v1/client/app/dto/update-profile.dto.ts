import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateClienProfiletDto extends PartialType(CreateClientDto) {
  @IsOptional()
  client_id: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  surname: string;

  @ApiProperty({
    name: "avatar",
    type: "string",
    format: "binary",
    required: false,
  })
  avatar: string;
}
