import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  Response,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SliderService } from "./slider.service";
import { CreateSliderDto } from "./dto/create-slider.dto";
import { UpdateSliderDto } from "./dto/update-slider.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import BadRequestSchema from "src/commons/contracts/swaggerDefinations/BadRequestSchema";
import ForbiddenSchema from "src/commons/contracts/swaggerDefinations/ForbiddenSchema";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import NotFoundSchema from "src/commons/contracts/swaggerDefinations/NotFoundSchema";
import UnAuthorizedSchema from "src/commons/contracts/swaggerDefinations/UnAuthorizedSchema";
import UnProcessableEntitySchema from "src/commons/contracts/swaggerDefinations/UnProcessableEntitySchema";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import SliderTransformerAdmin from "./contracts/transformer-admin";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";
import AdminTokenAuthGuard from "../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin-slider")
@Controller("v1/admin/slider")
export class SliderController {
  constructor(
    private readonly sliderService: SliderService,
    private readonly responseHandler: HttpResponsehandler,
    private readonly sliderTransformer: SliderTransformerAdmin
  ) {}

  // created response
  @ApiCreatedResponse({
    description: "دیتا با موفقیت ذخیره شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 201 },
        message: {
          type: "string",
          example: "دیتا با موفقیت ذخیره شد.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {},
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("thumbnail", {
      storage: diskStorage({
        destination: "./public/contents/sliders",
        filename(req, file, callback) {
          const filename = parse(join(file.originalname)).name;
          const extention = parse(join(file.originalname)).ext;

          callback(null, `${filename}-${Date.now()}${extention}`);
        },
      }),
    })
  )
  @Post()
  @ApiBody({ type: CreateSliderDto })
  @ApiConsumes("multipart/form-data")
  async create(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Request() req: Request,
    @Response() res: Response
  ) {
    createSliderDto.thumbnail = thumbnail.filename;
    const newSlider = await this.sliderService.create(createSliderDto);
    if (!newSlider) {
      throw new InternalServerErrorHandler();
    }
    const transformer = this.sliderTransformer.transform(newSlider);
    return this.responseHandler.send(
      res,
      201,
      "دیتا با موفقیت ذخیره شد.",
      transformer
    );
  }

  // get sliders
  // ok response
  @ApiOkResponse({
    description: "لیست اسلایدر ها در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست اسلایدر ها در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: "1" },
                  title: { type: "String", example: "title" },
                  thumbnail: { type: "String", example: "thumbnail url" },
                  status: { type: "String", example: "active, inactive" },
                  created_at: { type: "String", example: "thumbnail url" },
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
  // Unauthorized Response
  @ApiUnauthorizedResponse({
    description: "خطا. احزار هویت انجام نشده است",
    type: UnAuthorizedSchema,
    schema: {
      $ref: getSchemaPath(UnAuthorizedSchema),
    },
  })
  // Forbidden Response
  @ApiForbiddenResponse({
    description: "خطا. اجازه ادامه کار را ندارید.",
    type: ForbiddenSchema,
    schema: {
      $ref: getSchemaPath(ForbiddenSchema),
    },
  })
  // NotFound Response
  @ApiNotFoundResponse({
    description: "خطا. آدرس موردنظر یافت نشد",
    type: NotFoundSchema,
    schema: {
      $ref: getSchemaPath(NotFoundSchema),
    },
  })
  // InternalServerError Response
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @Get()
  async findAll(@Query() query: PaginationSchema, @Response() res: Response) {
    query.page = query.page || 1;
    query.per_page = query.per_page || 1;

    const result = await this.sliderService.findAll(query);
    const sliders = this.sliderTransformer.collection(result.sliders);
    return this.responseHandler.send(
      res,
      200,
      "لیست اسلایدر ها در دسترس است.",
      {
        data: sliders,
        metadata: result.metadata,
      }
    );
  }

  @Post("update")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/sliders",
        filename(req, file, callback) {
          const filename = parse(join(file.originalname)).name;
          const extention = parse(join(file.originalname)).ext;

          callback(null, `${filename}-${Date.now()}${extention}`);
        },
      }),
    }),
    CheckFileMiddleware
  )
  @ApiBody({ type: UpdateSliderDto })
  @ApiConsumes("multipart/form-data")
  async update(
    @Body() body: UpdateSliderDto,
    @Response() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    body.file = file ? file.filename : null;

    console.log("*** Update Silder ***");
    console.log({ body });

    const result = await this.sliderService.update(body);
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }
    const response = this.sliderTransformer.transform(result.result);

    return this.responseHandler.send(
      res,
      200,
      "ویرایش با موفقیت حذف شد.",
      response
    );
  }

  @Delete(":id")
  async remove(@Param("id") id: number, @Response() res: Response) {
    const result = await this.sliderService.remove(id);
    if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "آیتم موردنظر با موفقیت حذف شد."
    );
  }
}
