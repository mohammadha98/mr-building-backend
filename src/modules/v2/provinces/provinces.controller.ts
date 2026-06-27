import {
  Controller,
  Get
} from "@nestjs/common";
import { ProvincesService } from "./provinces.service";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";

@Controller("v2/provinces")
@ApiTags("v2/provinces")
export class ProvincesController {
  private readonly responseHandler: HttpResponsehandler;

  constructor(private readonly provincesService: ProvincesService) {
    this.responseHandler = new HttpResponsehandler();
  }

  @ApiOkResponse({
    description: "لیست استان ها و شهرتان ها  در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست استان ها و شهرتان ها  در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "String", example: "title" },
              cities: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "String", example: "title" },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست استان ها و شهرتان ها" })
  @Get("/all")
  async findAll() {
    const result = await this.provincesService.findAll();
    return {
      statusCode: 200,
      message: "لیست استان ها و شهرتان ها  در دسترس است.",
      data: result,
    };
  }

  @ApiOkResponse({
    description: "لیست  استان ها  در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست  استان ها  در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "String", example: "title" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "لیست استان ها   " })
  @Get()
  async findProvinces() {
    const result = await this.provincesService.findProvinces();
    return {
      statusCode: 200,
      message: "لیست  استان ها  در دسترس است.",
      data: result,
    };
  }
}
