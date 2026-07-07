import adminUserRolesTransformer from "../../admin-users-roles/public/Transformer";
export default class UserTransformer {
    private readonly adminUserRolesTransformer;
    constructor(adminUserRolesTransformer: adminUserRolesTransformer);
    transform(user: any): {
        id: any;
        name: any;
        email: any;
        uniq_key: any;
        phone: any;
        avatar: string;
        token: any;
        refresh_token: any;
        status: any;
        created_at: any;
        roles: any[];
    };
    collection(users: any[]): {
        id: any;
        name: any;
        email: any;
        uniq_key: any;
        phone: any;
        avatar: string;
        token: any;
        refresh_token: any;
        status: any;
        created_at: any;
        roles: any[];
    }[];
    transformCategoryRoles(category: any): {
        id: any;
        title: any;
        key: any;
        permissions: {
            id: any;
            title: any;
            key: any;
            category_id: any;
        }[];
    };
    collectionCategoryRoles(categories: any[]): {
        id: any;
        title: any;
        key: any;
        permissions: {
            id: any;
            title: any;
            key: any;
            category_id: any;
        }[];
    }[];
    transformPermissionCategoryRoles(permission: any): {
        id: any;
        title: any;
        key: any;
        category_id: any;
    };
    collectionPermissionCategoryRoles(permissions: any[]): {
        id: any;
        title: any;
        key: any;
        category_id: any;
    }[];
    transformUserRole(tem: any): {
        role_id: any;
        title: any;
        key: any;
        permissions: any[];
    };
    private collectionUserRole;
}
