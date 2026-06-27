export default class UploadService {
    constructor();
    getDuration(target: string, file_name: string): Promise<number>;
    generateName(fileName: string): Promise<string>;
    moveFile(file_name: string, source: string, destination: string): Promise<{
        file_url: string;
        path: string;
    }>;
    copyFile(source: string, destination: string, file_name: string): Promise<string>;
    renameSync(file_name: string, source: string, destination: string): void;
    mkdir(target: string): void;
    removeFile(file: string, target: string): Promise<boolean>;
    removeDir(target: string): Promise<boolean>;
    getPath(): string;
    getFileUrl(file_name: string, destination: string): string;
    downloadFile(url: string, method: string, dest: string): Promise<{
        fileUrl: string;
        dest: string;
        filename: string;
    }>;
}
