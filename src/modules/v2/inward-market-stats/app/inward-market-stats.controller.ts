import {
  Controller,
  Get,
  UseGuards,
} from "@nestjs/common";
import { InwardMarketStatsService } from "./inward-market-stats.service";
import { ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app/inward-market-stats")
@Controller("v2/app/inward-market-stats")
export class InwardMarketStatsController {
  constructor(
    private readonly inwardMarketStatsService: InwardMarketStatsService
  ) {}

  @Get()
  @ApiOperation({ summary: "دریافت قیمت طلا, سکه, ارز" })
  findAll() {
    return this.inwardMarketStatsService.findAll();
  }
}
