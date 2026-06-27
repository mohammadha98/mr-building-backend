"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterDiskStorage = exports.MulterFilename = exports.MulterDestination = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const multer_1 = require("multer");
function MulterDestination(dirName) {
    return function (req, file, callback) {
        const path = (0, path_1.join)("public/contents/", dirName);
        (0, fs_1.mkdirSync)(path, { recursive: true });
        callback(null, path);
    };
}
exports.MulterDestination = MulterDestination;
function MulterFilename() {
    return function (req, file, callback) {
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `${Date.now()}-${(0, crypto_1.randomInt)(11111, 99999)}${ext}`;
        callback(null, filename);
    };
}
exports.MulterFilename = MulterFilename;
function MulterDiskStorage(dirName) {
    return (0, multer_1.diskStorage)({
        destination: MulterDestination(dirName),
        filename: MulterFilename(),
    });
}
exports.MulterDiskStorage = MulterDiskStorage;
//# sourceMappingURL=multer.util.js.map