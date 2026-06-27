import { Injectable } from "@nestjs/common";

@Injectable()
export default class ClientContactsTransformer {
  public transform(contact: any) {
    return {
      client_id: contact.client_id,
      user_id: contact.user_id,
      display_name: contact.display_name,
      phone: contact.phone,
      user_key: contact.user_key,
      is_exist: contact.is_exist,
    };
  }

  public collection(contacts: any[]) {
    return contacts.map((contact) => this.transform(contact));
  }
}
