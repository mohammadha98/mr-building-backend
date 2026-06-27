export declare class Contact {
    client_id: number;
    userid: number;
    display_name: string;
    phone: string;
    role: string;
}
export declare class InviteContactDto {
    user_id: number;
    contacts: Contact[];
    room_id: number;
}
