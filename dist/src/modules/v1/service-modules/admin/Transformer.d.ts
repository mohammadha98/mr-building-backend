export default class ServicesModuleAdminTransformer {
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
}
