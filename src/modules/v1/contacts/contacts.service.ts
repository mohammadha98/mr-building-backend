import { Injectable } from "@nestjs/common";
import { CreateContactDto } from "./dto/CreateContactDto";
import { PrismaService } from "../../../../prisma/prisma.service";
import EventService from "src/modules/v1//webinar/provider/EventService";
import SmsService from "src/modules/services/notifications/sms/SmsService";
import { ClientService } from "src/modules/v1//client/app/client.service";
import IPagination from "src/commons/contracts/IPagination";
import IMetadata from "src/commons/contracts/IMetadata";
import ClientContactsTransformer from "./Transformer";

@Injectable()
export class ContactsService {
  private readonly eventService: EventService;
  private smsService: SmsService;

  constructor(
    private prisma: PrismaService,
    private clientService: ClientService,
    private readonly contactTransformer: ClientContactsTransformer
  ) {
    this.eventService = new EventService();
    this.smsService = new SmsService();
  }

  async createNewContact(createClientContactDto: CreateContactDto) {
    try {
      const contacts = createClientContactDto.contacts;
      const clientContacts = await this.syncContacts(contacts);
      return { status: 200, result: clientContacts };
    } catch (error) {
      return { status: 500 };
    }
  }

  async findAllMyContact(client_id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id: client_id },
      include: { contacts: true },
    });
    if (!client) {
      return false;
    }
    return client;
  }

  async saveContacts(contactDto: CreateContactDto, contacts: any[]) {
    const newContact = await this.extractNewContact(
      contactDto.client_id,
      contacts
    );

    await this.prisma.contact.createMany({
      skipDuplicates: true,
      data: newContact.map((contact) => ({
        display_name: contact.display_name,
        phone: contact.phone,
        client_id: contactDto.client_id,
      })),
    });

    const result = await this.syncContacts(contacts);
    const transformer = this.contactTransformer.collection(result);

    return {
      statusCode: 200,
      message: "بررسی مخاطبین انجام شد",
      error: "",
      data: transformer,
    };
  }

  async getContacts(client_id: number) {
    const count = await this.prisma.contact.count({
      where: {
        client_id,
      },
    });
    console.log({ count });

    const clientContacts = await this.prisma.contact.findMany({
      where: { client_id },
      orderBy: { id: "asc" },
    });

    const contacts = await this.syncContacts(clientContacts);

    const transformer = this.contactTransformer.collection(contacts);

    return {
      statusCode: 200,
      message: "دریافت مخاطبین با موفقیت انجام شد.",
      error: "",
      data: transformer,
    };
  }

  private async extractNewContact(client_id: number, contacts: any[]) {
    const existingContacts = await this.prisma.contact.findMany({
      where: { client_id },
    });

    const existingContactPhones = existingContacts.map(
      (contact) => contact.phone
    );

    const newContacts = contacts.filter(
      (contact) => !existingContactPhones.includes(contact.phone)
    );

    return newContacts;
  }

  private async syncContacts(contacts: any[]) {
    return await Promise.all(
      contacts.map(async (contact: any) => {
        const validateContact = await this.clientService.findOne(contact.phone);
        if (validateContact) {
          contact.client_id = validateContact.id;
          contact.user_id = validateContact.webinar_provider_id
            ? validateContact.webinar_provider_id
            : -1;
          contact.user_key = validateContact.key;
          contact.is_exist = validateContact.webinar_provider_id ? true : false;
        } else {
          contact.client_id = -1;
          contact.user_id = -1;
          contact.user_key = "";
          contact.is_exist = false;
        }
        return contact;
      })
    );
  }

  // make metadata
  private makeMetadata(
    page: number,
    per_page: number,
    total_page: number
  ): IMetadata {
    return {
      page,
      total_page,
      per_page: per_page,
      next: page < total_page,
      back: page > 1,
    };
  }

  // make metadata
  private makePagination(page: number, per_page: number): IPagination {
    return {
      offset: (page - 1) * per_page,
      per_page,
    };
  }

  private getTotalPageNumber(total_number: number, per_page: number) {
    return Math.ceil(total_number / per_page);
  }
}
