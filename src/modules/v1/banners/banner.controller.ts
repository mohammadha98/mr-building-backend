import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerSliderDto } from "./dto/banner-slider.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, parse } from "path";
import {
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import InternalServerErrorSchema from "src/commons/contracts/swaggerDefinations/InternalServerErrorSchema";
import { PaginationSchema } from "src/commons/contracts/PaginationSchema";
import { CheckFileMiddleware } from "src/middlewares/check-file.middleware";
import AdminTokenAuthGuard from "../jwt-auth/AdminTokenAuthGuard";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin/banner")
@Controller("v1/admin/banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseInterceptors(
    FileInterceptor("thumbnail", {
      storage: diskStorage({
        destination: "./public/contents/banners",
        filename(req, file, callback) {
          const filename = parse(join(file.originalname)).name;
          const extention = parse(join(file.originalname)).ext;

          callback(null, `${filename}-${Date.now()}${extention}`);
        },
      }),
    })
  )
  @Post()
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @ApiOperation({ summary: "ذخیره بنر" })
  async create(
    @Body() createSliderDto: BannerSliderDto,
    @UploadedFile() thumbnail: Express.Multer.File
  ) {
    createSliderDto.thumbnail = thumbnail.filename;
    return this.bannerService.create(createSliderDto);
  }

  @ApiInternalServerErrorResponse({
    type: InternalServerErrorSchema,
    description: "خطای سرور. لطفا کمی بعد تلاش کنید",
    schema: {
      $ref: getSchemaPath(InternalServerErrorSchema),
    },
  })
  @Get()
  async findAll(@Query() query: PaginationSchema) {
    return this.bannerService.findAll(query);
  }

  @Post("update")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/banners",
        filename(req, file, callback) {
          const filename = parse(join(file.originalname)).name;
          const extention = parse(join(file.originalname)).ext;

          callback(null, `${filename}-${Date.now()}${extention}`);
        },
      }),
    }),
    CheckFileMiddleware
  )
  @ApiConsumes(SwaggerConsumes.MultipartData)
  async update(
    @Body() body: UpdateBannerDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    body.file = file ? file.filename : null;

    console.log("*** Update Banner ***");
    console.log({ body });

    return this.bannerService.update(body);
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return this.bannerService.remove(+id);
  }
}
