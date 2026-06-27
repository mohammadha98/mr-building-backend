import { HttpException, HttpStatus } from "@nestjs/common";

export class ConflictErrorHandler extends HttpException {
  constructor(message: any) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message,
        error: "CONFLICT",
        data: {},
      },
      HttpStatus.CONFLICT
    );
  }
}
