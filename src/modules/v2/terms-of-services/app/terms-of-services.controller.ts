import { Controller, Get, Request, Response } from "@nestjs/common";
import { TermsOfServicesService } from "./terms-of-services.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import TermsOfServicetarnsformer from "./Transformer";

@ApiTags("v2/terms-of-services")
@Controller("v2/terms-of-services")
export class TermsOfServicesController {
  constructor(
    private readonly termsOfServicesService: TermsOfServicesService,
    private readonly termsOfServicetarnsformer: TermsOfServicetarnsformer,
    private readonly httpResponsehandler: HttpResponsehandler
  ) {}

  @ApiOkResponse({
    description: "قوانین در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "قوانین در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            content: { type: "string" },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت  قوانین" })
  @Get()
  async findAll(@Request() req: any, @Response() res: Response) {
    const result = await this.termsOfServicesService.findAll();

    const transformer = this.termsOfServicetarnsformer.transform(result.result);
    this.httpResponsehandler.send(
      res,
      200,
      "قوانین در دسترس است.",
      transformer
    );
  }
}
