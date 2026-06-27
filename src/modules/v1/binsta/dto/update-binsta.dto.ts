import { PartialType } from "@nestjs/swagger";
import { CreateBinstaDto } from "./create-binsta.dto";

export class UpdateBinstaDto extends PartialType(CreateBinstaDto) {}
