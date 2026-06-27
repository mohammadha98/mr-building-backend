import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ReportsService } from "./report.service";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v1/jwt-auth/jwt-auth.guard";
import { CreateReportBugDto } from "./dto/create-report-bugs.dto";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
import { CheckVoiceFileMiddleware } from "./dto/check-voice.middleware";
import { CheckImageMiddleware } from "./dto/check-image.middleware";
import { FormDataRequest } from "nestjs-form-data";
import { CreateReportViolationDto } from "./dto/create-report-violation.dto";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app/reports")
@Controller("v1/app/reports")
export class ReportsController {
  constructor(
    private readonly responseHandler: HttpResponsehandler,
    private readonly reportBugsService: ReportsService
  ) {}

  // ارسال باگ
  @ApiCreatedResponse({
    description: "درخواست شما با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "درخواست شما با موفقیت ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "ارسال باگ" })
  @Post("/bug")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateReportBugDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "image", maxCount: 1 },
        { name: "voice", maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: "./public/contents/report_bugs/",
          filename: (req, file, callback) => {
            const extension = parse(join(file.originalname)).ext;
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}${extension}`);
          },
        }),
      }
    ),
    CheckImageMiddleware,
    CheckVoiceFileMiddleware
  )
  async storeBug(
    @Body() body: CreateReportBugDto,
    @Request() req: any,
    @Response() res: Response,
    @UploadedFiles()
    files: { image?: Express.Multer.File; voice?: Express.Multer.File }
  ) {
    body.client_id = req.user.id;

    const { image, voice } = files;
    body.image = image ? image[0].filename : null;
    body.voice = voice ? voice[0].filename : null;

    // TODO: log
    console.log("*** Create Report Bug Dto ***");
    console.log(body);

    const result = await this.reportBugsService.storeBug(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 201, "درخواست شما با موفقیت ثبت شد.");
  }

  // ارسال باگ
  @ApiCreatedResponse({
    description: "درخواست شما با موفقیت ثبت شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "درخواست شما با موفقیت ثبت شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @ApiOperation({ summary: "ارسال محتوای نامناسب" })
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @Post("/violations")
  async storeViolation(
    @Body() body: CreateReportViolationDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    // TODO: log
    console.log("*** Store Violation Report***");
    console.log(body);

    const result = await this.reportBugsService.storeViolation(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(res, 201, "درخواست شما با موفقیت ثبت شد.");
  }
}
