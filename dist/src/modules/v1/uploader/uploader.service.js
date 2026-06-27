"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const UploaderFileTypes_1 = require("../../../commons/contracts/UploaderFileTypes");
const get_audio_duration_1 = require("get-audio-duration");
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpeg_1.path);
let UploaderService = class UploaderService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async uploaderFile(body) {
        const client = await this.prismaService.client.findFirst({
            where: { id: Number(body.client_id) },
        });
        if (!client) {
            return { status: 403 };
        }
        let destination = "";
        destination = `uploader/${body.source}/${body.key}`;
        try {
            const { file_url, path } = await this.moveFile(body.file, "temp/files", destination);
            let length = 0;
            let thumbnail = "";
            if (body.file_type === UploaderFileTypes_1.default.music ||
                body.file_type === UploaderFileTypes_1.default.voice ||
                body.file_type === UploaderFileTypes_1.default.video) {
                length = await this.getDuration(destination, body.file);
                if (body.file_type === UploaderFileTypes_1.default.video) {
                    const path = this.getPath();
                    const thumbnailName = Date.now() + "-thumb.png";
                    ffmpeg({ source: `${path}/${destination}/${body.file}` })
                        .takeScreenshots({
                        count: 1,
                        timemarks: [0],
                        filename: thumbnailName,
                    }, `${path}/${destination}/`);
                    thumbnail = this.getFileUrl(thumbnailName, destination);
                }
            }
            return {
                status: 201,
                result: {
                    file_name: body.file,
                    file_type: body.file_type,
                    source: body.source,
                    file_url,
                    path,
                    size: body.size,
                    length,
                    thumbnail,
                },
            };
        }
        catch (error) {
            console.log(error);
            return { status: 500 };
        }
    }
    async getDuration(target, file_name) {
        const paths = this.getPath();
        return await (0, get_audio_duration_1.default)(`${paths}${target}/${file_name}`);
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
            path: destination + "/" + file_name,
        };
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
            (0, fs_1.unlinkSync)(`${paths}${target}/${file}`);
            return true;
        }
        catch (error) {
            console.log("Error in removeFile: ", error);
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
};
UploaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploaderService);
exports.UploaderService = UploaderService;
//# sourceMappingURL=uploader.service.js.map