export default class ClientTransformer {
    transform(client: any): {
        id: any;
        name: any;
        surname: any;
        phone: any;
        roles: any;
        user_name: any;
        email: any;
        status: any;
        avatar: string;
        createdAt: any;
        installed_version: any;
        created_at: any;
    };
    collection(clients: any[]): {
        id: any;
        name: any;
        surname: any;
        phone: any;
        roles: any;
        user_name: any;
        email: any;
        status: any;
        avatar: string;
        createdAt: any;
        installed_version: any;
        created_at: any;
    }[];
}
