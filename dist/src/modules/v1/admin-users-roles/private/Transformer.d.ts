export default class adminUserRolesTransformer {
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
}
