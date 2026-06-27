import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PaginationSchema {
  @ApiProperty({ type: "integer", example: "1" })
  page: number;

  @ApiProperty({ type: "integer", example: "12" })
  per_page: number;
}
