import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/CreateContactDto";
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { HttpResponsehandler } from "src/modules/services/httpResponseHandler/httpResponsehandler";
import ClientContactsTransformer from "./Transformer";
import TokenAuthGuardClient from "../jwt-auth/TokenAuthGuardClient";
import { Request, Response } from "express";

@UseGuards(TokenAuthGuardClient)
@ApiSecurity("JWT-auth")
@ApiTags("v1/app-client-contacts")
@Controller("v1/app/contacts")
export class ContactsController {
  private readonly responseHandler: HttpResponsehandler;
  private readonly contactTransformer: ClientContactsTransformer;

  constructor(private readonly clientContactsService: ContactsService) {
    this.responseHandler = new HttpResponsehandler();
    this.contactTransformer = new ClientContactsTransformer();
  }

  @ApiOkResponse({
    description: "بررسی مخاطبین با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "بررسی مخاطبین با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            properties: {
              client_id: {
                type: "integer",
                example: "type: integer => 12 || -1",
              },
              user_id: {
                type: "integer",
                example: "type: integer => 32124 || -1",
              },
              display_name: { type: "string" },
              phone: { type: "string" },
              user_key: { type: "string" },
              is_exist: { type: "boolean", example: "true || false" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "بررسی مخاطبین",
  })
  @Post()
  async create(
    @Body() contactDto: CreateContactDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    contactDto.client_id = req.client.id;
    const contacts = contactDto.contacts;
    console.log("*** Sync Contacts ***");
    console.log({ contactDto });
    console.log("contacts.length ", contactDto.contacts.length);

    const result = await this.clientContactsService.saveContacts(
      contactDto,
      contacts
    );

    res.status(result.statusCode);
    return res.json(result);
  }

  // دریافت لیست مخاطبین من
  // ok response
  @ApiOkResponse({
    description: "لیست مخاطبین من در دسترس است.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "لیست مخاطبین من در دسترس است.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            properties: {
              client_id: {
                type: "integer",
                example: "type: integer => 12 || -1",
              },
              user_id: {
                type: "integer",
                example: "type: integer => 32124 || -1",
              },
              display_name: { type: "string" },
              phone: { type: "string" },
              user_key: { type: "string" },
              is_exist: { type: "boolean", example: "true || false" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: "دریافت مخاطبین من " })
  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    console.log("*** Get Contacts ***");
    console.log("clientId ", req.client.id);
    const result = await this.clientContactsService.getContacts(req.client.id);

    res.status(result.statusCode);
    return res.json(result);
  }

  @ApiOkResponse({
    description: "بررسی مخاطبین با موفقیت انجام شد.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "integer", example: 200 },
        message: {
          type: "string",
          example: "بررسی مخاطبین با موفقیت انجام شد.",
        },
        error: { type: "string" },
        data: {
          type: "array",
          items: {
            properties: {
              client_id: {
                type: "integer",
                example: "type: integer => 12 || -1",
              },
              user_id: {
                type: "integer",
                example: "type: integer => 32124 || -1",
              },
              display_name: { type: "string" },
              phone: { type: "string" },
              user_key: { type: "string" },
              is_exist: { type: "boolean", example: "true || false" },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "بررسی مخاطبین",
    description:
      "در لیست ارسالی فقط شماره وارد شده کاربر قرار بگیرد و نام یک امپتی استرینگ باشد.",
  })
  @Post("sync")
  async checkContact(
    @Body() contactDto: CreateContactDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    contactDto.client_id = req.client.id;
    const contacts = contactDto.contacts;
    console.log("*** Check Contact ***");
    console.log({ contactDto });

    const result = await this.clientContactsService.saveContacts(
      contactDto,
      contacts
    );

    res.status(result.statusCode);
    return res.json(result);
  }
}
