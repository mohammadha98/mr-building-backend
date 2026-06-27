import {
  Controller,
  UseGuards,
  Request,
  Response,
  Get,
  Query,
  Param,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { PaginationDto } from "src/commons/contracts/Pagination.dto";
import { ReportService } from "./report.service";
import ReportsTransformer from "./Transformer";
import { GetReportsViolationsDto } from "./dto/get-reports-violations.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin/reports")
@Controller("v1/admin/reports")
export class ReportController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly reportBugsService: ReportService,
    private readonly transformer: ReportsTransformer
  ) {}

  // دریافت گزارشات ارسالی
  @ApiOkResponse({
    description: "لیست گزارشات ارسال در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گزارشات ارسال در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  content: { type: "string" },
                  image: { type: "string" },
                  voice: { type: "string" },
                  created_at: { type: "string" },
                  client: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      name: { type: "integer", example: 1 },
                    },
                  },
                },
              },
            },
            metadata: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                total_page: { type: "integer", example: 1 },
                per_page: { type: "integer", example: 1 },
                next: { type: "boolean", example: true },
                back: { type: "boolean", example: false },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت گزارشات ارسالی" })
  @Get("bugs")
  async getAll(
    @Query() query: PaginationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    // TODO: log
    console.log("*** Get Report Bug: ADMIN ***");
    console.log(query);

    const result = await this.reportBugsService.getAll(query);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.transformer.collection(result.list);

    return this.responseHandler.send(
      res,
      200,
      "لیست گزارشات ارسال در دسترس است.",
      {
        data: transformer,
        metadata: result.metadata,
      }
    );
  }

  //جزییات گزارشات ارسالی
  @ApiOkResponse({
    description: "جزییات گزارشات ارسالی در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "جزییات گزارشات ارسالی در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            content: { type: "string" },
            image: { type: "string" },
            voice: { type: "string" },
            created_at: { type: "string" },
            client: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                name: { type: "integer", example: 1 },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "جزییات گزارشات ارسالی" })
  @Get("/bugs/:id")
  async single(
    @Param("id") id: number,
    @Request() req: any,
    @Response() res: Response
  ) {
    const query = {
      client_id: req.user.id,
      id,
    };

    // TODO: log
    console.log("*** single Report Bug: ADMIN ***");
    console.log(query);

    const result = await this.reportBugsService.single(query);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    const transformer = this.transformer.transform(result.item);

    return this.responseHandler.send(
      res,
      200,
      "جزییات گزارشات ارسالی در دسترس است.",
      transformer
    );
  }

  // دریافت گزارشات محتوای نامناسب
  @ApiOkResponse({
    description: "لیست گزارشات ارسالی در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست گزارشات ارسالی در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                properties: {
                  id: { type: "integer", example: 1 },
                  description: { type: "string" },
                  type: { type: "string" },
                  created_at: { type: "string" },
                  client: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 1 },
                      name: { type: "integer", example: 1 },
                    },
                  },
                },
              },
            },
            metadata: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                total_page: { type: "integer", example: 1 },
                per_page: { type: "integer", example: 1 },
                next: { type: "boolean", example: true },
                back: { type: "boolean", example: false },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت گزارشات محتوای نامناسب" })
  @Get("violations")
  async getAllViolations(
    @Query() query: GetReportsViolationsDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.user_id = req.user.id;

    // TODO: log
    console.log("*** Get Report Violations: ADMIN ***");
    console.log(query);

    const result = await this.reportBugsService.getAllViolations(query);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    // const transformer = this.transformer.violationCollection(result.list);

    return this.responseHandler.send(
      res,
      200,
      "لیست گزارشات ارسالی در دسترس است.",
      {
        data: result.transformer,
        metadata: result.metadata,
      }
    );
  }
}
