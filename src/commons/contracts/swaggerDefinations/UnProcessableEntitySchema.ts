import { ApiProperty } from "@nestjs/swagger";

export default class UnProcessableEntitySchema {
  @ApiProperty({
    example: 422,
  })
  statusCode: number;

  @ApiProperty({
    example: [
      {
        field: "username",
        error: "یوزرنیم را ارسال کنید",
      },
      {
        field: "age",
        error: "سن کاربر را ارسال کنید",
      },
      {
        field: "age",
        error: "تاریخ تولد کاربر را ارسال کنید",
      },
    ],
  })
  message: string[];

  @ApiProperty({
    example: "UnProcessable Entity",
  })
  error: string;

  @ApiProperty({
    example: {},
  })
  data: object;
}
