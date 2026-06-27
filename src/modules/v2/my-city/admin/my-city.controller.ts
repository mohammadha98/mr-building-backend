import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MyCityService } from "./my-city.service";
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { Pagination } from "src/commons/decorators/pagination.decorator";
import { GetLocaionInMyCity } from "./dto/query-geolocation.dto";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/admin/my-city")
@Controller("v2/admin/my-city")
export class MyCityController {
  constructor(private readonly myCityService: MyCityService) {}

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "لیست لوکیشن" })
  @Get()
  @Pagination()
  findAll(@Query() query: GetLocaionInMyCity) {
    console.log("GetLocaionInMyCity: ADMIN");
    console.log({ query });
    return this.myCityService.findAll(query);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "مشخصات لوکیشن" })
  @Get("details/:id")
  locationDetails(@Param("id") id: string) {
    return this.myCityService.locationDetails(id);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: " حذف لوکیشن  " })
  @Delete("location/:id")
  remove(@Param("id") id: string) {
    return this.myCityService.remove(id);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "تغییر وضعیت" })
  @Patch("location/:id/:status")
  changePriorityFile(@Param("id") id: string, @Param("status") status: string) {
    return this.myCityService.changeStatus(id, status);
  }
}
