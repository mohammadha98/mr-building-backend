export default class ClientContactsTransformer {
    transform(contact: any): {
        client_id: any;
        user_id: any;
        display_name: any;
        phone: any;
        user_key: any;
        is_exist: any;
    };
    collection(contacts: any[]): {
        client_id: any;
        user_id: any;
        display_name: any;
        phone: any;
        user_key: any;
        is_exist: any;
    }[];
}
