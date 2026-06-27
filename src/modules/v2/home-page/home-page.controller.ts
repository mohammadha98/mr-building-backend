import {
  Controller,
  Get,
  Response,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { HomePageService } from "./home-page.service";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import {
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/v2//jwt-auth/jwt-auth.guard";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import HomePageTransformer from "./Transformer";
import { GetHomePageDto } from "./dto/create-home-page.dto";

@ApiTags("v2/homePage")
@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@Controller("v2/app/home-page")
export class HomePageController {
  constructor(
    private readonly homePageService: HomePageService,
    private readonly homePageTransformer: HomePageTransformer,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @Get()
  async findAll(
    @Query() query: GetHomePageDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    query.client_id = req.user.id;
    console.log("*** GetHomePageDto ***");
    console.log(query);

    const result = await this.homePageService.homePage(query);

    // error handler
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    // Transformer
    const homePageTransformer = this.homePageTransformer.transform(
      result.result
    );

    return this.responseHandler.send(
      res,
      200,
      "صفحه اصلی در دسترس است",
      homePageTransformer
    );
  }
}
