import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumberString } from "class-validator";

export enum GetTypes {
  normal = "normal",
  search = "search",
}

export class ClientListDto {
  @ApiProperty({ type: "integer", default: 1 })
  @IsNumberString()
  page: string;

  @ApiProperty({ type: "integer", default: 12 })
  @IsNumberString()
  per_page: string;
}
