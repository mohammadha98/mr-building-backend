import { Injectable } from "@nestjs/common";
import { CreateUploaderDto } from "./dto/create-uploader.dto";
import { existsSync, mkdirSync, renameSync, unlinkSync } from "fs";
import { PrismaService } from "../../../../prisma/prisma.service";
import UploaderFileTypes from "src/commons/contracts/UploaderFileTypes";
import getAudioDurationInSeconds from "get-audio-duration";

import { path } from "@ffmpeg-installer/ffmpeg";
import * as ffmpeg from "fluent-ffmpeg";
import * as fs from "fs";

ffmpeg.setFfmpegPath(path);

@Injectable()
export class UploaderService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploaderFile(body: CreateUploaderDto) {
    const client = await this.prismaService.client.findFirst({
      where: { id: Number(body.client_id) },
    });
    if (!client) {
      return { status: 403 };
    }
    let destination = "";
    // if (body.source === UploaderSources.chat_real_estate) {
    //   destination = `uploader/${UploaderSources.chat_real_estate}/${body.key}`;
    // } else if (body.source === UploaderSources.channel_real_estate) {
    //   destination = `uploader/${UploaderSources.channel_real_estate}/${body.key}`;
    // } else if (body.source === UploaderSources.messenger) {
    //   destination = `uploader/${UploaderSources.messenger}/${body.key}`;
    // } else if (body.source === UploaderSources.messenger_channel) {
    //   destination = `uploader/${UploaderSources.messenger_channel}/${body.key}`;
    // } else if (body.source === UploaderSources.messenger_group) {
    //   destination = `uploader/${UploaderSources.messenger_group}/${body.key}`;
    // } else if (body.source === UploaderSources.messenger_save_message) {
    //   destination = `uploader/${UploaderSources.messenger_save_message}/${body.key}`;
    // }
    //
    destination = `uploader/${body.source}/${body.key}`;

    try {
      const { file_url, path } = await this.moveFile(
        body.file,
        "temp/files",
        destination
      );
      let length = 0;
      let thumbnail = "";
      if (
        body.file_type === UploaderFileTypes.music ||
        body.file_type === UploaderFileTypes.voice ||
        body.file_type === UploaderFileTypes.video
      ) {
        length = await this.getDuration(destination, body.file);
        if (body.file_type === UploaderFileTypes.video) {
          const path = this.getPath();
          const thumbnailName = Date.now() + "-thumb.png";

          ffmpeg({ source: `${path}/${destination}/${body.file}` })
            /*             .on("filenames", (filenames) => {
              console.log("created file names ", filenames);
            })
            .on("end", () => {
              console.log("finished processing");
            }) */
            .takeScreenshots(
              {
                count: 1,
                timemarks: [0],
                filename: thumbnailName,
              },
              `${path}/${destination}/`
            );
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
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  private async getDuration(target: string, file_name: string) {
    const paths = this.getPath();
    return await getAudioDurationInSeconds(`${paths}${target}/${file_name}`);
  }

  private async moveFile(
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
      path: destination + "/" + file_name,
    };
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
      unlinkSync(`${paths}${target}/${file}`);
      return true;
    } catch (error) {
      // TODO test log
      console.log("Error in removeFile: ", error);
      return false;
    }
  }

  private getPath() {
    const ROOT_PATH = process.cwd();
    const APP_CONTENT = process.env.APP_CONTENT;
    return `${ROOT_PATH}${APP_CONTENT}`;
  }

  private getFileUrl(file_name: string, destination: string) {
    const APP_CONTENT_PATH = process.env.APP_CONTENT_PATH;
    return `${APP_CONTENT_PATH}/${destination}/${file_name}`;
  }
}
