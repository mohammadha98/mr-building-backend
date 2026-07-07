export declare class SubCategoryDto {
    title: string;
    form_id: string;
}
export declare class CreateMarketplaceCategoryDto {
    user_id: number;
    item_id: string;
    title: string;
    items: SubCategoryDto[];
    thumbnail: string;
}
