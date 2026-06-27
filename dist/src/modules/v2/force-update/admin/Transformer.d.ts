import ITransformer from "src/commons/contracts/ITransformer";
export default class ForceUpdateTransformer implements ITransformer<any> {
    transform(item: any): {
        id: number;
        installed_version_type: string;
        version: string;
        required: boolean;
        file_name: string;
        indirect_link: string;
        file_url: string;
        status: string;
        content: string;
        items: any[];
        created_at: string;
        total_installs?: undefined;
    } | {
        id: any;
        installed_version_type: any;
        version: any;
        required: any;
        total_installs: any;
        file_name: any;
        indirect_link: any;
        file_url: string;
        status: any;
        content: any;
        items: any;
        created_at: any;
    };
    collection(items: any[]): ({
        id: number;
        installed_version_type: string;
        version: string;
        required: boolean;
        file_name: string;
        indirect_link: string;
        file_url: string;
        status: string;
        content: string;
        items: any[];
        created_at: string;
        total_installs?: undefined;
    } | {
        id: any;
        installed_version_type: any;
        version: any;
        required: any;
        total_installs: any;
        file_name: any;
        indirect_link: any;
        file_url: string;
        status: any;
        content: any;
        items: any;
        created_at: any;
    })[];
}
