export declare class SubCategoryDto {
    title: string;
    form_id: string;
}
export declare enum RealEstateAdCategoryTypes {
    sale = "sale",
    rent = "rent",
    participation = "participation",
    short_rent = "short_rent"
}
export declare class CreateAdCategoryDto {
    user_id: number;
    item_id: string;
    title: string;
    type: string;
    items: SubCategoryDto[];
}
