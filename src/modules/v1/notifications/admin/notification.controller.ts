import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  InternalServerErrorException,
  UseGuards, Get
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
import AdminTokenAuthGuard from "../../jwt-auth/AdminTokenAuthGuard";
import { SwaggerConsumes } from "../../../../commons/enums/swagger.consumes";
import { CreateGeneralNotificationDto } from "./dto/create-client-notification.dto";

@UseGuards(AdminTokenAuthGuard)
@ApiSecurity("JWT-auth")
@ApiTags("v1/admin/notification")
@Controller("v1/admin/notification")
export class NotificationController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly responseHandler: HttpResponsehandler
  ) {}


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

  @ApiOperation({ summary: "نوتیف عمومی" })
  @ApiConsumes(SwaggerConsumes.Json)
  @Post()
  async sendGeneralNotification(@Body() body: CreateGeneralNotificationDto) {
    console.log("sendGeneralNotification");
    console.log({body});
    return await this.notificationsService.sendGeneralNotification(body);
  }
  
  @ApiOperation({ summary: "دریافت نوتیف عمومی" })
  @ApiConsumes(SwaggerConsumes.Json)
  @Get()
  async GetGeneralNotification() {
    console.log("GetGeneralNotification");
    return await this.notificationsService.getGeneralNotification();
  }

}
