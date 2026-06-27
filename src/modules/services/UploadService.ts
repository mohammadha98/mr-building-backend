import getAudioDurationInSeconds from "get-audio-duration";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  unlinkSync,
} from "fs";
import { rimraf } from "rimraf";
import * as process from "process";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";

import axios from "axios";
import * as fs from "fs-extra";
import * as path from "path";
import { join } from "path";
import { fileExistsSync } from "tsconfig-paths/lib/filesystem";

export default class UploadService {
  constructor() {}

  public async getDuration(target: string, file_name: string) {
    const paths = this.getPath();
    return await getAudioDurationInSeconds(`${paths}${target}/${file_name}`);
  }

  public async generateName(fileName: string) {
    const name = randomStringGenerator();
    const ext = fileName.split(".").pop();
    return name + "." + ext;
  }

  public async moveFile(
    file_name: string,
    source: string,
    destination: string
  ) {
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

  public async copyFile(
    source: string,
    destination: string,
    file_name: string
  ) {
    let origin = "";
    destination.split("/").map(async (item) => {
      origin = origin + "/" + item;
      this.mkdir(origin);
    });

    const paths = this.getPath();
    const newName = await this.generateName(file_name);

    if (existsSync(`${paths}${source}`)) {
      await copyFileSync(
        `${paths}${source}`,
        `${paths}${destination}/${newName}`
      );

      return this.getFileUrl(newName, destination);
    }
    return null;
  }

  public renameSync(file_name: string, source: string, destination: string) {
    const paths = this.getPath();

    renameSync(
      `${paths}${source}/${file_name}`,
      `${paths}${destination}/${file_name}`
    );
  }

  public mkdir(target: string) {
    try {
      const paths = this.getPath();
      if (!existsSync(`${paths}${target}`)) {
        mkdirSync(`${paths}${target}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async removeFile(file: string, target: string) {
    const paths = this.getPath();
    try {
      if (fileExistsSync(`${paths}${target}/${file}`)) {
        unlinkSync(`${paths}${target}/${file}`);
      }
      return true;
    } catch (error) {
      // TODO test log
      console.log("Error in removeFile: ", error);
      return false;
    }
  }

  public async removeDir(target: string) {
    const paths = this.getPath();
    try {
      rimraf.sync(`${paths}${target}/`);
      return true;
    } catch (error) {
      // TODO test log
      console.log("Error in removeDir: ", error);
      return false;
    }
  }

  public getPath() {
    const ROOT_PATH = process.cwd();
    const APP_CONTENT = process.env.APP_CONTENT;
    return `${ROOT_PATH}${APP_CONTENT}`;
  }

  public getFileUrl(file_name: string, destination: string) {
    const APP_CONTENT_PATH = process.env.APP_CONTENT_PATH;
    return `${APP_CONTENT_PATH}/${destination}/${file_name}`;
  }

  public async downloadFile(url: string, method: string = "GET", dest: string) {
    try {
      const response = await axios({
        url,
        method,
        responseType: "stream",
      });

      console.log("downloadedFile Status ", response.status);

      let file = "";
      if (response.status == 200) {
        const filename = url.split("/").pop();
        const newFile = await this.generateName(filename);
        const writer = fs.createWriteStream(
          join(process.cwd(), "/public/contents/", dest, newFile)
        );

        response.data.pipe(writer);
        file = join("/contents/", dest, newFile);
        return { fileUrl: file, dest, filename: newFile };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
