import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
} from "@nestjs/common";
import { BinstaService } from "./binsta.service";
import { UpdateBinstaDto } from "./dto/update-binsta.dto";
import { JwtAuthGuard } from "src/modules/v1//jwt-auth/jwt-auth.guard";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ValidateUsernameBinstaDto } from "./dto/validate-username.dto";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { UnProcessableEntity } from "src/modules/services/httpResponseHandler/unProcessableEntity";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-binsta")
@Controller("v1/app/binsta")
export class BinstaController {
  constructor(
    private readonly binstaService: BinstaService,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @Post("check")
  async validateUsername(
    @Body() body: ValidateUsernameBinstaDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;
    console.log("*** validate Username: Binsta App ***");
    console.log({ body });

    const result = await this.binstaService.validateUsername(body);

    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 422) {
      throw new UnProcessableEntity("خطا. نام کاربری وارد شده تکراری میباشد.");
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      200,
      "نام کاربری وارد شده معتبر میباشد."
    );
  }

  @Get()
  findAll() {
    return this.binstaService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.binstaService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBinstaDto: UpdateBinstaDto) {
    return this.binstaService.update(+id, updateBinstaDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.binstaService.remove(+id);
  }
}
