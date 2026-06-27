import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsOptional()
  id: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  surname: string;

  @ApiProperty({ required: false })
  province: string;

  @ApiProperty({ required: false })
  city: string;

  @IsString()
  @IsOptional()
  token: string;

  // @ApiProperty({
  //   name: "avatar",
  //   type: "string",
  //   format: "binary",
  //   required: true,
  // })
  // avatar: string;
}
