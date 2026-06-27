import { ParseFilePipe, UploadedFile } from "@nestjs/common";

export function CustomUploadedFileDecorator(required: boolean = false) {
  return UploadedFile(
    new ParseFilePipe({
      fileIsRequired: required,
    })
  );
}
