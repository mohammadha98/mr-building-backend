import { Injectable } from "@nestjs/common";
import { ServicesComments } from "@prisma/client";
import { DateToPersian } from "src/modules/services/DateService";

@Injectable()
export default class ServicesModuleAppTransformer {
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

  public transformComment(item: any, user_id: number) {
    // console.log("transformComment");
    // console.log({ item });

    let is_liked = false;
    let total_like = 0;
    if (item.ServicesCommentLikes && item.ServicesCommentLikes.length > 0) {
      item.ServicesCommentLikes.map((item) => {
        if (item.clientID == user_id) {
          is_liked = true;
        }
      });

      total_like = item.ServicesCommentLikes.length;
    }

    let transform: {
      id: number;
      content: string;
      client_id: number;
      is_replied: boolean;
      is_liked: boolean;
      total_like: number;
      replied_to: any;
      created_at: any;
    } = {
      id: item.id,
      content: item.content,
      client_id: item.client,
      is_replied: item.is_replied,
      is_liked,
      total_like,
      replied_to: [],
      created_at: DateToPersian(item.created_at),
    };

    if (item.replied_by && item.replied_by.length > 0 && item.replied_by[0]) {
      transform = {
        id: item.id,
        content: item.content,
        client_id: item.client,
        is_replied: item.is_replied,
        is_liked,
        total_like,
        replied_to: this.collectionComments(item.replied_by, user_id),
        created_at: DateToPersian(item.created_at),
      };
    }

    return transform;
  }

  public collectionComments(comments: any[], user_id: number) {
    return comments.map((item) => this.transformComment(item, user_id));
  }
}
