export declare class ContactDTO {
    display_name: string;
    phone: string;
}
export declare class CreateContactDto {
    contacts: ContactDTO[];
    client_id: number;
    webinar_provider_id: number;
    display_name: string;
    password: string;
    email: string;
}
