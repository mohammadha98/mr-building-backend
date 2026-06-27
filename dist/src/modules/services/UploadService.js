"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_audio_duration_1 = require("get-audio-duration");
const fs_1 = require("fs");
const rimraf_1 = require("rimraf");
const process = require("process");
const random_string_generator_util_1 = require("@nestjs/common/utils/random-string-generator.util");
const axios_1 = require("axios");
const fs = require("fs-extra");
const path_1 = require("path");
const filesystem_1 = require("tsconfig-paths/lib/filesystem");
class UploadService {
    constructor() { }
    async getDuration(target, file_name) {
        const paths = this.getPath();
        return await (0, get_audio_duration_1.default)(`${paths}${target}/${file_name}`);
    }
    async generateName(fileName) {
        const name = (0, random_string_generator_util_1.randomStringGenerator)();
        const ext = fileName.split(".").pop();
        return name + "." + ext;
    }
    async moveFile(file_name, source, destination) {
        let origin = "";
        destination.split("/").map(async (item) => {
            origin = origin + "/" + item;
            this.mkdir(origin);
        });
        this.renameSync(file_name, source, destination);
        return {
            file_url: this.getFileUrl(file_name, destination),
            path: destination + file_name,
        };
    }
    async copyFile(source, destination, file_name) {
        let origin = "";
        destination.split("/").map(async (item) => {
            origin = origin + "/" + item;
            this.mkdir(origin);
        });
        const paths = this.getPath();
        const newName = await this.generateName(file_name);
        if ((0, fs_1.existsSync)(`${paths}${source}`)) {
            await (0, fs_1.copyFileSync)(`${paths}${source}`, `${paths}${destination}/${newName}`);
            return this.getFileUrl(newName, destination);
        }
        return null;
    }
    renameSync(file_name, source, destination) {
        const paths = this.getPath();
        (0, fs_1.renameSync)(`${paths}${source}/${file_name}`, `${paths}${destination}/${file_name}`);
    }
    mkdir(target) {
        try {
            const paths = this.getPath();
            if (!(0, fs_1.existsSync)(`${paths}${target}`)) {
                (0, fs_1.mkdirSync)(`${paths}${target}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async removeFile(file, target) {
        const paths = this.getPath();
        try {
            if ((0, filesystem_1.fileExistsSync)(`${paths}${target}/${file}`)) {
                (0, fs_1.unlinkSync)(`${paths}${target}/${file}`);
            }
            return true;
        }
        catch (error) {
            console.log("Error in removeFile: ", error);
            return false;
        }
    }
    async removeDir(target) {
        const paths = this.getPath();
        try {
            rimraf_1.rimraf.sync(`${paths}${target}/`);
            return true;
        }
        catch (error) {
            console.log("Error in removeDir: ", error);
            return false;
        }
    }
    getPath() {
        const ROOT_PATH = process.cwd();
        const APP_CONTENT = process.env.APP_CONTENT;
        return `${ROOT_PATH}${APP_CONTENT}`;
    }
    getFileUrl(file_name, destination) {
        const APP_CONTENT_PATH = process.env.APP_CONTENT_PATH;
        return `${APP_CONTENT_PATH}/${destination}/${file_name}`;
    }
    async downloadFile(url, method = "GET", dest) {
        try {
            const response = await (0, axios_1.default)({
                url,
                method,
                responseType: "stream",
            });
            console.log("downloadedFile Status ", response.status);
            let file = "";
            if (response.status == 200) {
                const filename = url.split("/").pop();
                const newFile = await this.generateName(filename);
                const writer = fs.createWriteStream((0, path_1.join)(process.cwd(), "/public/contents/", dest, newFile));
                response.data.pipe(writer);
                file = (0, path_1.join)("/contents/", dest, newFile);
                return { fileUrl: file, dest, filename: newFile };
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
}
exports.default = UploadService;
//# sourceMappingURL=UploadService.js.map