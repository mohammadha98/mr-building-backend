export declare enum GetMessagesTypes {
    pagination = "pagination",
    before_date = "before_date",
    after_date = "after_date",
    unseen = "unseen"
}
export declare class GetMessagesDto {
    key: string;
    type: GetMessagesTypes;
    date: string;
    page: number;
    per_page: number;
}
