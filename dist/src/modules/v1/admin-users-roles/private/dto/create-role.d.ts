export declare class RoleCategories {
    category_id: string;
    permissions: string[];
}
export declare class CreateRoleDto {
    creator_id: number;
    title: string;
    description: string;
    key: string;
    categories: RoleCategories[];
}
