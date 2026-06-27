"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeWatermark = void 0;
const fs_1 = require("fs");
const sharp = require("sharp");
const path_1 = require("path");
const process = require("process");
async function SharpPipe(filename, dir) {
    try {
        const pathFile = (0, path_1.join)(process.cwd(), `/public/contents/${dir}`);
        const image = await (0, fs_1.readFileSync)(`${pathFile}${filename}`);
        const newName = `SHRP_${filename}`;
        await sharp(image).resize(240, 340).toFile(`${pathFile}${newName}`);
        return {
            filename: newName,
            path: `${dir}${newName}`,
        };
    }
    catch (e) {
        console.log({ e });
    }
}
exports.default = SharpPipe;
async function MakeWatermark(filename, dir) {
    try {
        console.log("MakeWatermark");
        const pathFile = (0, path_1.join)(process.cwd(), `/public/contents/${dir}`);
        const image = (0, fs_1.readFileSync)(`${pathFile}${filename}`);
        const input = (0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), `/assets/images/watermark.png`));
        await sharp(image)
            .composite([
            {
                input,
                left: 540,
                top: 550,
                blend: "xor",
            },
        ])
            .resize(800, 600)
            .toFile(`${pathFile}${filename}`);
        return {
            filename: filename,
            path: `${dir}${filename}`,
        };
    }
    catch (e) {
        console.log({ e });
    }
}
exports.MakeWatermark = MakeWatermark;
//# sourceMappingURL=SharpPipe.js.map