import { join, extname } from "path";
import { mkdirSync } from "fs";
import { Request } from "express";
import { randomInt } from "crypto";
import { diskStorage } from "multer";

export type MulterCallbackDestination = (
  error: Error,
  destination: string
) => void;
export type MulterCallbackFilename = (error: Error, filename: string) => void;
export type MulterFile = Express.Multer.File;

export function MulterDestination(dirName: string) {
  return function (
    req: Request,
    file: MulterFile,
    callback: MulterCallbackDestination
  ) {
    const path = join("public/contents/", dirName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function MulterFilename() {
  return function (
    req: Request,
    file: MulterFile,
    callback: MulterCallbackFilename
  ) {
    const ext = extname(file.originalname);
    const filename = `${Date.now()}-${randomInt(11111, 99999)}${ext}`;
    callback(null, filename);
  };
}

export function MulterDiskStorage(dirName: string) {
  return diskStorage({
    destination: MulterDestination(dirName),
    filename: MulterFilename(),
  });
}
