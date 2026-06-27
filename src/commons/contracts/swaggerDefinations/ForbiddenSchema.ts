import { ApiProperty } from "@nestjs/swagger";

export default class ForbiddenSchema {
  @ApiProperty({
    example: 403,
  })
  statusCode: number;

  @ApiProperty({
    example: "خطا. اجازه ادامه کار را ندارید.",
  })
  message: string;

  @ApiProperty({
    example: "Forbidden",
  })
  error: string;

  @ApiProperty({
    example: {},
  })
  data: object;
}
