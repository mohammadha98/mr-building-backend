export default class ServicesModuleAppTransformer {
    transformerMedia(service: any): {
        id: any;
        type: any;
        file_type: any;
        file: string;
    };
    collectionMedia(services: any[]): {
        id: any;
        type: any;
        file_type: any;
        file: string;
    }[];
    transformerService(item: any): {
        id: any;
        description: any;
    };
    transformComment(item: any, user_id: number): {
        id: number;
        content: string;
        client_id: number;
        is_replied: boolean;
        is_liked: boolean;
        total_like: number;
        replied_to: any;
        created_at: any;
    };
    collectionComments(comments: any[], user_id: number): {
        id: number;
        content: string;
        client_id: number;
        is_replied: boolean;
        is_liked: boolean;
        total_like: number;
        replied_to: any;
        created_at: any;
    }[];
}
