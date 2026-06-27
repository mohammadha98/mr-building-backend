import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  InternalServerErrorException,
  UseGuards,
} from "@nestjs/common";

import {
  ApiConsumes,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import { FormDataRequest } from "nestjs-form-data";
import { NotificationsService } from "./notifications.service";
import { SaveNotificationTokenDto } from "./dto/save-notification-token.dto";
import TokenAuthGuardClient from "../../jwt-auth/TokenAuthGuardClient";
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { SwaggerConsumes } from "../../../../commons/enums/swagger.consumes";
import { CreateGeneralNotificationDto } from "./dto/create-client-notification.dto";

@ApiSecurity("JWT-auth")
@ApiTags("v1/app-notification")
@Controller("v1/app/notification")
export class NotificationController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly responseHandler: HttpResponsehandler
  ) {}

  @UseGuards(TokenAuthGuardClient)
  @Post()
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "ذخیره توکن fcm" })
  async saveNotificationFoClient(
    @Body() body: SaveNotificationTokenDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.client.id;

    console.log("saveNotificationFoClient");
    console.log(body);

    const result = await this.notificationsService.saveNotificationFoClient(
      body
    );
    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد.");
  }


  @ApiOperation({ summary: "نوتیف عمومی" })
  @ApiConsumes(SwaggerConsumes.Json)
  @Post()
  async generalNotification(@Body() body: CreateGeneralNotificationDto) {
    console.log("generalNotification");
    console.log({body});
    return await this.notificationsService.generalNotification(body);
  }

  @UseGuards(AdminTokenAuthGuard)
  @Post("admin")
  @ApiConsumes("multipart/form-data")
  @FormDataRequest()
  @ApiOperation({ summary: "ذخیره توکن fcm ادمین پنل" })
  async saveNotificationForAdminUser(
    @Body() body: SaveNotificationTokenDto,
    @Request() req: any,
    @Response() res: Response
  ) {
    body.client_id = req.user.id;

    console.log("saveNotificationForAdminUser");
    console.log(body);

    const result = await this.notificationsService.saveNotificationForAdminUser(
      body
    );
    if (result.status === 500) {
      throw new InternalServerErrorException();
    }

    return this.responseHandler.send(res, 201, "عملیات با موفقیت انجام شد.");
  }
}
