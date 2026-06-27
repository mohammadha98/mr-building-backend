import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Response,
} from "@nestjs/common";
import { MyCityService } from "./my-city.service";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { Pagination } from "src/commons/decorators/pagination.decorator";
import { CreateMyCityDto, UploadFileMyCityDto } from "./dto/create-my-city.dto";
import { UpdateLocationInMyCity } from "./dto/update-location-my-city.dto";
import { UpdateMyCityDto } from "./dto/update-my-city.dto";
import { MyCityDto } from "./dto/myCityDto";
import { GetLocaionInMyCity } from "./dto/query-geolocation.dto";
import { MayNearDto } from "./dto/find-my-near.dto";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomBytes } from "crypto";
import { join, parse } from "path";
import { UploadFileRealEstateAdItemsDto } from "../../real-estate-ads/app/dto/upload-file-real-estate-ads.dto";
import { PaginationDto } from "src/commons/dto/pagination.dto";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app/my-city")
@Controller("v2/app/my-city")
export class MyCityController {
  constructor(private readonly myCityService: MyCityService) {}

  // آپلودر
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./public/contents/temp/mycity/",
        filename(req, file, callback) {
          const uniqueCode = randomBytes(3).toString("hex").toUpperCase();
          const extension = parse(join(file.originalname)).ext;
          const filename = `${Date.now()}-${uniqueCode}${extension}`;

          callback(null, filename);
        },
      }),
    })
  )
  @ApiOperation({ summary: "آپلود فایل" })
  @Post("file")
  @ApiBody({ type: UploadFileMyCityDto })
  @ApiConsumes("multipart/form-data")
  async UploadTempFile(
    @Body() body: UploadFileMyCityDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log("*** UploadFile: Location in MyCity ***");
    console.log({ file });

    body.file = file.filename;

    console.log({ body });

    return await this.myCityService.UploadFile(body);
  }

  @Post()
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " ثبت لوکیشن جدید " })
  create(@Body() createGeolocationDto: CreateMyCityDto) {
    console.log("CreateGeolocationDto");
    console.log(createGeolocationDto);
    return this.myCityService.create(createGeolocationDto);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "لیست لوکیشن" })
  @Get()
  @Pagination()
  findAll(@Query() query: GetLocaionInMyCity) {
    console.log("GetLocaionInMyCity");
    console.log({ query });
    return this.myCityService.findAll(query);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " لیست لوکیشن های من" })
  @Get("my-location")
  @Pagination()
  findAllMe(@Query() query: PaginationDto) {
    return this.myCityService.myLocations(query);
  }

  @Post("findNear")
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " لوکیشن های نزدیک من " })
  findNear(@Body() body: MayNearDto) {
    return this.myCityService.findNearLocations(body);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "مشخصات لوکیشن" })
  @Get("details/:id")
  locationDetails(@Param("id") id: string) {
    return this.myCityService.locationDetails(id);
  }

  @Patch(":id")
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " بروزرسانی لوکیشن  " })
  updateLocationInMyCity(
    @Param("id") id: string,
    @Body() body: UpdateLocationInMyCity
  ) {
    console.log("updateLocationInMyCity");
    console.log({ id });
    console.log({ body });
    return this.myCityService.updateLocationInMyCity(id, body);
  }

  @Patch(":id")
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " بروزرسانی لوکیشن  " })
  update(
    @Param("id") id: string,
    @Body() updateGeolocationDto: UpdateMyCityDto
  ) {
    return this.myCityService.update(id, updateGeolocationDto);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " حذف لوکیشن  " })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.myCityService.remove(id);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " حذف فایل  " })
  @Delete("file/:id")
  removeFile(@Param("id") id: string) {
    return this.myCityService.removeFile(id);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " تغییر اولویت فایل به اصلی " })
  @Patch("file")
  changePriorityFile(@Param("id") id: string) {
    return this.myCityService.changePriorityFile(id);
  }
}
