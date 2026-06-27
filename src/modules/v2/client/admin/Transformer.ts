import { Injectable } from "@nestjs/common";

@Injectable()
export default class ClientTransformer {
  public transform(client: any) {
    return {
      id: client.id,
      name: client.name,
      surname: client.surname,
      phone: client.phone,
      roles: client.roles,
      user_name: client.username,
      email: client.email,
      status: client.status,
      avatar: client.avatar
        ? `${process.env.APP_CONTENT_PATH}/clients/avatars/${client.avatar}`
        : null,
      // token: client?.token,
      createdAt: client.createdAt,
      installed_version: client.installed_version,
      created_at: client.created_at,
    };
  }

  public collection(clients: any[]) {
    return clients.map((client) => this.transform(client));
  }
}
