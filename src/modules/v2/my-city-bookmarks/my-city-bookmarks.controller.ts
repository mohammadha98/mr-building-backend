import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { MyCityBookmarksService } from "./my-city-bookmarks.service";
import { CreateMyCityBookmarkDto } from "./dto/create-my-city-bookmark.dto";
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import TokenAuthGuardClient from "../jwt-auth/TokenAuthGuardClient";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app/my-city/bookmarks")
@Controller("v2/app/my-city/bookmarks")
export class MyCityBookmarksController {
  constructor(
    private readonly myCityBookmarksService: MyCityBookmarksService
  ) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " بوکمارک کردن لوکیشن  " })
  create(@Body() createBookmarkDto: CreateMyCityBookmarkDto) {
    return this.myCityBookmarksService.create(createBookmarkDto);
  }

  @Get()
  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " لوکیشن های مورد علاقه کاربر " })
  findAll() {
    // آیدی کاربر ارسال شود
    return this.myCityBookmarksService.findAll();
  }
}
