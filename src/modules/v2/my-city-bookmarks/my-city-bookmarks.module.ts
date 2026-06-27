import { Module } from "@nestjs/common";
import { MyCityBookmarksService } from "./my-city-bookmarks.service";
import { MyCityBookmarksController } from "./my-city-bookmarks.controller";
import { PrismaService } from "../../../../prisma/prisma.service";
import { MyCityService } from "../my-city/app/my-city.service";
import { MyCityAppModule } from "../my-city/app/my-city.module";
import { BookmarkMyCityFactory } from "./factories/bookmark.factory";
import BookmarkCityTransformer from "./Transformer";

@Module({
  imports: [MyCityAppModule],
  controllers: [MyCityBookmarksController],
  providers: [
    MyCityBookmarksService,
    BookmarkMyCityFactory,
    MyCityService,
    BookmarkCityTransformer,
  ],
})
export class MyCityBookmarksModule {}
