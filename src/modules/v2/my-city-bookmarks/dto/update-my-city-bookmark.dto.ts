import { PartialType } from "@nestjs/swagger";
import { CreateMyCityBookmarkDto } from "./create-my-city-bookmark.dto";

export class UpdateMyCityBookmarkDto extends PartialType(
  CreateMyCityBookmarkDto
) {}
