"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const EventService_1 = require("../webinar/provider/EventService");
const SmsService_1 = require("../../services/notifications/sms/SmsService");
const client_service_1 = require("../client/app/client.service");
const Transformer_1 = require("./Transformer");
let ContactsService = class ContactsService {
    constructor(prisma, clientService, contactTransformer) {
        this.prisma = prisma;
        this.clientService = clientService;
        this.contactTransformer = contactTransformer;
        this.eventService = new EventService_1.default();
        this.smsService = new SmsService_1.default();
    }
    async createNewContact(createClientContactDto) {
        try {
            const contacts = createClientContactDto.contacts;
            const clientContacts = await this.syncContacts(contacts);
            return { status: 200, result: clientContacts };
        }
        catch (error) {
            return { status: 500 };
        }
    }
    async findAllMyContact(client_id) {
        const client = await this.prisma.client.findUnique({
            where: { id: client_id },
            include: { contacts: true },
        });
        if (!client) {
            return false;
        }
        return client;
    }
    async saveContacts(contactDto, contacts) {
        const newContact = await this.extractNewContact(contactDto.client_id, contacts);
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
    async getContacts(client_id) {
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
    async extractNewContact(client_id, contacts) {
        const existingContacts = await this.prisma.contact.findMany({
            where: { client_id },
        });
        const existingContactPhones = existingContacts.map((contact) => contact.phone);
        const newContacts = contacts.filter((contact) => !existingContactPhones.includes(contact.phone));
        return newContacts;
    }
    async syncContacts(contacts) {
        return await Promise.all(contacts.map(async (contact) => {
            const validateContact = await this.clientService.findOne(contact.phone);
            if (validateContact) {
                contact.client_id = validateContact.id;
                contact.user_id = validateContact.webinar_provider_id
                    ? validateContact.webinar_provider_id
                    : -1;
                contact.user_key = validateContact.key;
                contact.is_exist = validateContact.webinar_provider_id ? true : false;
            }
            else {
                contact.client_id = -1;
                contact.user_id = -1;
                contact.user_key = "";
                contact.is_exist = false;
            }
            return contact;
        }));
    }
    makeMetadata(page, per_page, total_page) {
        return {
            page,
            total_page,
            per_page: per_page,
            next: page < total_page,
            back: page > 1,
        };
    }
    makePagination(page, per_page) {
        return {
            offset: (page - 1) * per_page,
            per_page,
        };
    }
    getTotalPageNumber(total_number, per_page) {
        return Math.ceil(total_number / per_page);
    }
};
ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        client_service_1.ClientService,
        Transformer_1.default])
], ContactsService);
exports.ContactsService = ContactsService;
//# sourceMappingURL=contacts.service.js.map