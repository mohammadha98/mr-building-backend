import { HttpException, HttpStatus } from "@nestjs/common";

export class UnAuthorizationErrorHandler extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "خطا. احراز هویت انجام نشده است.",
        error: "Unauthorized",
        data: {},
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}
