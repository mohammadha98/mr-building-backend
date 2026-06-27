export declare class ContactDTO {
    phone: string;
}
export declare class CheckContactDto {
    contacts: ContactDTO[];
    client_id: number;
    webinar_provider_id: number;
    display_name: string;
    password: string;
    email: string;
}
