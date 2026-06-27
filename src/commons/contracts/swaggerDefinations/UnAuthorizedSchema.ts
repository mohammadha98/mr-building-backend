import { ApiProperty } from "@nestjs/swagger";

export default class UnAuthorizedSchema {
  @ApiProperty({
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    example: "خطا. احراز هویت انجام نشده است.",
  })
  message: string;

  @ApiProperty({
    example: "",
  })
  error: string;

  @ApiProperty({
    example: {},
  })
  data: object;
}
