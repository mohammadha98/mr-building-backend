import { ApiProperty } from "@nestjs/swagger";

export default class BadRequestSchema {
  @ApiProperty({
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    example:
      "خطا. درخواست به درستی ارسال نشده است. لطفا اطلاعات ارسالی را بررسی کنید.",
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
