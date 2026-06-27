import { CreateContactDto } from "./dto/CreateContactDto";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ClientService } from "src/modules/v1//client/app/client.service";
import ClientContactsTransformer from "./Transformer";
export declare class ContactsService {
    private prisma;
    private clientService;
    private readonly contactTransformer;
    private readonly eventService;
    private smsService;
    constructor(prisma: PrismaService, clientService: ClientService, contactTransformer: ClientContactsTransformer);
    createNewContact(createClientContactDto: CreateContactDto): Promise<{
        status: number;
        result: any[];
    } | {
        status: number;
        result?: undefined;
    }>;
    findAllMyContact(client_id: number): Promise<false | ({
        contacts: (import("@prisma/client/runtime").GetResult<{
            id: number;
            display_name: string;
            phone: string;
            client_id: number;
            createdAt: Date;
        }, unknown, never> & {})[];
    } & import("@prisma/client/runtime").GetResult<{
        id: number;
        webinar_provider_id: number;
        name: string;
        score: number;
        surname: string;
        phone: string;
        key: string;
        email: string;
        username: string;
        password: string;
        type: string;
        roles: string[];
        avatar: string;
        token: string;
        validate_email: boolean;
        status: string;
        has_update_direct: boolean;
        has_update_cafebazar: boolean;
        has_update_myket: boolean;
        has_update_google_play: boolean;
        has_update_general_notification: boolean;
        created_at: Date;
        updated_at: Date;
        last_login_time: Date;
        installed_version: string;
        provincesId: number;
        citiesId: number;
        masterProjectCommentLikesId: string;
    }, unknown, never> & {})>;
    saveContacts(contactDto: CreateContactDto, contacts: any[]): Promise<{
        statusCode: number;
        message: string;
        error: string;
        data: {
            client_id: any;
            user_id: any;
            display_name: any;
            phone: any;
            user_key: any;
            is_exist: any;
        }[];
    }>;
    getContacts(client_id: number): Promise<{
        statusCode: number;
        message: string;
        error: string;
        data: {
            client_id: any;
            user_id: any;
            display_name: any;
            phone: any;
            user_key: any;
            is_exist: any;
        }[];
    }>;
    private extractNewContact;
    private syncContacts;
    private makeMetadata;
    private makePagination;
    private getTotalPageNumber;
}
