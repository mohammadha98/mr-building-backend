import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/CreateContactDto";
import { Request, Response } from "express";
export declare class ContactsController {
    private readonly clientContactsService;
    private readonly responseHandler;
    private readonly contactTransformer;
    constructor(clientContactsService: ContactsService);
    create(contactDto: CreateContactDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    checkContact(contactDto: CreateContactDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
