export default class ReportsTransformer {
    transform(item: any): {
        id: any;
        type: any;
        content: any;
        image: string;
        voice: string;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: any;
    };
    collection(items: any[]): {
        id: any;
        type: any;
        content: any;
        image: string;
        voice: string;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: any;
    }[];
    violationTransform(item: any): {
        id: any;
        description: any;
        type: any;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: any;
    };
    violationCollection(items: any[]): {
        id: any;
        description: any;
        type: any;
        client: {
            id: any;
            name: string;
            phone: any;
        };
        created_at: any;
    }[];
    private clientInfo;
}
