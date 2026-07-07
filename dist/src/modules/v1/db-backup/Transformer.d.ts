import { DbBackups } from "@prisma/client";
export default class BackupTransformer {
    transform(item: Partial<DbBackups> | any): {
        id: any;
        link: string;
        created_at: string;
    };
    collection(items: any[]): {
        id: any;
        link: string;
        created_at: string;
    }[];
    private calculCreatedAt;
}
