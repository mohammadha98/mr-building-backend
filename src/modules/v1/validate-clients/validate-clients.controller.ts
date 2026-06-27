import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
} from "@nestjs/common";
import { ValidateClientsService } from "./validate-clients.service";
import { CreateValidateClientDto } from "./dto/create-validate-client.dto";
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FormDataRequest } from "nestjs-form-data";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import CodeGenerator from "src/modules/services/codeGenerator";
import { VerifyCodeValidateClientDto } from "./dto/verify-validate-client.dto";
import { BadRequestErrorHandler } from "src/modules/services/httpResponseHandler/badRequestErrorHandler";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-validate-clients")
@Controller("v1/app/validate-clients")
export class ValidateClientsController {
  constructor(
    private readonly validateClientsService: ValidateClientsService,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @ApiCreatedResponse({
    description: "کد تایید ارسال شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "کد تایید ارسال شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "ثبت شماره و احراز هویت " })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post()
  async validatePhone(
    @Body() body: CreateValidateClientDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    body.code = CodeGenerator();

    console.log("*** Validate Client Phone Number ***");
    console.log(body);

    const result = await this.validateClientsService.create(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 201, "کد تایید ارسال شد.", {
      code: body.code,
    });
  }

  @ApiCreatedResponse({
    description: "کد ارسالی تایید شد. شماره شما فعال گردید.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "کد ارسالی تایید شد. شماره شما فعال گردید.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "وریفای " })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("verify")
  async VerifyValidatePhone(
    @Body() body: VerifyCodeValidateClientDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("*** Verify: Validate Client Phone Number ***");
    console.log(body);

    const result = await this.validateClientsService.VerifyValidatePhone(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 400) {
      throw new BadRequestErrorHandler("خطا. کد ارسالی صحیح نمیباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      201,
      "کد ارسالی تایید شد. شماره شما فعال گردید."
    );
  }
}
