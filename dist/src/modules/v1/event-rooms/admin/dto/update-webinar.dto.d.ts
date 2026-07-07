export declare class UpdateWebinarDto {
    user_id: number;
    webinar_provider_id: number;
    webinar_id: number;
    slug: string;
    title: string;
    description: string;
    type: string;
    tag: string;
    guest_access?: number;
    guest_count?: number;
    started_at: string;
    start_time: string;
    end_time: string;
}
