import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Request,
  Response,
  UseGuards,
} from "@nestjs/common";
import { UploaderService } from "./uploader.service";
import { CreateUploaderDto } from "./dto/create-uploader.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/modules/v2/jwt-auth/jwt-auth.guard";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { ForbiddenErrorHandler } from "src/modules/services/httpResponseHandler/forbiddenErrorHandler";
import { InternalServerErrorHandler } from "src/modules/services/httpResponseHandler/internalServerErrorHandler";
import { MulterDiskStorage } from "src/commons/utils/multer.util";
import { CustomUploadedFileDecorator } from "src/commons/decorators/uploaded-file.decorator";

@UseGuards(JwtAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v2/app-uploader")
@Controller("v2/app/uploader")
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  // آپلودر
  @UseInterceptors(
    FileInterceptor("file", {
      storage: MulterDiskStorage("temp/files/"),
    })
  )
  @ApiOperation({ summary: "آپلود فایل" })
  @Post("file")
  @ApiBody({ type: CreateUploaderDto })
  @ApiConsumes("multipart/form-data")
  @Post()
  async uploaderFile(
    @Body() body: CreateUploaderDto,
    @CustomUploadedFileDecorator() file: Express.Multer.File,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.file = file.filename;
    body.size = file.size;
    body.client_id = req.user.id;

    // console.log({ file });

    // TODO: log for Global Uploader
    console.log("*** Global Uploader ***");
    console.log(body);

    const result = await this.uploaderService.uploaderFile(body);
    if (result.status === 403) {
      throw new ForbiddenErrorHandler();
    } else if (result.status === 500) {
      throw new InternalServerErrorHandler();
    }

    return this.responseHandler.send(
      res,
      201,
      "آپلود با موفقیت انجام شد.",
      result.result
    );
  }
}
