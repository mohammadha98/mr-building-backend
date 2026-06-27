import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;
}
