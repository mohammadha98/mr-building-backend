import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenErrorHandler extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: "خطا. اجازه ادامه کار را ندارید.",
        error: "Forbidden",
        data: {},
      },
      HttpStatus.FORBIDDEN
    );
  }
}
