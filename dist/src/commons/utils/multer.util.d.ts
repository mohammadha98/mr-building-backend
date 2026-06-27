/// <reference types="multer" />
import { Request } from "express";
export type MulterCallbackDestination = (error: Error, destination: string) => void;
export type MulterCallbackFilename = (error: Error, filename: string) => void;
export type MulterFile = Express.Multer.File;
export declare function MulterDestination(dirName: string): (req: Request, file: MulterFile, callback: MulterCallbackDestination) => void;
export declare function MulterFilename(): (req: Request, file: MulterFile, callback: MulterCallbackFilename) => void;
export declare function MulterDiskStorage(dirName: string): import("multer").StorageEngine;
