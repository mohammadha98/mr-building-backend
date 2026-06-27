import { readFileSync } from "fs";
import * as sharp from "sharp";
import { join } from "path";
import * as process from "process";

export default async function SharpPipe(filename: string, dir: string) {
  try {
    const pathFile = join(process.cwd(), `/public/contents/${dir}`);
    const image = await readFileSync(`${pathFile}${filename}`);

    const newName = `SHRP_${filename}`;
    await sharp(image).resize(240, 340).toFile(`${pathFile}${newName}`);

    return {
      filename: newName,
      path: `${dir}${newName}`,
    };
  } catch (e) {
    console.log({ e });
  }
}

export async function MakeWatermark(filename: string, dir: string) {
  try {
    console.log("MakeWatermark");
    const pathFile = join(process.cwd(), `/public/contents/${dir}`);

    const image = readFileSync(`${pathFile}${filename}`);
    const input = readFileSync(
      join(process.cwd(), `/assets/images/watermark.png`)
    );
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
  } catch (e) {
    console.log({ e });
  }
}
