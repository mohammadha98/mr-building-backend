import { Injectable } from "@nestjs/common";

@Injectable()
export default class ServicesModuleAdminTransformer {
  public transformerMedia(service: any) {
    return {
      id: service.id,
      type: service.type,
      file_type: service.fileType,
      file: service.file
        ? `${process.env.APP_CONTENT_PATH}/services/${service.type}/${service.file}`
        : "",
    };
  }

  public collectionMedia(services: any[]) {
    return services.map((item) => this.transformerMedia(item));
  }

  public transformerService(item: any) {
    return {
      id: item.id,
      description: item.description,
    };
  }
}
