import { Controller, Post, Body, UseGuards, Get, Query } from "@nestjs/common";
import { AdminReportsService } from "./admin-reports.service";
import { AdminReportsDto } from "./dto/admin-reports.dto";
import AdminTokenAuthGuard from "../jwt-auth/AdminTokenAuthGuard";
import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { SwaggerConsumes } from "src/commons/enums/swagger.consumes";
import { GetInActiveClients } from "./dto/getInActiveClients";

@ApiTags("v1/admin/admin-reports")
@Controller("v1/admin/admin-reports")
@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "گزارش آمار آگهی ها" })
  @Get("/ads")
  generateAdsReports(@Query() reportDto: AdminReportsDto) {
    return this.adminReportsService.generateAdsReports(reportDto);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "گزارش آمار کلاینت ها" })
  @Get("/clients")
  generateClientReports(@Query() reportDto: AdminReportsDto) {
    return this.adminReportsService.generateClientReports(reportDto);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "گزارش آمار مشاوران املاک" })
  @Get("/real-estates")
  generateRealEstateReports(@Query() reportDto: AdminReportsDto) {
    return this.adminReportsService.generateRealEstateReports(reportDto);
  }

  @ApiConsumes(SwaggerConsumes.Json)
  @ApiOperation({ summary: "لیست کاربران غیر فعال بر اساس بازه زمانی" })
  @Post("/clients/inactive")
  getInActiveClients(@Body() body: GetInActiveClients) {
    return this.adminReportsService.getInActiveClients(body);
  }
}
