import { PartialType } from "@nestjs/swagger";
import { CreateInwardMarketStatDto } from "./create-inward-market-stat.dto";

export class UpdateInwardMarketStatDto extends PartialType(
  CreateInwardMarketStatDto
) {}
